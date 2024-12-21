// Renombramos ApiResponse a TodoApiResponse para evitar conflictos
export interface TodoApiResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: Pagination;
  };
}

export interface ApiTodo {
  id: string;
  title: string;
  description: string;
  completed: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
}