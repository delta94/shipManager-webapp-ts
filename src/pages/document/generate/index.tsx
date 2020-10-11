import React, { useState, useEffect, useCallback } from 'react';
import { IRouteComponentProps, useRequest } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Steps, Typography } from 'antd';
import useStep from '@/hooks/useStep';
import DocumentResult from './DocumentResult';
import DocumentBasicForm from './DocumentBasicForm';
import DocumentExtraForm from './DocumentExtraForm';
import { generateDocument, infoDocument } from '@/services/documentService';

const steps = [
  { id: 'basic', index: 0 },
  { id: 'extra', index: 1 },
  { id: 'result', index: 2 },
];

const DocumentGenerate: React.FC<IRouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  const { data: template, loading } = useRequest(infoDocument, {
    defaultParams: [params.id],
    refreshDeps: [params.id],
  });

  const { run: generate, loading: loadingFile } = useRequest(generateDocument, {
    manual: true,
    refreshDeps: [params.id],
    onSuccess(result) {
      setFileName(result.toString());
    },
  });

  const { step, navigation } = useStep({ steps, initialStep: 0 });

  const [fileName, setFileName] = useState('');

  const [form, setForm] = useState<any>({});

  const onUpdate = useCallback(
    async (value: any, run: boolean = false) => {
      setForm(value);
      if (run) {
        await generate(params.id, {
          variable: value,
        });
      }
    },
    [params.id],
  );

  const [stepComponent, updateStepComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    let component: React.ReactNode = null;
    switch (step.id) {
      case 'basic':
        component = <DocumentBasicForm form={form} template={template} navigation={navigation} onUpdate={onUpdate} />;
        break;
      case 'extra':
        component = <DocumentExtraForm navigation={navigation} loading={loadingFile} />;
        break;
      case 'result':
        component = <DocumentResult fileName={fileName} template={template} />;
        break;
    }
    updateStepComponent(component);
  }, [step, template, fileName, loadingFile]);

  return (
    <PageHeaderWrapper title="打印模版">
      <Card bordered className="mb-2" loading={loading}>
        <Typography.Title level={3}>{template?.name}</Typography.Title>
        <Typography.Text>{template?.remark}</Typography.Text>
      </Card>

      <Card bordered className="mb-2" loading={loading}>
        <Steps size="small" current={step.index}>
          <Steps.Step title="基本信息" />
          <Steps.Step title="提交模版" />
          <Steps.Step title="完成" />
        </Steps>
      </Card>

      <Card bordered={false}>
        <div>{stepComponent}</div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default DocumentGenerate;
