// types/index.ts (or put at top of your file)

export interface Note {
  _id: string;
  title: string;
  hex_color: string;
  body: {
    type: string;
    bodyContent: string;
  };
  parentFolderId: string | null;
  userId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FolderData {
  _id: string;
  folderName: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
