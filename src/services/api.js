// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export const getDistricts = async () => {
//   try {
//     const response = await api.get('/districts');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching districts:', error);
//     throw error;
//   }
// };

// export const getDistrictDetails = async (districtCode) => {
//   try {
//     const response = await api.get(`/districts/${districtCode}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching district details:', error);
//     throw error;
//   }
// };

// export const getSummaryStats = async () => {
//   try {
//     const response = await api.get('/stats/summary');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching summary stats:', error);
//     throw error;
//   }
// };

// export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 5) => {
//   try {
//     const response = await api.get('/stats/top-performers', {
//       params: { metric, limit }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching top performers:', error);
//     throw error;
//   }
// };

// export default api;
// import axios from 'axios';

// // Remove /api from the fallback too
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000, // Increased to 30 seconds (Render can be slow on free tier)
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add interceptors for better debugging
// api.interceptors.request.use(
//   (config) => {
//     console.log('API Request:', config.method.toUpperCase(), config.url);
//     console.log('Full URL:', `${config.baseURL}${config.url}`);
//     return config;
//   },
//   (error) => {
//     console.error('Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     console.log('API Response:', response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     if (error.code === 'ECONNABORTED') {
//       console.error('❌ Request timeout - backend is slow or not responding');
//     } else if (!error.response) {
//       console.error('❌ No response - backend might be down or sleeping');
//     } else {
//       console.error('❌ API Error:', error.response.status, error.response.data);
//     }
//     return Promise.reject(error);
//   }
// );

// export const getDistricts = async () => {
//   try {
//     const response = await api.get('/api/districts');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching districts:', error);
//     throw error;
//   }
// };

// export const getDistrictDetails = async (districtCode) => {
//   try {
//     const response = await api.get(`/api/districts/${districtCode}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching district details:', error);
//     throw error;
//   }
// };

// export const getSummaryStats = async () => {
//   try {
//     const response = await api.get('/api/stats/summary');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching summary stats:', error);
//     throw error;
//   }
// };

// export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 5) => {
//   try {
//     const response = await api.get('/api/stats/top-performers', {
//       params: { metric, limit }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching top performers:', error);
//     throw error;
//   }
// };

// export default api;
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds for initial wake-up (Render free tier sleeps)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for better debugging
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

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - backend is waking up or slow');
    } else if (!error.response) {
      console.error('💤 No response - backend might be sleeping (Render free tier)');
    } else {
      console.error('❌ API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

// Retry helper function
const retryRequest = async (requestFn, retries = 2, initialDelay = 2000) => {
  let currentDelay = initialDelay;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(attempt > 0 ? `🔄 Retry attempt ${attempt}/${retries}...` : '📡 Making request...');
      const result = await requestFn();
      return result;
    } catch (error) {
      // If it's the last attempt or not a timeout/network error, throw
      if (attempt === retries || 
          (error.code !== 'ECONNABORTED' && error.code !== 'ERR_NETWORK')) {
        throw error;
      }
      
      console.log(`⏳ Waiting ${currentDelay/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      // Increase delay for next retry
      currentDelay *= 1.5;
    }
  }
};

// Main API functions with retry logic
export const getDistricts = async () => {
  return retryRequest(async () => {
    const response = await api.get('/api/districts');
    return response.data;
  });
};

export const getDistrictDetails = async (districtCode) => {
  return retryRequest(async () => {
    const response = await api.get(`/api/districts/${districtCode}`);
    return response.data;
  });
};

export const getSummaryStats = async () => {
  return retryRequest(async () => {
    const response = await api.get('/api/stats/summary');
    return response.data;
  });
};

export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 5) => {
  return retryRequest(async () => {
    const response = await api.get('/api/stats/top-performers', {
      params: { metric, limit }
    });
    return response.data;
  });
};

// Health check endpoint to keep backend awake
export const pingBackend = async () => {
  try {
    await api.get('/health', { timeout: 5000 });
    console.log('💚 Backend is awake');
  } catch (error) {
    console.log('💤 Backend wake-up ping sent');
  }
};

// Keep-alive function to prevent backend from sleeping
export const startKeepAlive = () => {
  // Ping immediately on start
  pingBackend();
  
  // Then ping every 10 minutes
  const interval = setInterval(() => {
    pingBackend();
  }, 10 * 60 * 1000); // 10 minutes
  
  return () => clearInterval(interval);
};

export default api;