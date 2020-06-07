import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Modal, Popconfirm, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../../style.less';
import uuidv1 from 'uuid/v1';
import IShip, { IShipGenerator, IShipHost } from '@/interfaces/IShip';
import ShipHostEditForm from './ShipHostEditForm';
import ShipGeneratorEditForm from './ShipGeneratorEditForm';
import { ShipCreateStep } from '@/pages/ship/create/types';
import { TableListItem } from '@/pages/ship/createX/components/ShipPayloadTable/ShipCert';

interface ShipMachineFormProps {
  ship: Partial<IShip>;
  currentStep: ShipCreateStep;
  switchToStep(index: ShipCreateStep, ship: Partial<IShip>): void;
}

const ShipMachineForm: React.FC<ShipMachineFormProps> = ({ ship, switchToStep, currentStep }) => {
  const [generatorVisible, updateGeneratorVisible] = useState(false);
  const [hostVisible, updateHostVisible] = useState(false);

  const [currentGenerator, updateCurrentGenerator] = useState<Partial<IShipGenerator>>();
  const [currentHost, updateCurrentHost] = useState<Partial<IShipHost>>();

  const [generators, updateGenerators] = useState<Partial<IShipGenerator>[]>([]);
  const [hosts, updateHosts] = useState<Partial<IShipHost>[]>([]);

  useEffect(() => {
    if (ship && currentStep == ShipCreateStep.Machine) {
      if (ship.hosts && ship.hosts.length > 0) {
        updateHosts([...ship.hosts]);
      }

      if (ship.generators && ship.generators.length > 0) {
        updateGenerators([...ship.generators]);
      }
    }
  }, [ship, currentStep]);

  const onRecordUpdate = (record: any, type: string) => {
    if (type == 'generator') {
      updateGeneratorVisible(true);
      updateCurrentGenerator(record);
    }
    if (type == 'host') {
      updateHostVisible(true);
      updateCurrentHost(record);
    }
  };

  const onRecordRemove = (record: any, type: string) => {
    if (type == 'generator') {
      let newGenerators = generators.filter(item => item.id != record.id);
      updateGenerators([...newGenerators]);
    }
    if (type == 'host') {
      let newHost = hosts.filter(item => item.id != record.id);
      updateHosts([...newHost]);
    }
  };

  const onNext = useCallback(() => {
    let shipData: Partial<IShip> = { generators: [], hosts: [] };
    if (hosts && hosts.length > 0) {
      shipData.hosts = [...hosts];
    }
    if (generators && generators.length > 0) {
      shipData.generators = [...generators];
    }
    switchToStep(ShipCreateStep.Payload, shipData);
  }, [hosts, generators]);

  const onPrev = useCallback(() => {
    let shipData: Partial<IShip> = { generators: [], hosts: [] };
    if (hosts && hosts.length > 0) {
      shipData.hosts = [...hosts];
    }
    if (generators && generators.length > 0) {
      shipData.generators = [...generators];
    }
    switchToStep(ShipCreateStep.Basic, shipData);
  }, [hosts, generators]);

  const hostColumns = useMemo(() => {
    return [
      {
        title: '主机编号',
        dataIndex: 'identityNumber',
      },
      {
        title: '主机种类',
        dataIndex: 'modelType',
        render: (text: string) => <Tag color="#108ee9">{text}</Tag>,
      },
      {
        title: '主机功率',
        dataIndex: 'power',
        render: (text: string) => `${text} 千瓦`,
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text: any, record: TableListItem) => (
          <>
            <a onClick={() => onRecordUpdate(record, 'host')}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => onRecordRemove(record, 'host')}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];
  }, [hosts]);

  const generatorColumns = useMemo(() => {
    return [
      {
        title: '发电机编号',
        dataIndex: 'identityNumber',
      },
      {
        title: '发电机种类',
        dataIndex: 'modelType',
        render: (text: string) => <Tag color="#108ee9">{text}</Tag>,
      },
      {
        title: '发电机功率',
        dataIndex: 'power',
        render: (text: string) => `${text} 千瓦`,
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text: any, record: IShipGenerator) => (
          <>
            <a onClick={() => onRecordUpdate(record, 'generator')}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm
                title="是否要删除此行？"
                onConfirm={() => onRecordRemove(record, 'generator')}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];
  }, [generators]);

  const onSubmitHost = useCallback(
    async (host: Partial<IShipHost>) => {
      updateHostVisible(false);
      updateCurrentHost({});

      if (host.id) {
        let idx = hosts.findIndex(data => host.id == data.id);
        if (idx > -1) {
          hosts[idx] = host;
          updateHosts([...hosts]);
        }
      } else {
        host.id = uuidv1();
        updateHosts([...hosts, host]);
      }
    },
    [hosts],
  );

  const onSubmitGenerator = useCallback(
    async (generator: Partial<IShipGenerator>) => {
      updateGeneratorVisible(false);
      updateCurrentGenerator({});

      if (generator.id) {
        let idx = generators.findIndex(data => generator.id == data.id);
        if (idx > -1) {
          generators[idx] = generator;
          updateGenerators([...generators]);
        }
      } else {
        generator.id = uuidv1();
        updateGenerators([...generators, generator]);
      }
    },
    [generators],
  );

  return (
    <>
      <Card title="船舶发电机" bordered={true}>
        <Table
          dataSource={generators as IShipGenerator[]}
          columns={generatorColumns}
          key="id"
          pagination={false}
        />
        <Button
          type="dashed"
          className={styles.addBtn}
          icon={<PlusOutlined />}
          onClick={() => updateGeneratorVisible(true)}
        >
          添加发电机信息
        </Button>
      </Card>

      <div style={{ margin: '20px 0 24px' }} />

      <Card title="船舶主机" bordered={true}>
        <Table
          dataSource={hosts as IShipHost[]}
          columns={hostColumns}
          key="id"
          pagination={false}
        />
        <Button
          type="dashed"
          className={styles.addBtn}
          icon={<PlusOutlined />}
          onClick={() => updateHostVisible(true)}
        >
          添加主机信息
        </Button>
      </Card>

      <div style={{ margin: '20px 0 24px' }} />

      <Card bordered={false}>
        <div style={{ margin: '12px 0', width: '100%' }}>
          <Button type="primary" onClick={onNext} style={{ marginRight: 12, float: 'right' }}>
            下一步
          </Button>
          <Button onClick={onPrev} style={{ marginRight: 12, float: 'right' }}>
            上一步
          </Button>
        </div>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>船舶基本信息</h4>
          <p>如果需要，这里可以放一些关于录入船舶的常见问题说明</p>
        </div>
      </Card>

      <Modal
        title="编辑主机"
        width={640}
        destroyOnClose
        visible={hostVisible}
        footer={null}
        onCancel={() => updateHostVisible(false)}
      >
        <ShipHostEditForm
          current={currentHost}
          onCancel={() => updateHostVisible(false)}
          onSubmit={onSubmitHost}
        />
      </Modal>

      <Modal
        title="编辑发电机"
        width={640}
        destroyOnClose
        visible={generatorVisible}
        footer={null}
        onCancel={() => updateGeneratorVisible(false)}
      >
        <ShipGeneratorEditForm
          current={currentGenerator}
          onSubmit={onSubmitGenerator}
          onCancel={() => updateGeneratorVisible(false)}
        />
      </Modal>
    </>
  );
};

export default ShipMachineForm;
