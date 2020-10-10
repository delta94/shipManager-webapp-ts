import React, { useEffect, useCallback, useState, useRef } from 'react';
//@ts-ignore
import FormBuilder from 'antd-form-builder';
import { NavigationProps } from '@/hooks/useStep';
import { Form, Button, Select, Divider, message } from 'antd';

import 'antd/es/input/style/index.css';
import 'antd/es/grid/style/index.css';
import 'antd/es/radio/style/index.css';
import 'antd/es/date-picker/style/index.css';
import 'antd/es/input-number/style/index.css';

import { IDocument } from '@/interfaces/IDocument';
import { useRequest } from '@@/plugin-request/request';
import { listShipMeta, infoShip } from '@/services/shipService';
import { listManagerMeta } from '@/services/managerService';
import { getCompanyInfo } from '@/services/companyService';
import { parseMetric } from '@/utils/parser';

interface DocumentBasicFormProps {
  form: any;
  template?: IDocument;
  navigation: NavigationProps;
  onUpdate(template: any, run: boolean): void;
}

const DocumentBasicForm: React.FC<DocumentBasicFormProps> = ({ template, onUpdate, navigation }) => {
  const [form] = Form.useForm();

  const [formMeta, setFormMeta] = useState<any>([]);

  const cache = useRef<Map<String, any>>(new Map());

  const onFinish = useCallback((values: any) => {
    onUpdate(values, true);
    navigation.next();
  }, []);

  const onFinishFailed = useCallback(() => {
    message.warn('请输入必须填写的字段');
  }, []);

  const { data: shipMeta, run: fetchShipMeta } = useRequest(listShipMeta, {
    manual: true,
    cacheKey: 'ship_meta',
  });

  const { run: fetchCompany } = useRequest(getCompanyInfo, {
    manual: true,
    cacheKey: 'company',
    onSuccess(result) {
      form.setFieldsValue({
        company: result,
      });
    },
  });

  const { data: managerList, run: fetchManagerList } = useRequest(listManagerMeta, {
    manual: true,
    cacheKey: 'ship_manager_list',
  });

  const { run: fetchShipInfo } = useRequest(infoShip, {
    manual: true,
  });

  useEffect(() => {
    if (template && template.templateFormMeta) {
      try {
        let meta = JSON.parse(template.templateFormMeta);
        setFormMeta(meta);

        if (meta.shipSelect) {
          fetchShipMeta();
        }

        if (meta.managerSelect) {
          fetchManagerList();
        }

        if (meta.companySelect) {
          fetchCompany();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [template]);

  const onShipSelect = useCallback(
    async (value: string) => {
      let id = `ship_${value}`;
      if (cache && cache.current && cache.current.has(id)) {
        let ship = cache.current.get(id);
        form.setFieldsValue({ ship: ship });
      } else {
        let ship = await fetchShipInfo(value);
        ship = parseMetric(ship);
        cache.current.set(id, ship);
        form.setFieldsValue({ ship: ship });
      }
    },
    [shipMeta, form],
  );

  const onManagerSelect = useCallback(
    (value: number) => {
      if (managerList && managerList.length > 0) {
        let manager = managerList.find((item) => item.id == value);
        form.setFieldsValue({ manager: manager });
      }
    },
    [shipMeta, form, managerList],
  );

  return (
    <div className="w-75">
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        {formMeta?.shipSelect && (
          <Form.Item
            labelCol={{ span: 8 }}
            name="shipId"
            label="请选择船舶"
            rules={[
              {
                required: true,
                message: '请输入船舶',
              },
            ]}
          >
            <Select placeholder="请选择船舶" onSelect={onShipSelect}>
              {shipMeta?.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {formMeta?.managerSelect && (
          <Form.Item
            labelCol={{ span: 8 }}
            name="managerId"
            label="请选择申请人"
            rules={[
              {
                required: true,
                message: '请输入申请人',
              },
            ]}
          >
            <Select placeholder="请选择申请人" onSelect={onManagerSelect}>
              {managerList?.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Divider />

        <FormBuilder meta={formMeta} form={form} />

        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <Button type="primary" htmlType={'submit'}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DocumentBasicForm;
