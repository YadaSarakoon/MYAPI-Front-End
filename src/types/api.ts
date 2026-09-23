export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiCollectionItem {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  summary?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface AppRouteConfig {
  path: string;
  name: string;
  protected?: boolean;
}
