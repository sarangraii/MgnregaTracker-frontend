import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for Render cold starts
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method.toUpperCase(), config.url);
    console.log('📍 Full URL:', `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error messages
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout after 2 minutes');
      error.userMessage = 'Server is taking too long. Please try again in a minute.';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error');
      error.userMessage = 'Network error. Check your internet connection.';
    } else if (!error.response) {
      console.error('💤 No response - backend might be sleeping');
      error.userMessage = 'Server is starting up. Please wait 60 seconds and try again.';
    } else if (error.response.status === 502 || error.response.status === 503) {
      console.error('🔧 Server unavailable (502/503)');
      error.userMessage = 'Server is restarting. Please try again in a moment.';
    } else {
      console.error('❌ API Error:', error.response.status, error.response.data);
      error.userMessage = `Server error: ${error.response.status}`;
    }
    return Promise.reject(error);
  }
);

// Enhanced retry with exponential backoff
const retryRequest = async (requestFn, maxRetries = 3, initialDelay = 3000) => {
  let currentDelay = initialDelay;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`🔄 Retry ${attempt}/${maxRetries} (waiting ${currentDelay/1000}s)...`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
      
      const result = await requestFn();
      
      if (attempt > 0) {
        console.log(`✅ Success on attempt ${attempt + 1}`);
      }
      
      return result;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = 
        error.code === 'ECONNABORTED' || 
        error.code === 'ERR_NETWORK' ||
        !error.response ||
        error.response?.status === 502 ||
        error.response?.status === 503;
      
      if (isLastAttempt || !isRetryable) {
        console.error(`❌ Failed after ${attempt + 1} attempts`);
        throw error;
      }
      
      currentDelay *= 2; // Exponential backoff: 3s, 6s, 12s
    }
  }
};

// API functions with retry
export const getDistricts = async () => {
  return retryRequest(async () => {
    const response = await api.get('/api/districts');
    return response.data;
  }, 3, 3000);
};

export const getDistrictDetails = async (districtCode) => {
  return retryRequest(async () => {
    const response = await api.get(`/api/districts/${districtCode}`);
    return response.data;
  }, 2, 2000);
};

export const getSummaryStats = async () => {
  return retryRequest(async () => {
    const response = await api.get('/api/stats/summary');
    return response.data;
  }, 2, 2000);
};

export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 5) => {
  return retryRequest(async () => {
    const response = await api.get('/api/stats/top-performers', {
      params: { metric, limit }
    });
    return response.data;
  }, 2, 2000);
};

// Health check - lightweight, no retry
export const pingBackend = async () => {
  try {
    const response = await api.get('/health', { timeout: 10000 });
    console.log('💚 Backend is awake');
    return true;
  } catch (error) {
    console.log('💤 Backend wake-up ping sent');
    return false;
  }
};

// Keep-alive to prevent sleeping (pings every 8 minutes)
export const startKeepAlive = () => {
  console.log('🔥 Starting keep-alive pinger...');
  
  pingBackend();
  
  const interval = setInterval(() => {
    console.log(`⏰ Keep-alive ping at ${new Date().toLocaleTimeString()}`);
    pingBackend();
  }, 8 * 60 * 1000); // 8 minutes
  
  return () => {
    console.log('🛑 Stopping keep-alive');
    clearInterval(interval);
  };
};

export default api;