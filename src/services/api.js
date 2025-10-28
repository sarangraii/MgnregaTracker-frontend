import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
    console.error('Error fetching district details:', error);
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

export const getTopPerformers = async (metric = 'personDaysGenerated', limit = 5) => {
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

export default api;