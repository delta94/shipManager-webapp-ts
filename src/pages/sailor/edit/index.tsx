import React, { useState, useEffect, useCallback } from 'react';
import { useRequest, IRouteComponentProps } from 'umi';
import styles from './style.less';
import { PageHeaderWrapper, FooterToolbar } from '@ant-design/pro-layout';
import { Button, Card, Col, DatePicker, Form, Input, Popover, Row, Select, Radio, message } from 'antd';
import { infoSailor, updateSailor } from '@/services/sailorService';
import { createSailorCert, deleteSailorCert, updateSailorCert } from '@/services/sailorCertService';
import { SailorKeyMap } from '@/services/sailorService';
import { CloseCircleOutlined } from '@ant-design/icons';
import { dateFormatter, formatUploadFileToOSSFiles, transferMomentToString } from '@/utils/parser';
import { ISailor, ISailorCert } from '@/interfaces/ISailor';
import SailorCertList from '@/pages/sailor/create/sailorCertList';
import { listShipMeta } from '@/services/shipService';
import { listOptions } from '@/services/globalService';

const { Option } = Select;

interface ErrorField {
  name: string;
  errors: string[];
}

const EditSailor: React.FC<IRouteComponentProps<{ id: string }>> = ({ history, match: { params } }) => {
  const [form] = Form.useForm();

  const { data: categoryTypes } = useRequest(listOptions, {
    manual: false,
    defaultParams: [['SailorDutyType', 'SailorCertType', 'IssueDepartmentType']],
    cacheKey: 'sailor_category_type',
  });

  const { data: sailor } = useRequest(infoSailor, {
    refreshDeps: [params.id],
    defaultParams: [parseInt(params.id)],
  });

  const { run, loading } = useRequest(updateSailor, {
    manual: true,
    onSuccess() {
      message.success('船员信息已经更新');
      history.push('/person/sailor/list');
    },
    onError() {
      message.error('船员信息更新失败');
    },
  });

  const { data: shipMeta } = useRequest(listShipMeta, {
    manual: false,
    cacheKey: 'ship_meta',
  });

  const { run: deleteCert } = useRequest(deleteSailorCert, {
    manual: true,
    onSuccess() {
      message.success('证书已删除');
    },
    onError() {
      message.error('证书删除失败');
    },
  });

  const { run: createCert } = useRequest(createSailorCert, {
    manual: true,
    onSuccess() {
      message.success('证书已创建');
    },
    onError() {
      message.error('证书创建失败');
    },
  });

  const { run: updateCert } = useRequest(updateSailorCert, {
    manual: true,
    onSuccess() {
      message.success('证书已更新');
    },
    onError() {
      message.error('证书更新失败');
    },
  });

  const [error, setError] = useState<ErrorField[]>([]);

  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{SailorKeyMap[key]}</div>
        </li>
      );
    });

    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        <span className={styles.errorIconCnt}>{errorCount}</span>
      </span>
    );
  };

  const onFinish = (values: { [key: string]: any }) => {
    setError([]);
    values = transferMomentToString(values);
    values.sailorCerts = []; // not
    run(values as ISailor);
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };

  const onFileChange = useCallback(
    async (certificate: ISailorCert, type: 'remove' | 'update' | 'insert') => {
      if (type == 'remove') {
        await deleteCert(certificate.id);
      }
      if (type == 'update') {
        let id = certificate.id;
        let cloneObj = {
          ...certificate,
          ...{
            sailorId: parseInt(params.id),
            ossFiles: formatUploadFileToOSSFiles(certificate.ossFiles || [], 'Sailor'),
          },
        } as ISailorCert;
        updateCert(cloneObj).then((value) => {
          let sailorCerts = form.getFieldValue('sailorCerts');
          sailorCerts = sailorCerts.map((item: ISailorCert) => {
            if (item.id == id) {
              item.id = value.id;
              item.sailorId = value.sailorId;
              //@ts-ignore
              item.ossFiles = value.ossFiles;
            }
            return item;
          });
          form.setFieldsValue({ sailorCerts: sailorCerts });
        });
      }

      if (type == 'insert') {
        let id = certificate.id;

        let cloneObj = {
          ...certificate,
          ...{
            sailorId: parseInt(params.id),
            ossFiles: formatUploadFileToOSSFiles(certificate.ossFiles || [], 'Sailor'),
          },
        } as ISailorCert;

        delete cloneObj.id;
        createCert(cloneObj).then((value) => {
          let sailorCerts = form.getFieldValue('sailorCerts');
          sailorCerts = sailorCerts.map((item: ISailorCert) => {
            if (item.id == id) {
              item.id = value.id;
              item.sailorId = value.sailorId;
            }
            return item;
          });
          form.setFieldsValue({ sailorCerts: sailorCerts });
        });
      }
    },
    [params.id],
  );

  useEffect(() => {
    if (sailor && sailor.id) {
      let values = dateFormatter({ ...sailor }) as ISailor;
      form.setFieldsValue(values);
    }
  }, [sailor]);

  return (
    <PageHeaderWrapper title="编辑船员" content="更新船员信息及相关证书信息">
      <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form.Item label="id" name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={SailorKeyMap.name}
                name="name"
                rules={[{ required: true, message: `请输入 ${SailorKeyMap.name}` }]}
              >
                <Input placeholder={`请输入 ${SailorKeyMap.name}`} />
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={SailorKeyMap.identityNumber}
                name="identityNumber"
                rules={[{ required: true, message: `请输入 ${SailorKeyMap.identityNumber}` }]}
              >
                <Input placeholder={`请输入 ${SailorKeyMap.identityNumber}`} />
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={SailorKeyMap.gender}
                name="gender"
                rules={[{ required: true, message: `请选择 ${SailorKeyMap.gender}` }]}
              >
                <Select placeholder={`请选择 ${SailorKeyMap.gender}`}>
                  <Option value={0}>男性</Option>
                  <Option value={1}>女性</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={SailorKeyMap.birthDate}
                name="birthDate"
                rules={[
                  {
                    required: false,
                    message: `请输入 ${SailorKeyMap.birthDate}`,
                  },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" placeholder={`请输入 ${SailorKeyMap.birthDate}`} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="联系方式" className={styles.card}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                name="mobile"
                label={SailorKeyMap.mobile}
                rules={[
                  {
                    required: true,
                    message: `请输入${SailorKeyMap.mobile}`,
                  },
                ]}
              >
                <Input placeholder={`请输入${SailorKeyMap.mobile}`} />
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="region"
                label={SailorKeyMap.region}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.region}`,
                  },
                ]}
              >
                <Input placeholder={`请输入${SailorKeyMap.region}`} />
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="address"
                label={SailorKeyMap.address}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.address}`,
                  },
                ]}
              >
                <Input placeholder={`请输入${SailorKeyMap.address}`} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                name="emergencyContactName"
                label={SailorKeyMap.emergencyContactName}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.emergencyContactName}`,
                  },
                ]}
              >
                <Input placeholder={`请输入${SailorKeyMap.emergencyContactName}`} />
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="emergencyContactMobile"
                label={SailorKeyMap.emergencyContactMobile}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.emergencyContactMobile}`,
                  },
                ]}
              >
                <Input placeholder={`请输入${SailorKeyMap.emergencyContactMobile}`} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="职业信息" className={styles.card}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                name="isAdvanced"
                label={SailorKeyMap.isAdvanced}
                rules={[
                  {
                    required: true,
                    message: `请输入${SailorKeyMap.isAdvanced}`,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true} className="mx-2">
                    <span className="px-1">是</span>
                  </Radio>
                  <Radio value={false} className="mx-2 ">
                    <span className="px-1">否</span>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="shipId"
                label={SailorKeyMap.shipName}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.shipName}`,
                  },
                ]}
              >
                <Select placeholder={`请选择${SailorKeyMap.shipName}`}>
                  {shipMeta?.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="sailorDutyTypeId"
                label={SailorKeyMap.sailorDutyTypeName}
                rules={[
                  {
                    required: true,
                    message: `请输入${SailorKeyMap.sailorDutyTypeName}`,
                  },
                ]}
              >
                <Select placeholder={`请选择${SailorKeyMap.sailorDutyTypeName}`}>
                  {categoryTypes?.SailorDutyType?.map((item, index) => (
                    <Option value={item.id} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                name="licenseNumber"
                label={SailorKeyMap.licenseNumber}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.licenseNumber}`,
                  },
                ]}
              >
                <Input placeholder={`请输入${SailorKeyMap.licenseNumber}`} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="contractExpiryAt"
                label={SailorKeyMap.contractExpiryAt}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.contractExpiryAt}`,
                  },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" placeholder={`请输入${SailorKeyMap.contractExpiryAt}`} />
              </Form.Item>
            </Col>

            <Col xl={{ span: 6, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                name="contractWorkAt"
                label={SailorKeyMap.contractWorkAt}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.contractWorkAt}`,
                  },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" placeholder={`请输入${SailorKeyMap.contractWorkAt}`} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="remark"
                label={SailorKeyMap.remark}
                rules={[
                  {
                    required: false,
                    message: `请输入${SailorKeyMap.remark}`,
                  },
                ]}
              >
                <Input.TextArea rows={3} placeholder={`请输入${SailorKeyMap.remark}`} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className={styles.card} title="资格证书">
          <Form.Item name="sailorCerts">
            <SailorCertList
              onFileChange={onFileChange}
              issueDepartmentTypes={categoryTypes?.IssueDepartmentType}
              sailorCertTypes={categoryTypes?.SailorCertType}
            />
          </Form.Item>
        </Card>

        <FooterToolbar>
          {getErrorInfo(error)}
          <Button type="primary" onClick={() => form?.submit()} loading={loading}>
            提交修改
          </Button>
        </FooterToolbar>
      </Form>
    </PageHeaderWrapper>
  );
};

export default EditSailor;
