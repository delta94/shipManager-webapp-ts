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
  pagination: Partial<Pagination>;
}

export interface ITableResult<T> {
  total: number;
  list: T[];
}
