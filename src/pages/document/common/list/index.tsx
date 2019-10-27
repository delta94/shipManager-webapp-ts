import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Popconfirm, Input, Select, Button, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import { CompanySheetState } from '@/models/companySheet';
import { TableListItem, TableListData, TableListPagination } from '../../companySheet.d';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const FormItem = Form.Item;
const { Option } = Select;

interface CompanySheetListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  companySheet: CompanySheetState;
}

@connect(
  ({
    companySheet,
    loading,
  }: {
    companySheet: CompanySheetState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    companySheet,
    loading: loading.effects['companySheet/fetchCommonSheet'],
  }),
)
class CommonDocument extends React.Component<CompanySheetListProps> {
  state = {
    modalVisible: false,
    updateModalVisible: false,
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
      title: '文件类型',
      dataIndex: 'typeName',
    },
    {
      title: '上传者',
      dataIndex: 'uploader',
    },
    {
      title: '上传日期',
      dataIndex: 'updateAt',
    },
    {
      title: '操作',
      render: (text: any, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handleInfoCompanyCert(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateCompanyCert(record)}>修改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => this.handleRemoveCompanyCert(record.id)}
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
    dispatch({ type: 'companySheet/fetchCommonSheet' });
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const certificateTypes = undefined;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="证书名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="证书类型">
              {getFieldDecorator('typeId', {
                rules: [
                  {
                    required: false,
                    message: '请选择证书类型',
                  },
                ],
              })(
                <Select placeholder="请选择证书类型">
                  <Option value={undefined} key={99}>
                    不限证书类型
                  </Option>
                  {certificateTypes &&
                    certificateTypes.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
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

  handleInfoCompanyCert(record: TableListItem) {
    //this.props.dispatch(routerRedux.push(`/company/infoCert/${record.id}`));
  }

  handleUpdateCompanyCert(record: TableListItem) {
    //this.props.dispatch(routerRedux.push(`/company/updateCert/${record.id}`));
  }

  handleRemoveCompanyCert(key: number) {
    // this.props.dispatch({
    //   type: 'companyCert/remove',
    //   payload: key,
    //   callback: () => message.success('证书已成功删除'),
    // });
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

      if (fieldsValue.typeId !== undefined) {
        values['typeId.equals'] = fieldsValue.typeId;
      }

      this.setState({ formValues: values });

      dispatch({
        type: 'companySheet/fetch',
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
      type: 'companySheet/fetch',
      payload: {},
    });
  };

  handleCreateCert = () => {
    //this.props.dispatch(routerRedux.push('/company/addCert'));
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
      type: 'companySheet/fetch',
      payload: params,
    });
  };

  render() {
    const {
      companySheet: { common_sheet },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="固定表单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={common_sheet as TableListData}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<CompanySheetListProps>()(CommonDocument);
