// src/utils/pagination.util.ts
interface PaginationParams {
    page: number;
    limit: number;
  }
  
  interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
    };
  }
  
  export class PaginationUtil {
    static readonly DEFAULT_PAGE = 1;
    static readonly DEFAULT_LIMIT = 10;
    static readonly MAX_LIMIT = 100;
  
    /**
     * Obtiene y valida los parámetros de paginación de la request
     */
    static getParams(query: any): PaginationParams {
      const page = Math.max(1, parseInt(query.page as string) || this.DEFAULT_PAGE);
      const limit = Math.min(
        this.MAX_LIMIT,
        Math.max(1, parseInt(query.limit as string) || this.DEFAULT_LIMIT)
      );
  
      return { page, limit };
    }
  
    /**
     * Calcula el offset para la consulta SQL
     */
    static getOffset({ page, limit }: PaginationParams): number {
      return (page - 1) * limit;
    }
  
    /**
     * Calcula el número total de páginas
     */
    static getTotalPages(total: number, limit: number): number {
      return Math.ceil(total / limit);
    }
  
    /**
     * Genera la respuesta paginada
     */
    static createPaginatedResponse<T>(
      data: T[],
      total: number,
      { page, limit }: PaginationParams
    ): PaginatedResponse<T> {
      const totalPages = this.getTotalPages(total, limit);
  
      return {
        data,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages
        }
      };
    }
  
    /**
     * Genera la cláusula LIMIT para MySQL
     */
    static getLimitClause({ page, limit }: PaginationParams): string {
      const offset = this.getOffset({ page, limit });
      return `LIMIT ${limit} OFFSET ${offset}`;
    }
  
    /**
     * Valida los parámetros de paginación
     */
    static validateParams(page?: number, limit?: number): PaginationParams {
      const validPage = Math.max(1, page || this.DEFAULT_PAGE);
      const validLimit = Math.min(
        this.MAX_LIMIT,
        Math.max(1, limit || this.DEFAULT_LIMIT)
      );
  
      return { page: validPage, limit: validLimit };
    }
  }
  
  export type { PaginationParams, PaginatedResponse };