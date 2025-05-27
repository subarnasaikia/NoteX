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
  const response = await apiClient.post('/user/logout');
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post('/refresh-token');
  return response.data;
};
