// Arquivo para configurar a comunicação com o backend
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.pdf-reader.com/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await api.post('/upload', formData);
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload do PDF:', error);
    throw error;
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar status do servidor:', error);
    throw error;
  }
};

export default api;
