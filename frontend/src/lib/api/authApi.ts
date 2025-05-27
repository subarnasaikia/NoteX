import { apiClient }  from './client';

export const login = async (credentials: {
  emailAddress?: string;
  username?: string;
  password: string;
}) => {
  const response = await apiClient.post('/user/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.get('/user/logout');
  return response.data;
};

export const me = async () => {
  const response = await apiClient.get('/user/me');
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post('/user/refresh-token');
  return response.data;
};


interface RegisterPayload {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await apiClient.post('/user/register', data);
  return response.data;
};