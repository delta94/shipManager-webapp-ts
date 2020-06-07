import React from 'react'
import { Table } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { SailorModelState } from '@/models/sailor';
import { TableListPagination } from '@/pages/sailor/list/sailor';
import ISailor from '@/interfaces/ISailor';

interface SailorListTableProps {
  previousSelectedKeys?: any[]
  sailor?: SailorModelState
  loading?: boolean
  dispatch?: Dispatch<any>;
  onChange(sailors: Partial<ISailor>[]): void
}

interface SailorListTableState {
  selectedRowKeys: any[]
}

@connect(
  ({
     sailor,
     loading,
   }: {
    sailor: SailorModelState;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sailor,
    loading: loading.models.ship,
  }),
)
class SailorListTable extends React.Component<SailorListTableProps, SailorListTableState> {
  constructor(props: SailorListTableProps) {
    super(props)

    if (props.previousSelectedKeys && props.previousSelectedKeys.length > 0) {
      this.state = {
        selectedRowKeys: props.previousSelectedKeys,
      }
    } else {
      this.state = {
        selectedRowKeys: [],
      }
    }
  }

  columns= [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '常任职位',
      dataIndex: 'positionName',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '身份证',
      dataIndex: 'identityNumber',
    },
    {
      title: '是否高级船员',
      dataIndex: 'isAdvanced',
      render: (val: boolean) => (val ? '是' : '否'),
    },
  ];

  handleStandardTableChange = (pagination: Partial<TableListPagination>) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      size: pagination.pageSize,
    };
    dispatch && dispatch({
      type: 'sailor/fetch',
      payload: params,
    });
  };

  onSelectChange = (selectedRowKeys: any[], selectedRows: any[]) => {
    this.setState({ selectedRowKeys });
    this.props.onChange(selectedRows)
  };

  componentDidMount() {
    this.props.dispatch!({ type: 'sailor/fetch' });
  }

  render() {
    const { sailor, loading } = this.props;
    const { selectedRowKeys } = this.state;

    const hasSelected = selectedRowKeys.length > 0;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 24 }}>
            选择了 {hasSelected ? ` ${selectedRowKeys.length} ` : 0} 名船员
          </span>
        </div>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={this.columns}
          dataSource={sailor && sailor.data.list}
          pagination={sailor && sailor.data.pagination}
          loading={loading}
          size="small"
          onChange={this.handleStandardTableChange}
        />
      </>

    );
  }
}

export default SailorListTable
