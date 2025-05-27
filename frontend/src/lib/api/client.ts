import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ allow sending HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});