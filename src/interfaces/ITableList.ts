export interface ITableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ITableListData<T> {
  list: T[];
  pagination: Partial<ITableListPagination>;
}
