import React, { useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, message } from 'antd';
import { useRequest, IRouteComponentProps } from 'umi';
import { deleteSailor } from '@/services/sailorService';
import { ISailor } from '@/interfaces/ISailor';
import useSailorTable from './useSailorTable';
import { PlusOutlined } from '@ant-design/icons';
import hooks from './hooks';

const SailorList: React.FC<IRouteComponentProps> = ({ history }) => {
  const { columns, request, actionRef } = useSailorTable({});

  const { run: deleteSailorRecord } = useRequest(deleteSailor, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除船员人员');
    },
    onError: (err) => {
      message.error('删除船员人员时出错');
      console.error(err);
    },
  });

  useEffect(() => {
    const unTapDeleteSailor = hooks.DeleteSailor.tap((sailor) => {
      deleteSailorRecord(sailor.id);
    });
    const unTapInfoSailor = hooks.InfoSailor.tap((sailor) => {
      history.push(`/person/sailor/profile/${sailor.id}`);
    });
    const unTapEditSailor = hooks.EditSailor.tap((sailor) => {
      history.push(`/person/sailor/edit/${sailor.id}`);
    });
    return () => {
      unTapDeleteSailor();
      unTapInfoSailor();
      unTapEditSailor();
    };
  }, []);

  const onCreateSailor = useCallback(() => {
    history.push(`/person/sailor/create`);
  }, []);

  return (
    <PageHeaderWrapper title="船员列表">
      <Card bordered={false}>
        <ProTable<ISailor>
          actionRef={actionRef}
          rowKey="id"
          search={{ span: 8, labelWidth: "auto" }}
          columns={columns}
          request={request}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" onClick={onCreateSailor}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default SailorList;
