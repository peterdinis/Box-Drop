export interface BulkDeleteFilesParams {
	fileIds: string[];
}

export interface BulkDeleteFilesResponse {
	success: boolean;
	deleted: number;
}
