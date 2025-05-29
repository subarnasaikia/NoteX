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


export const fetchAllContents = async () => {
  const response = await apiClient.get("notes/contents/fetch-all-contents");
  return response.data;
}

export const fetchContentById = async (contentId: string) => {
  const response = await apiClient.get(`notes/contents/fetch-content/${contentId}`);
  return response.data;
};


export const updateContentById = async (contentId: string, data: {
  title: string;
  hex_color: string;
  body: any;
  parentFolderId: string | null;
  tags?: string[];
}) => {
  const response = await apiClient.patch(`/notes/contents/update-content/${contentId}`, data);
  return response.data;
};


export const deleteContentById = async (contentId: string) => {
  const response = await apiClient.delete(`/notes/contents/delete-content/${contentId}`);
  return response.data;
};

export const searchContent = async (query: string) => {
  const response = await apiClient.post("/notes/search-content/", { query });
  return response.data;
};
