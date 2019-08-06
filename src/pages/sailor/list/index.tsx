import {
  Popconfirm,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import {routerRedux} from "dva/router";
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';

import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import {TableListData, TableListItem, TableListPagination} from './sailor.d';

import styles from './style.less';
import {SailorModelState} from "@/models/sailor";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) => Object.keys(obj).map(key => obj[key]).join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  sailor: SailorModelState;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
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
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '常任职位',
      dataIndex: 'positionName'
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '身份证',
      dataIndex: 'identityNumber'
    },
    {
      title: '是否高级船员',
      dataIndex: 'isAdvanced',
      render: val => val ? "是" : "否",
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleInfoSailor(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateSailor(record)}>修改</a>
          <Divider type="vertical" />
          <span>
             <Popconfirm title="是否要删除此船员？" onConfirm={() => this.handleRemoveSailor(record)}>
                <a>删除</a>
             </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  handleInfoSailor = (record: TableListItem) => {
    this.props.dispatch(routerRedux.push(`/person/sailor/profile/${record.id}`))
  };

  handleUpdateSailor = (record: TableListItem) => {
    this.props.dispatch(routerRedux.push(`/person/sailor/update/${record.id}`))
  };

  handleRemoveSailor = (record: TableListItem) => {
    this.props.dispatch({
      type: "sailor/remove",
      payload: record.id,
      callback: () => {
        message.success("船员已成功删除")
      }
    })
  };

  componentDidMount() {
    this.props.dispatch({ type: 'sailor/fetchPositionTypes' });
    this.props.dispatch({ type: 'sailor/fetch'});
  }

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
      //@ts-ignore
      params.sort = `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"}`;
    }

    dispatch({
      type: 'sailor/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sailor/fetch',
      payload: {},
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent)  => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let values = {};

      if (fieldsValue.typeId !== undefined) {
        values["typeId.equals"] = fieldsValue.typeId
      }

      if (fieldsValue.name !== undefined) {
        values["name.contains"] = fieldsValue.name;
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sailor/fetch',
        payload: values,
      });
    });
  };

  handleClickAdd = () => {
    this.props.dispatch(routerRedux.push("/person/sailor/create/"));
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      sailor: { positions }
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
              {getFieldDecorator('positionId', {
                rules: [
                  {
                    required: false,
                    message: '请输入职位',
                  }
                ],
              })(
                <Select placeholder="请选择职位">
                  {
                    positions && positions.map((item, index) => {
                      return <Option value={item.id} key={index}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否高级">
              {getFieldDecorator('isAdvanced')(
                <Select placeholder="请选择是否高级">
                  <Option value={1} key={1}>是</Option>
                  <Option value={2} key={2}>否</Option>
                  <Option value={3} key={3}>不限</Option>
                </Select>
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

  render() {
    const {
      sailor: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleClickAdd}>
                新建
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
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
