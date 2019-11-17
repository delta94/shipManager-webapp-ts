import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';

import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData<T> {
  list: T[];
  pagination: Partial<TableListPagination>;
}

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps<T>[];
  data: {
    list: T[];
    pagination: StandardTableProps<T>['pagination'];
  };
  selectedRows: T[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps<T> extends ColumnProps<T> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: any): any[] {
  if (!columns) {
    return [];
  }
  const totalList: any[] = [];
  columns.forEach((column: { needTotal: any }) => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState<T> {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps<T>[];
}

class StandardTable<T> extends Component<StandardTableProps<T>, StandardTableState<T>> {
  static getDerivedStateFromProps(nextProps: any) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<T>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<T>['onChange'] = (
    selectedRowKeys,
    selectedRows: T[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<T>['onChange'] = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'key'}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
