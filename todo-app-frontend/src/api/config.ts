import axios from 'axios';

const baseURL = __DEV__ 
  ? 'http://10.0.2.2:3000/api/v1'
  : 'http://tu-servidor-produccion.com/api/v1';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;