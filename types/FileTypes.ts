export interface File {
	id: string;
	type: string;
	name: string;
	size: number;
	modified?: boolean;
	url: string;
}

export interface MyFilesProps {
	files: File[];
	folders: any;
}

export interface SharedFileResponse {
	id: string;
	token: string;
	createdAt: number;
	file: File;
}
