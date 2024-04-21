export interface Blog {
    id?: string;
    createdAt: Date | string;
    title: string;
    image: string;
    content: string;
    body?: BlogBody
}

export interface BlogBody {
    title: string;
    image: string;
    content: string;
}