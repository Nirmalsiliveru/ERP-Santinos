export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
