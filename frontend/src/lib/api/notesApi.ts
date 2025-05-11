import { apiClient } from './client';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

const notesApi = {
  // Get all notes
  getNotes: async (): Promise<Note[]> => {
    const response = await apiClient.get('/notes');
    return response.data;
  },

  // Get a single note by ID
  getNote: async (id: string): Promise<Note> => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  // Create a new note
  createNote: async (data: CreateNoteRequest): Promise<Note> => {
    const response = await apiClient.post('/notes', data);
    return response.data;
  },

  // Update an existing note
  updateNote: async (id: string, data: UpdateNoteRequest): Promise<Note> => {
    const response = await apiClient.put(`/notes/${id}`, data);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id: string): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },
};

export default notesApi;