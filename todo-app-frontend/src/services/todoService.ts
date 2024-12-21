import axios from 'axios';
import { Platform } from 'react-native';

// Configuración base de la API
const BASE_URL = Platform.select({
  android: 'https://cd14-191-156-251-187.ngrok-free.app/api/v1',
  ios: 'https://cd14-191-156-251-187.ngrok-free.app/api/v1',
  default: 'http://localhost:3000/api/v1',
});

// Crear instancia de axios con configuración personalizada
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error de API completo:', error);
    
    if (error.response) {
      console.error('Datos de error:', error.response.data);
      console.error('Estado de error:', error.response.status);
    } else if (error.request) {
      console.error('Sin respuesta del servidor:', error.request);
    } else {
      console.error('Error de configuración:', error.message);
    }
    
    throw error;
  }
);

export const TodoService = {
  // Obtener todos los todos con paginación
  getAllTodos: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/todos', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos:', error);
      throw error;
    }
  },

  // Obtener un todo por ID
  getTodoById: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener todo con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', {
        title: todoData.title,
        description: todoData.description
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear todo:', error);
      throw error;
    }
  },

  // Actualizar un todo existente
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, {
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar todo con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un todo
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar todo con ID ${id}:`, error);
      throw error;
    }
  },

  // Método de búsqueda (opcional)
  searchTodos: async (query, page = 1, limit = 10) => {
    try {
      const response = await api.get('/todos/search', {
        params: { 
          query, 
          page, 
          limit 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar todos:', error);
      throw error;
    }
  }
};