import { Card, Steps } from 'antd';
import styles from '@/pages/ship/create/style.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import { Binding, ICompanySheet, ICompanyTemplateSheet } from '@/interfaces/ICompanySheet';
import { connect } from 'dva';
import { CompanySheetState } from '@/models/companySheet';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import SheetDataSource from './components/SheetDataSource';

const { Step } = Steps;

export enum DocumentGenerateStep {
  DataSource,
  Extra,
  Control,
  Result,
}

interface DocumentGenerateState {
  currentStep: DocumentGenerateStep;
  sheet: Partial<ICompanyTemplateSheet>;
  bindings: Binding[];
}

interface DocumentGenerateParams {
  id: string;
}

interface DocumentGenerateProps extends RouteComponentProps<DocumentGenerateParams> {
  dispatch: Dispatch<any>;
  loading: boolean;
  sheet: ICompanySheet;
}

@connect(
  ({
    companySheet,
    loading,
  }: {
    companySheet: CompanySheetState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    sheet: companySheet.target,
    loading: loading.effects['companySheet/generate'],
  }),
)
class DocumentGenerate extends React.Component<DocumentGenerateProps, DocumentGenerateState> {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (params.id) {
      dispatch({
        type: 'companySheet/target',
        payload: params.id,
        callback: this.handleParseSheetBindings,
      });
    }
  }

  handleParseSheetBindings = (sheet: ICompanySheet) => {
    console.log(sheet);
    debugger;
  };

  state = {
    currentStep: DocumentGenerateStep.DataSource,
    sheet: {},
    bindings: [],
  };

  render() {
    let stepComponent;

    if (this.state.currentStep === DocumentGenerateStep.DataSource) {
      stepComponent = <SheetDataSource />;
    } else if (this.state.currentStep === DocumentGenerateStep.Extra) {
      stepComponent = <div>DataSource</div>;
    } else if (this.state.currentStep === DocumentGenerateStep.Control) {
      stepComponent = <div>Control</div>;
    } else if (this.state.currentStep === DocumentGenerateStep.Result) {
      stepComponent = <div>Result</div>;
    }

    return (
      <PageHeaderWrapper title="自定义表格信息" content="按表单选择数据">
        <Card bordered={false}>
          <>
            <Steps current={this.state.current} className={styles.steps}>
              <Step title="数据源" />
              <Step title="额外数据" />
              <Step title="条件控制" />
              <Step title="下载打印" />
            </Steps>
            {stepComponent}
          </>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DocumentGenerate;
