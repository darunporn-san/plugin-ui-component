type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD';

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, any>;
  body?: any;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const buildUrl = (url: string, params?: Record<string, any>): string => {
  let fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  
  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .filter(v => v !== undefined && v !== null)
            .map(v => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
            .join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .join('&');
      
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }
  }
  
  return fullUrl;
};

const processResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = response.status !== 204 ? await response.json().catch(() => ({})) : null;
  
  if (!response.ok) {
    const error = new Error(response.statusText) as any;
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return {
    data: data as T,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    ok: response.ok,
  };
};

const request = async <T>(
  method: HttpMethod,
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { params, body, headers = {}, ...rest } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    // credentials: 'include',
    ...rest,
  };
  
  if (method !== 'GET' && method !== 'HEAD' && body) {
    config.body = JSON.stringify(body);
  }
  
  const fullUrl = buildUrl(url, method === 'GET' ? params : undefined);
  
  try {
    const response = await fetch(fullUrl, config);
    return await processResponse<T>(response);
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

export const get = <T>(url: string, options: Omit<RequestOptions, 'body'> = {}) => 
  request<T>('GET', url, options);

export const post = <T>(url: string, body?: any, options: RequestOptions = {}) => 
  request<T>('POST', url, { ...options, body });

export const patch = <T>(url: string, body?: any, options: RequestOptions = {}) => 
  request<T>('PATCH', url, { ...options, body });

export const put = <T>(url: string, body?: any, options: RequestOptions = {}) => 
  request<T>('PUT', url, { ...options, body });

export const del = <T>(url: string, options: RequestOptions = {}) => 
  request<T>('DELETE', url, options);

const http = {
  get,
  post,
  patch,
  put,
  delete: del,
};

export default http;