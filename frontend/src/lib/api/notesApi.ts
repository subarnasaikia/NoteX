import { apiClient }  from './client';


export const createContent = async (data: {
  title: string;
  hex_color: string;
  body: any;
  parentFolderId: string | null;
  tags?: string[];
}) => {
  const response = await apiClient.post("/notes/contents/create-content", data);
  return response.data;
};


export const fetchContentById = async (contentId: string) => {
  const response = await apiClient.get(`notes/contents/fetch-content/${contentId}`);
  return response.data;
};


export const updateContentById = async (contentId: string, data: {
  title: string;
  hex_color: string;
  body: any;
  parentFolderId: string;
  tags?: string[];
}) => {
  const response = await apiClient.put(`/notes/update-content/${contentId}`, data);
  return response.data;
};


export const deleteContentById = async (contentId: string) => {
  const response = await apiClient.delete(`/notes/delete-content/${contentId}`);
  return response.data;
};

export const searchContent = async (query: string) => {
  const response = await apiClient.post("/notes/search-content/", { query });
  return response.data;
};
