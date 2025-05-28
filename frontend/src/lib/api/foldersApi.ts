import { apiClient }  from './client';

export const createFolder = async (folderDetails: {
  folderName: string;
  description: string;
  hex_color?: string;
  parentFolderId?: string | null;
}) => {
  const response = await apiClient.post('/notes/folders/create-folder', folderDetails);
  return response.data;
};


export const fetchFolders = async () => {
  const response = await apiClient.get('/notes/folders/fetch-folders');
  return response.data;
};


export const updateFolder = async (folderId: string, updateDetails: {
  folderName: string;
  description: string;
  hex_color?: string;
}) => {
  const response = await apiClient.put(`/notes/folders/update-folder/${folderId}`, updateDetails);
  return response.data;
};


export const fetchRootContents = async () => {
  const response = await apiClient.get(`notes/folders/fetch-root-folder-contents`);
  return response.data;
};


export const deleteFolder = async (folderId: string) => {
  const response = await apiClient.delete(`/notes/folders/delete-folder/${folderId}`);
  return response.data;
};

export const fetchFoldersWithPagination = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get(`/notes/folders/fetch-folders/root/page/${page}/limit/${limit}`);
  return response.data;
};


export const fetchFolderContentFromFolderId = async ({
  folderId,
  page = 1,
  limit = 10,
}: {
  folderId: string;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get(
    `/notes/folders/fetch-folder/${folderId}/page/${page}/limit/${limit}`
  );
  return response.data;
};