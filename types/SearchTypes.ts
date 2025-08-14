export interface Folder {
	id: string;
	name: string;
	userId: string;
	createdAt: string;
}

export interface File {
	id: string;
	name: string;
	folderId: string;
	url: string;
	uploadedAt: string;
}

export interface SearchResult {
	folders: Folder[];
	files: File[];
}
