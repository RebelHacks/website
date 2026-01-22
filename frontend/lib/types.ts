/**
 * API Response Types
 * Define your data structures here to ensure type safety across the app
 */

// Health check response
export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

// Generic item type
export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
}

// List response with pagination info
export interface ItemListResponse {
  items: Item[];
  total: number;
}

// Submit response
export interface SubmitResponse {
  success: boolean;
  message: string;
  received?: Record<string, unknown>;
  error?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
}

// API Error response
export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search parameters
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, string | number | boolean>;
}

