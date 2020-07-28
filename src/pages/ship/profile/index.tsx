import React, { useEffect } from 'react';
import { RouteComponentProps } from 'dva/router';
import { infoShip, listShipCategory, ShipKeyMap } from '@/services/shipService';
import { useRequest, useToggle } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Descriptions, Button, Modal } from 'antd';
import { IShip } from '@/interfaces/IShip';
import EditBasicForm from '../edit/editBasicForm';
import EditMetricForm from '../edit/editMetricForm';
import EditPayloadForm from '@/pages/ship/edit/editPayloadForm';

const ShipProfile: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  const { data: ship = {} as IShip, run: fetchShip, refresh: refreshShipInfo, loading } = useRequest(infoShip, {
    manual: true,
  });

  const { data: shipCategoryType } = useRequest(listShipCategory, {
    manual: false,
    cacheKey: 'ship_category_type',
  });

  const { setLeft: hideBasicEdit, setRight: showBasicEdit, state: editShipBasicVisible } = useToggle(false);

  const { setLeft: hideMetricEdit, setRight: showMetricEdit, state: editShipMetricVisible } = useToggle(false);

  const { setLeft: hidePayloadEdit, setRight: showPayloadEdit, state: editShipPayloadVisible } = useToggle(false);

  useEffect(() => {
    if (params.id) {
      fetchShip(parseInt(params.id));
    }
  }, [params.id]);

  const onUpdateShip = () => {
    refreshShipInfo();
    hideBasicEdit();
    hideMetricEdit();
  };

  return (
    <PageHeaderWrapper title="船舶详情页">
      <Card
        title="基本信息"
        bordered={false}
        style={{ margin: '24px 0' }}
        loading={loading}
        extra={
          <Button type="link" onClick={showBasicEdit}>
            编辑
          </Button>
        }
      >
        <Descriptions>
          <Descriptions.Item label={ShipKeyMap.name}>{ship.name}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.carrierIdentifier}>{ship.carrierIdentifier}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.owner}>{ship.owner}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.shipTypeName}>{ship.shipTypeName}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.shareInfo}>{ship.shareInfo}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.registerIdentifier}>{ship.registerIdentifier}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.examineIdentifier}>{ship.examineIdentifier}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.shipMaterialTypeName}>{ship.shipMaterialTypeName}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.harbor}>{ship.harbor}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.formerName}>{ship.formerName}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.buildAt}>{ship.buildAt}</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.assembleAt}>{ship.assembleAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="船体参数"
        style={{ marginBottom: 24 }}
        bordered={false}
        loading={loading}
        extra={
          <Button type="link" onClick={showMetricEdit}>
            编辑
          </Button>
        }
      >
        <Descriptions>
          <Descriptions.Item label={ShipKeyMap.grossTone}>{ship.grossTone} 吨</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.netTone}>{ship.netTone} 吨</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.length}>{ship.length} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.width}>{ship.width} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.height}>{ship.height} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.depth}>{ship.depth} 米</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="航区载量列表"
        style={{ marginBottom: 24 }}
        bordered={false}
        loading={loading}
        extra={
          <Button type="link" onClick={showPayloadEdit}>
            编辑
          </Button>
        }
      >
        <Descriptions>
          <Descriptions.Item label={ShipKeyMap.grossTone}>{ship.grossTone} 吨</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.netTone}>{ship.netTone} 吨</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.length}>{ship.length} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.width}>{ship.width} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.height}>{ship.height} 米</Descriptions.Item>
          <Descriptions.Item label={ShipKeyMap.depth}>{ship.depth} 米</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        maskClosable={false}
        width={720}
        visible={editShipBasicVisible}
        title="编辑基本信息"
        destroyOnClose={true}
        footer={null}
        onCancel={hideBasicEdit}
      >
        <EditBasicForm
          ship={ship}
          onUpdate={onUpdateShip}
          onCancel={hideBasicEdit}
          shipTypes={shipCategoryType?.ShipType ?? []}
          shipMaterialTypes={shipCategoryType?.ShipMaterialType ?? []}
        />
      </Modal>

      <Modal
        maskClosable={false}
        width={720}
        visible={editShipMetricVisible}
        title="编辑船体参数信息"
        destroyOnClose={true}
        footer={null}
        onCancel={hideMetricEdit}
      >
        <EditMetricForm ship={ship} onUpdate={onUpdateShip} onCancel={hideMetricEdit} />
      </Modal>

      <Modal
        maskClosable={false}
        width={720}
        visible={editShipPayloadVisible}
        title="编辑航区参数信息"
        destroyOnClose={true}
        footer={null}
        onCancel={hidePayloadEdit}
      >
        <EditPayloadForm payload={ship.shipPayloads} onUpdate={onUpdateShip} onCancel={hidePayloadEdit} />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default ShipProfile;
