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
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', {
        url: error.config?.url,
        message: 'Server did not respond. Please check if the backend is running.'
      });
    } else {
      // Error in request setup
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const getDistricts = async () => {
  try {
    const response = await api.get('/districts');
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const getDistrictDetails = async (districtCode) => {
  try {
    const response = await api.get(`/districts/${districtCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching district ${districtCode}:`, error);
    throw error;
  }
};

export const getSummaryStats = async () => {
  try {
    const response = await api.get('/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    throw error;
  }
};

export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 10) => {
  try {
    const response = await api.get('/stats/top-performers', {
      params: { metric, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top performers:', error);
    throw error;
  }
};

export const refreshData = async () => {
  try {
    const response = await api.post('/refresh-data');
    return response.data;
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
};

export default api;