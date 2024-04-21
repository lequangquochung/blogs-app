export interface IResponseData<T> {
    data?: T,
    errors: IErrorResponseData[];
    message: string,
    statusCode: number,
    messages: T[],
    exception: string,
    errorId: string
}

export interface IPaginator<T> {
    data: T,
    pageSize: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    totalCount: number,
    totalPages: number
}

export interface IErrorResponseData {
    propertyName: string,
    errorMessage: string
}

export type SearchRequest = {
    page? : number;
    limit? : number;
    sortBy? : string;
    order? : 'asc' | 'desc';
    search? : string;
}