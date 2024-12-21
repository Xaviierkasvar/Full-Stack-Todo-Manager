// src/types/todo.types.ts
export interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTodoDTO {
    title: string;
    description: string;
}

export interface UpdateTodoDTO {
    title?: string;
    description?: string;
    completed?: boolean;
}