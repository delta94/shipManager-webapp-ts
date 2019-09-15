import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Popconfirm, Input, Button, Divider, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import { CompanyLicenseModelState } from '@/models/companyLicense';
import { TableListItem, TableListData, TableListPagination } from './companyLicense.d';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const FormItem = Form.Item;

interface CompanyLicenseListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  companyLicense: CompanyLicenseModelState;
}

@connect(
  ({
    companyLicense,
    loading,
  }: {
    companyLicense: CompanyLicenseModelState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    companyLicense,
    loading: loading.effects['companyLicense/fetch'],
  }),
)
class CompanyLicenseList extends React.Component<CompanyLicenseListProps> {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '批文号',
      dataIndex: 'identityNumber',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '有效期',
      dataIndex: 'expireAt',
    },
    {
      title: '操作',
      render: (text: any, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handleInfoCompanyLicense(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateCompanyLicense(record)}>修改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => this.handleRemoveCompanyLicense(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'companyLicense/fetch' });
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="批文名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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

  handleInfoCompanyLicense(record: TableListItem) {
    this.props.dispatch(routerRedux.push(`/company/infoLicense/${record.id}`));
  }

  handleUpdateCompanyLicense(record: TableListItem) {
    this.props.dispatch(routerRedux.push(`/company/updateLicense/${record.id}`));
  }

  handleRemoveCompanyLicense(key: number) {
    this.props.dispatch({
      type: 'companyLicense/remove',
      payload: key,
      callback: () => message.success('批文已成功删除'),
    });
  }

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};

      if (fieldsValue.name !== undefined) {
        values['name.contains'] = fieldsValue.name;
      }

      this.setState({ formValues: values });

      dispatch({
        type: 'companyLicense/fetch',
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
      type: 'companyLicense/fetch',
      payload: {},
    });
  };

  handleCreateLicense = () => {
    this.props.dispatch(routerRedux.push('/company/addLicense'));
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
      type: 'companyLicense/fetch',
      payload: params,
    });
  };

  render() {
    const {
      companyLicense: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="公司批文列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleCreateLicense}>
              新建公司批文
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
    );
  }
}

export default Form.create<CompanyLicenseListProps>()(CompanyLicenseList);
