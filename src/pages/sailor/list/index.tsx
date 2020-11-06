import React, { useRef, useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, message } from 'antd';
import { useRequest, IRouteComponentProps } from 'umi';
import { deleteSailor } from '@/services/sailorService';
import { ISailor } from '@/interfaces/ISailor';
import useSailorTable from './useSailorTable';
import { PlusOutlined } from '@ant-design/icons';
import hooks from './hooks';
import { listOptions } from '@/services/globalService';
import { ProCoreActionType } from '@ant-design/pro-utils';

const SailorList: React.FC<IRouteComponentProps> = ({ history }) => {
  const actionRef = useRef<ProCoreActionType>();

  const { run: deleteSailorRecord } = useRequest(deleteSailor, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除管理人员');
    },
    onError: (err) => {
      message.error('删除管理人员时出错');
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

  const { data: sailorCategory } = useRequest(listOptions, {
    manual: false,
    defaultParams: [['SailorDutyType', 'SailorCertType', 'IssueDepartmentType']],
    cacheKey: 'sailor_category_type',
  });

  const { columns, request } = useSailorTable({
    dutyTypes: sailorCategory?.SailorDutyType ?? [],
  });

  const onCreateSailor = useCallback(() => {
    history.push(`/person/sailor/create`);
  }, []);

  return (
    <PageHeaderWrapper title="船员列表">
      <Card bordered={false}>
        <ProTable<ISailor>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
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
