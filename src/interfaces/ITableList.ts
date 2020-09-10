export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface PageableData<T> {
  list: T[];
  pagination: Pagination;
}

export type IPageableFilter<T> = {
  pageSize?: number;
  current?: number;
} & Partial<T>
