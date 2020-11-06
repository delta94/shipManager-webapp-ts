import React from 'react';
import { infoShip, ShipKeyMap } from '@/services/shipService';
import { useRequest, IRouteComponentProps } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { Card, Descriptions, Button, Modal, Space, Popconfirm, Table } from 'antd';
import { IShipPayload } from '@/interfaces/IShip';
import EditBasicForm from '../edit/editBasicForm';
import EditMetricForm from '../edit/editMetricForm';
import EditPayloadForm from '@/pages/ship/edit/editPayloadForm';
import useLicenseTable from '@/pages/ship/profile/useLicenseTable';
import useSailorTable from '@/pages/ship/profile/useSailorTable';
import useLicenseForm from '@/pages/ship/profile/useLicenseForm';
import EditLicenseForm from '@/pages/ship/edit/editLicenseForm';
import usePayloadForm from '@/pages/ship/profile/usePayloadForm';
import useBasicForm from '@/pages/ship/profile/useBaiscForm';
import useMetricForm from '@/pages/ship/profile/useMetricForm';
import hooks from '@/pages/ship/profile/hooks';
import ProTable from '@ant-design/pro-table';
import { ISailor } from '@/interfaces/ISailor';
import useMachineTable from '@/pages/ship/profile/useMachineTable';
import useMachineForm from '@/pages/ship/profile/useMachineForm';
import EditMachineForm from '@/pages/ship/edit/editMachineForm';
import { listOptions } from '@/services/globalService';

const ShipProfile: React.FC<IRouteComponentProps<{ id: string }>> = ({ match }) => {
  const shipId = parseInt(match.params.id) || 0;

  const { data: ship, refresh: refreshShipInfo, loading } = useRequest(infoShip, {
    cacheKey: `ship_${shipId}`,
    refreshDeps: [shipId],
    defaultParams: [shipId],
  });

  const { data: shipCategoryType } = useRequest(listOptions, {
    manual: false,
    defaultParams: [
      [
        'ShipBusinessAreaType',
        'ShipMaterialType',
        'ShipType',
        'ShipLicenseType',
        'IssueDepartmentType',
        'ShipMachineType',
      ],
    ],
    cacheKey: 'ship_category_type',
  });

  const licenseTableProps = useLicenseTable({ licenses: ship?.shipLicenses });

  const machineTableProps = useMachineTable({
    machines: ship?.shipMachines,
    machineTypes: shipCategoryType?.ShipMachineType,
  });

  const sailorTableProps = useSailorTable();

  const { editShipBasic, editBasicVisible, onCloseEditBasic, onShowEditBasic } = useBasicForm({ ship });

  const { editShipMetric, editMetricVisible, onCloseEditMetric, onShowEditMetric } = useMetricForm({ ship });

  const { editLicense, editLicenseVisible, onCloseEditLicense, onShowEditLicense } = useLicenseForm({
    refreshShipInfo,
  });

  const { editMachine, onCloseEditMachine, onShowEditMachine, editMachineVisible } = useMachineForm({
    refreshShipInfo,
  });

  const { editPayload, editPayloadVisible, onCloseEditPayload, onShowEditPayload } = usePayloadForm({
    refreshShipInfo,
  });

  const onUpdateShip = () => {
    refreshShipInfo();
    onCloseEditBasic({});
    onCloseEditMetric({});
    onCloseEditPayload({});
    onCloseEditLicense({});
    onCloseEditMachine({});
  };

  return (
    <PageHeaderWrapper title="船舶详情页">
      <Card
        title="基本信息"
        bordered={false}
        className="mt-3"
        loading={loading}
        extra={
          <Button type="link" onClick={onShowEditBasic}>
            编辑
          </Button>
        }
      >
        <Descriptions>
          <Descriptions.Item label={ShipKeyMap.name}>{ship?.name}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.carrierIdentifier}>{ship?.carrierIdentifier}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.owner}>{ship?.owner}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.shipTypeName}>{ship?.shipTypeName}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.shareInfo}>{ship?.shareInfo}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.registerIdentifier}>{ship?.registerIdentifier}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.firstRegisterIdentifier}>
            {ship?.firstRegisterIdentifier}
          </Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.examineIdentifier}>{ship?.examineIdentifier}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.shipMaterialTypeName}>{ship?.shipMaterialTypeName}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.harbor}>{ship?.harbor}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.buildIn}>{ship?.buildIn}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.formerName}>{ship?.formerName}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.buildAt}>{ship?.buildAt}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.assembleAt}>{ship?.assembleAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="船体参数"
        className="mt-3"
        bordered={false}
        loading={loading}
        extra={
          <Button type="link" onClick={onShowEditMetric}>
            编辑
          </Button>
        }
      >
        <Descriptions>
          <Descriptions.Item label={ShipKeyMap.grossTone}>{ship?.grossTone} 吨</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.netTone}>{ship?.netTone} 吨</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.length}>{ship?.length} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.width}>{ship?.width} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.height}>{ship?.height} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.depth}>{ship?.depth} 米</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="航区载量信息"
        className="mt-3"
        bordered={false}
        loading={loading}
        extra={
          <Button
            type="link"
            onClick={() => {
              onShowEditPayload({ shipId: shipId });
            }}
          >
            新增
          </Button>
        }
      >
        <ProList<IShipPayload>
          rowKey="id"
          dataSource={ship?.shipPayloads}
          renderItem={(item) => ({
            title: (
              <>
                {item.shipBusinessAreaName} | <Space size={3}>载货量: {item.tone} 吨</Space>
              </>
            ),
            actions: [
              <a
                onClick={() => {
                  onShowEditPayload(item);
                }}
              >
                修改
              </a>,
              <Popconfirm title="是否要删除此记录？" onConfirm={() => hooks.DeleteShipPayload.call(item)}>
                <a>删除</a>
              </Popconfirm>,
            ],
            description: item.shipBusinessAreaRemark,
            avatar: {
              size: 'large',
              children: item.shipBusinessAreaName.slice(0, 1),
              style: { color: '#40a9ff', backgroundColor: '#e6f7ff', verticalAlign: 'middle' },
            },
          })}
        />
      </Card>

      <Card
        bordered={false}
        tabList={licenseTableProps.tabList}
        className="mt-3"
        onTabChange={licenseTableProps.updateTab}
        tabBarExtraContent={
          <Button type="link" onClick={() => onShowEditLicense({ shipId })}>
            新增
          </Button>
        }
      >
        <Table
          key="id"
          pagination={false}
          loading={loading}
          dataSource={licenseTableProps.licenses}
          columns={licenseTableProps.columns}
        />
      </Card>

      <Card
        bordered={false}
        tabList={machineTableProps.tabList}
        className="mt-3"
        onTabChange={machineTableProps.updateTab}
        tabBarExtraContent={
          <Button
            type="link"
            onClick={() =>
              onShowEditMachine({
                shipId: shipId,
              })
            }
          >
            新增
          </Button>
        }
      >
        <Table
          locale={{
            emptyText: '无数据',
          }}
          key="id"
          pagination={false}
          loading={loading}
          dataSource={machineTableProps.machines}
          columns={machineTableProps.columns}
        />
      </Card>

      <Card bordered={false} title="船员列表" className="mt-3">
        <ProTable<ISailor>
          rowKey="id"
          search={false}
          options={false}
          pagination={false}
          dateFormatter="string"
          dataSource={ship?.sailors}
          actionRef={sailorTableProps.actionRef}
          columns={sailorTableProps.columns}
        />
      </Card>

      <Modal
        maskClosable={false}
        width={720}
        visible={editBasicVisible}
        title="编辑基本信息"
        destroyOnClose={true}
        footer={null}
        onCancel={onCloseEditBasic}
      >
        <EditBasicForm
          ship={editShipBasic ?? {}}
          onUpdate={onUpdateShip}
          onCancel={onCloseEditBasic}
          shipTypes={shipCategoryType?.ShipType ?? []}
          shipMaterialTypes={shipCategoryType?.ShipMaterialType ?? []}
        />
      </Modal>

      <Modal
        maskClosable={false}
        width={720}
        visible={editMetricVisible}
        title="编辑船体参数信息"
        destroyOnClose={true}
        footer={null}
        onCancel={onCloseEditMetric}
      >
        <EditMetricForm ship={editShipMetric ?? {}} onUpdate={onUpdateShip} onCancel={onCloseEditMetric} />
      </Modal>

      <Modal
        maskClosable={false}
        width={720}
        visible={editPayloadVisible}
        title="编辑航区载量信息"
        destroyOnClose={true}
        footer={null}
        onCancel={onCloseEditPayload}
      >
        <EditPayloadForm
          shipBusinessAreaType={shipCategoryType?.ShipBusinessAreaType ?? []}
          payload={editPayload}
          onUpdate={onUpdateShip}
          onCancel={onCloseEditPayload}
        />
      </Modal>

      <Modal
        maskClosable={false}
        width={720}
        visible={editMachineVisible}
        title={`${editMachine ? '更新' : '修改'}船机信息`}
        destroyOnClose={true}
        footer={null}
        onCancel={onCloseEditMachine}
      >
        <EditMachineForm
          machine={editMachine}
          machineTypes={shipCategoryType?.ShipMachineType}
          onUpdate={onUpdateShip}
          onCancel={onCloseEditMachine}
        />
      </Modal>

      <Modal
        maskClosable={false}
        width={720}
        visible={editLicenseVisible}
        title="编辑营运证信息"
        destroyOnClose={true}
        footer={null}
        onCancel={onCloseEditLicense}
      >
        <EditLicenseForm
          shipLicenseType={shipCategoryType?.ShipLicenseType ?? []}
          issueDepartmentType={shipCategoryType?.IssueDepartmentType ?? []}
          license={editLicense}
          onUpdate={onUpdateShip}
          onCancel={onCloseEditLicense}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default ShipProfile;
