import React, { useEffect } from 'react';
import { NavigationProps } from '@/hooks/useStep';
import { Spin, Skeleton } from 'antd';

interface DocumentExtraFormProps {
  navigation: NavigationProps;
  loading: boolean;
}

const DocumentExtraForm: React.FC<DocumentExtraFormProps> = ({ loading, navigation }) => {
  useEffect(() => {
    if (!loading) {
      navigation.next();
    }
  }, [loading]);
  return (
    <Spin tip="正在生成，请稍等..." size={'large'}>
      <Skeleton paragraph={{ rows: 3 }} active loading={true} />
      <Skeleton paragraph={{ rows: 3 }} active loading={true} />
      <Skeleton paragraph={{ rows: 3 }} active loading={true} />
    </Spin>
  );
};

export default DocumentExtraForm;
