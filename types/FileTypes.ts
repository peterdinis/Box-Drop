export interface File {
	id: string;
	type: string;
	name: string;
	size: number;
	modified?: boolean;
	url: string;
}

export interface Folder {
	id: string;
	name: string;
}

export interface MyFilesProps {
	files: File[];
	folders: {
		items: Folder[];
	};
}

export interface SharedFileResponse {
	id: string;
	token: string;
	createdAt: number;
	file: File;
}
