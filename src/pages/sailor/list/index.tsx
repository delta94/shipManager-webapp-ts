import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, Card, message, Modal } from 'antd';
import { useRequest, useToggle } from '@umijs/hooks';
import { deleteSailor, listSailorCategory } from '@/services/sailorService';
import { ISailor } from '@/interfaces/ISailor';
import useSailorTable from './useSailorTable';
import { PlusOutlined } from '@ant-design/icons';
import EditSailorForm from '../edit/editSailorForm';
import { useDispatch, routerRedux } from 'dva';
import hooks from './hooks';

const SailorList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { setLeft: hideEdit, setRight: showEdit, state: editSailorVisible } = useToggle();
  const [editSailor, updateEditSailor] = useState<ISailor>();
  const dispatch = useDispatch();

  const { run: deleteSailorRecord } = useRequest(deleteSailor, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除管理人员');
    },
    onError: err => {
      message.error('删除管理人员时出错');
      console.error(err);
    },
  });

  useEffect(() => {
    const unTapDeleteSailor = hooks.DeleteSailor.tap(sailor => {
      deleteSailorRecord(sailor.id);
    });
    const unTapInfoSailor = hooks.InfoSailor.tap(sailor => {
      dispatch(routerRedux.push(`/person/sailor/profile/${sailor.id}`));
    });
    const unTapEditSailor = hooks.EditSailor.tap(sailor => {
      updateEditSailor(sailor);
      showEdit();
    });
    return () => {
      unTapDeleteSailor();
      unTapInfoSailor();
      unTapEditSailor();
    };
  }, []);

  const { data: sailorCategory } = useRequest(listSailorCategory, {
    manual: false,
    cacheKey: 'sailor_category_type',
  });

  const { columns, request } = useSailorTable({
    dutyTypes: sailorCategory?.SailorDutyType ?? [],
  });

  const onEditSailorUpdate = useCallback(() => {
    actionRef.current?.reload();
    updateEditSailor(undefined);
    hideEdit();
  }, []);

  const onEditSailorCancel = useCallback(() => {
    updateEditSailor(undefined);
    hideEdit();
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
            <Button key="3" onClick={showEdit}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </Card>
      <Modal
        onCancel={onEditSailorCancel}
        destroyOnClose
        width={720}
        footer={null}
        visible={editSailorVisible}
        title={editSailor ? '编辑船员' : '新建船员'}
      >
        <EditSailorForm
          dutyTypes={sailorCategory?.SailorDutyType ?? []}
          issueDepartmentTypes={sailorCategory?.IssueDepartmentType ?? []}
          sailorCertTypes={sailorCategory?.SailorCertType ?? []}
          onUpdate={onEditSailorUpdate}
          onCancel={onEditSailorCancel}
          sailor={editSailor}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default SailorList;
