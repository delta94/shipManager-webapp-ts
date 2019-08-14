import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Popconfirm,
  Input,
  Select,
  Button,
  Divider,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import { ManagerModelState } from '@/models/manager';
import { TableListItem, TableListData, TableListPagination } from './manager.d';

const getValue = (obj: { [x: string]: string[] }) => Object.keys(obj).map(key => obj[key]).join(',');

const FormItem = Form.Item;
const { Option } = Select;

interface ManagerListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  manager: ManagerModelState;
}

@connect(({ manager, loading }: {
  manager: ManagerModelState,
  loading: { effects: { [key: string]: boolean } }
}) => ({
  manager,
  loading: loading.effects['manager/fetch'],
}))
class ManagerList extends React.Component<ManagerListProps> {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '职务',
      dataIndex: 'position',
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
      title: '指定职位',
      dataIndex: 'assignerName',
    },

    {
      title: '操作',
      render: (text: any, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handleInfoManager(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateManager(record)}>修改</a>
          <Divider type="vertical" />
          <span>
             <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleRemoveManagerCert(record.id)}>
                <a>删除</a>
             </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'manager/fetchAssignerPositions' });
    dispatch({ type: 'manager/fetch' });
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      manager: { assignerPositions },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="职位">
              {getFieldDecorator('assignerId', {
                rules: [
                  {
                    required: false,
                    message: '请输入指定职位',
                  },
                ],
              })(
                <Select placeholder="请选择指定职位">
                  <Option value={undefined} key={99}>不限职位</Option>
                  {
                    assignerPositions && assignerPositions.map((item, index) => <Option value={item.id} key={index}>{item.name}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleInfoManager(record: TableListItem) {
    this.props.dispatch(routerRedux.push(`/person/manager/profile/${record.id}`))
  }

  handleUpdateManager(record: TableListItem) {
    this.props.dispatch(routerRedux.push(`/person/manager/update/${record.id}`))
  }

  handleRemoveManagerCert(key: number) {
    this.props.dispatch({
      type: 'manager/remove',
      payload: key,
      callback: this.handleManagerRemoved,
    })
  }

  handleManagerRemoved = () => {
    message.success('管理人员已成功删除')
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};

      if (fieldsValue.isAdvanced !== undefined) {
        values['isAdvanced.equals'] = fieldsValue.isAdvanced;
      }

      if (fieldsValue.name !== undefined) {
        values['name.contains'] = fieldsValue.name;
      }

      if (fieldsValue.assignerId !== undefined) {
        values['assignerId.equals'] = fieldsValue.assignerId;
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'manager/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'manager/fetch',
      payload: {},
    });
  };

  handleCreateManager = () => {
    this.props.dispatch(routerRedux.push('/person/manager/create'))
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      // @ts-ignore
      params.sort = `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }

    dispatch({
      type: 'manager/fetch',
      payload: params,
    });
  };

  render() {
    const {
      manager: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="管理人员列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleCreateManager()}>
              新建管理人员
            </Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data as TableListData}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<ManagerListProps>()(ManagerList);
