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

// Remove /api from the fallback too
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds (Render can be slow on free tier)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for better debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    console.log('Full URL:', `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - backend is slow or not responding');
    } else if (!error.response) {
      console.error('❌ No response - backend might be down or sleeping');
    } else {
      console.error('❌ API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export const getDistricts = async () => {
  try {
    const response = await api.get('/api/districts');
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const getDistrictDetails = async (districtCode) => {
  try {
    const response = await api.get(`/api/districts/${districtCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching district details:', error);
    throw error;
  }
};

export const getSummaryStats = async () => {
  try {
    const response = await api.get('/api/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    throw error;
  }
};

export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 5) => {
  try {
    const response = await api.get('/api/stats/top-performers', {
      params: { metric, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top performers:', error);
    throw error;
  }
};

export default api;
