interface FileItem {
    id: string;
    name: string;
}

export interface FolderItem {
    id: string;
    name: string;
    files?: FileItem[];
}

export interface MyFoldersProps {
    folders?: { items: FolderItem[] };
    pageSize?: number;
}