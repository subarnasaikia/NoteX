import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshToken } from './authApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ allow sending HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keep track of if we're refreshing the token to avoid infinite loops
// let isRefreshing = false;
// // Queue of requests that failed due to token expiration
// let failedQueue: any[] = [];

// const processQueue = (error: AxiosError | null, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

// // Response interceptor for handling 401 errors (token expired)
// apiClient.interceptors.response.use(
//   (response) => response, 
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If error is 401 (Unauthorized) and we haven't already tried to refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // If we're already refreshing, add request to queue
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => {
//           return apiClient(originalRequest);
//         }).catch(err => {
//           return Promise.reject(err);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // Call the refresh token endpoint
//         await refreshToken();
        
//         // Process any queued requests
//         processQueue(null);
        
//         // Retry the original request
//         isRefreshing = false;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         // If refresh token fails, process queue with error
//         processQueue(refreshError as AxiosError);
//         isRefreshing = false;
        
//         // Redirect to login page if refresh token fails
//         if (typeof window !== 'undefined') {
//           window.location.href = '/'; // Redirect to login page
//         }
        
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );