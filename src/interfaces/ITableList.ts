export interface ITableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface PageableData<T> {
  list: T[];
  pagination: Pagination;
}

export interface ITableResult<T> {
  total: number;
  list: T[];
}

export type IPageableFilter<T> = {
  pageSize?: number;
  current?: number;
} & Partial<T>
