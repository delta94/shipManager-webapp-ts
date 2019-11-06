import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Popconfirm, Divider, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import StandardTable from './components/StandardTable';
import { CompanySheetState } from '@/models/companySheet';
import { TableListItem, TableListData, TableListPagination } from '../../companySheet.d';
import StandardFormRow from '@/components/StandardFormRow';
import TagSelect from '@/components/TagSelect';
import Search from 'antd/es/input/Search';
import styles from '@/pages/ship/list/style.less';
import { routerRedux } from 'dva/router';
import OSSClient from '@/utils/OSSClient';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const FormItem = Form.Item;

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
    loading: loading.effects['companySheet/fetchTemplateSheet'],
  }),
)
class TemplateDocument extends React.Component<CompanySheetListProps> {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    selectedTags: [],
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
          <a onClick={() => this.handleInfoCompanyTemplateSheet(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDownloadCompanyCommonSheet(record)}>下载</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm
              title="是否要删除此文件？"
              onConfirm={() => this.handleRemoveCompanyTemplateSheet(record.id)}
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
    dispatch({ type: 'companySheet/fetchTemplateSheet' });
    dispatch({ type: 'companySheet/fetchSheetTypes' });
  }

  handleInfoCompanyTemplateSheet(record: TableListItem) {
    this.props.dispatch(routerRedux.push(`/document/profile/${record.id}`));
  }

  async handleDownloadCompanyCommonSheet(record: TableListItem) {
    let ossKey = record.ossFile;
    let client = await OSSClient.getInstance();
    let url = client.signatureUrl(ossKey);
    let a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  handleRemoveCompanyTemplateSheet(id: number) {
    this.props.dispatch({
      type: 'companySheet/removeSheet',
      payload: id,
      callback: () => {
        message.success('文件已成功删除');
        this.props.dispatch({ type: 'companySheet/fetchTemplateSheet' });
      },
    });
  }

  handleChangeTags = (values: (string | number)[]) => {
    this.setState({ selectedTags: values }, () => {
      this.handleSearch();
    });
  };

  handleSearch = (e?: React.FormEvent) => {
    e && e.preventDefault();

    const { dispatch, form } = this.props;
    const selectedTags = this.state.selectedTags;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};

      if (fieldsValue.name !== undefined) {
        values['name.contains'] = fieldsValue.name;
      }

      if (selectedTags.length > 0) {
        values['typeId.in'] = selectedTags;
      }

      this.setState({ formValues: values });

      dispatch({
        type: 'companySheet/fetchTemplateSheet',
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
      type: 'companySheet/fetchTemplateSheet',
      payload: {},
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleClickAdd = () => {
    this.props.dispatch(routerRedux.push('/document/create/template'));
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
      type: 'companySheet/fetchTemplateSheet',
      payload: params,
    });
  };

  render() {
    const {
      companySheet: { template_sheet, types },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const { selectedRows } = this.state;

    const formStyle = {
      paddingBottom: 0,
      marginBottom: '12px',
      height: '45px',
      lineHeight: '36px',
    };

    return (
      <PageHeaderWrapper title="固定表单列表">

        <Card bordered={false} style={{marginBottom: -24}}>
          <Button icon="plus" type="primary" onClick={this.handleClickAdd}>
            新建
          </Button>
        </Card>

        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form onSubmit={this.handleSearch}>
            <StandardFormRow title="所属分类" block style={formStyle}>
              <FormItem>
                {getFieldDecorator('type')(
                  <TagSelect onChange={this.handleChangeTags}>
                    {types &&
                      types.map(val => (
                        <TagSelect.Option value={val.id} key={val.id}>
                          {val.name}
                        </TagSelect.Option>
                      ))}
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>

            <StandardFormRow title="其它选项" grid last>
              <Row gutter={8}>
                <Col lg={8} md={10} sm={16} xs={24}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('name', {})(<Search placeholder="文件名" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={16}>
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
            </StandardFormRow>
          </Form>
        </Card>

        <Card bordered={false} style={{ marginTop: 12 }}>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={template_sheet as TableListData}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<CompanySheetListProps>()(TemplateDocument);
