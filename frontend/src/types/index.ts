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

export type Quiz = {
	_id: string;
	title: string;
	hex_color: string;
	tags: string[];
	isAppeared: boolean;
	userId: string;
	createdAt: string; // or `Date` if you're parsing it
	updatedAt: string; // or `Date` if you're parsing it
};

export type Revision = {
	_id: string;
	title: string;
	hex_color: string;
	tags: string[];
	userId: string;
	createdAt: string;
	updatedAt: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};