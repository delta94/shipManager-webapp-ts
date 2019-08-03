import React  from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
} from 'antd';
import FooterToolbar from './components/FooterToolbar';
import { connect } from 'dva';

import styles from './style.less';
import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import PageHeaderWrapper from "@ant-design/pro-layout/es/PageHeaderWrapper";
import {ShipStateType} from "@/models/ship";
import {IShipBusinessArea, IShipMaterial, IShipType} from "@/interfaces/IShip";
import {TableForm} from "@/pages/ship/create/components/TableForm";

const { Option } = Select;

const fieldLabels = {
  name: '船舶名',
  carrierIdentifier: "船舶识别号",
  owner: "船舶所有人",
  shareInfo: "船舶共有情况",
  harbor: "船籍港",
  formerName: "曾用名",
  registerIdentifier: "初次登记号",
  examineIdentifier: "船检登记号",
  material: "船舶材质",
  buildAt: "建造完工日期",
  assembleAt:"安放龙骨日期",
  type: '船舶类型',
  power: '发动机功率',
  grossTone: '总吨位 (吨)',
  netTone: '净吨位 (吨)',
  length: '船身长 (米)',
  width: '船身宽 (米)',
  depth: '船身深 (米)',
  height: '船身高 (米)'
};

// const mockData = {
//   "name": "章云号",
//   "typeId": 1,
//   "materialId": 2,
//   "owner": "李星",
//   "shareInfo": "托管",
//   "registerIdentifier": "2148932",
//   "examineIdentifier": "3820311",
//   "carrierIdentifier": "3233333",
//   "buildAt": "2018-10-09",
//   "assembleAt": "2018-10-09",
//   "harbor": "珠海港",
//   "formerName": "",
//   "grossTone": 138,
//   "netTone": 234,
//   "length": 12,
//   "width": 12,
//   "height": 32,
//   "depth": 32,
//   "createAt": "2018-10-09 22:39:05",
//   "updateAt": "2018-10-09 22:40:47"
// };

interface ShipCreateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  types: IShipType[],
  materials: IShipMaterial[]
  businessAreas: IShipBusinessArea[]
}


@connect(({ ship, loading}: {
    ship: ShipStateType
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    types: ship.types,
    materials: ship.materials,
    businessAreas: ship.businessAreas,
    loading: loading.effects['ship/create'],
  }),
)
class ShipCreate extends React.Component<ShipCreateProps>  {

  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });

    this.resizeFooterToolbar();

    this.props.dispatch({type: 'ship/fetchTypes'});
    this.props.dispatch({type: 'ship/fetchBusinessAreas'});
    this.props.dispatch({type: 'ship/fetchMaterial'});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const { form: { getFieldsError } } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) { return null }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
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
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        values.assembleAt = values.assembleAt.format("YYYY-MM-DD");
        values.buildAt = values.buildAt.format("YYYY-MM-DD");
        dispatch({ type: 'ship/create', payload: values });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      types,
      materials,
      businessAreas
    } = this.props;
    const { width } = this.state;

    return (
      <PageHeaderWrapper title="新船舶信息" content="按表单提示填入相应船舶信息">
        <Form layout="vertical" hideRequiredMark>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入船舶名称' }],
                  })(<Input placeholder="请输入船舶名称" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.carrierIdentifier}>
                  {getFieldDecorator('carrierIdentifier', {
                    rules: [{ required: true, message: '请输入船舶识别号' }],
                  })(<Input placeholder="请输入船舶识别号" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.owner}>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请输入船舶所有人' }],
                  })(<Input placeholder="请输入船舶所有人" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('typeId', {
                    rules: [{ required: true, message: '请选择船舶类型' }],
                  })(
                    <Select placeholder="请选择船舶类型">
                      {types && types.map((val) => {
                        return <Option value={val.id} key={val.id}>{val.name}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.shareInfo}>
                  {getFieldDecorator('shareInfo', {
                    rules: [{ required: true, message: '请输入船舶共有情况' }],
                  })(<Input placeholder="请输入船舶共有情况" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.registerIdentifier}>
                  {getFieldDecorator('registerIdentifier', {
                    rules: [{ required: true, message: '请输入船舶初次登记号' }],
                  })(<Input placeholder="请输入船舶初次登记号" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.examineIdentifier}>
                  {getFieldDecorator('examineIdentifier', {
                    rules: [{ required: true, message: '请输入船舶船检登记号' }],
                  })(<Input placeholder="请输入船舶船检登记号" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.material}>
                  {getFieldDecorator('materialId', {
                    rules: [{ required: true, message: '请选择船舶材质' }],
                  })(
                    <Select placeholder="请选择船舶材质">
                      {materials && materials.map((val) => {
                        return <Option value={val.id} key={val.id}>{val.name}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.harbor}>
                  {getFieldDecorator('harbor', {
                    rules: [{ required: true, message: '请输入船籍港' }],
                  })(<Input placeholder="请输入船籍港" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.formerName}>
                  {getFieldDecorator('formerName', {
                    rules: [{ required: false, message: '请输入曾用名' }],
                  })(<Input placeholder="请输入曾用名" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.buildAt}>
                  {getFieldDecorator('buildAt', {
                    rules: [{ required: true, type: 'object', message: '请输入建造完工日期' }],
                  })(<DatePicker  format="YYYY-MM-DD" placeholder="请输入建造完工日期" style={{ width: '100%' }}  />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.assembleAt}>
                  {getFieldDecorator('assembleAt', {
                    rules: [{ required: true, type: 'object', message: '请输入安放龙骨日期' }],
                  })(<DatePicker  format="YYYY-MM-DD" placeholder="请输入安放龙骨日期" style={{ width: '100%' }}  />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="船舶参数" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.grossTone}>
                  {getFieldDecorator('grossTone', {
                    rules: [{ required: true, message: '请输入船舶总吨' }],
                  })(<Input placeholder="请输入船舶总吨" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.netTone}>
                  {getFieldDecorator('netTone', {
                    rules: [{ required: true, message: '请输入船舶净吨' }],
                  })(<Input placeholder="请输入船舶净吨" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.length}>
                  {getFieldDecorator('length', {
                    rules: [{ required: true, message: '请输入船舶总长' }],
                  })(<Input placeholder="请输入船舶总长" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.width}>
                  {getFieldDecorator('width', {
                    rules: [{ required: true, message: '请输入船舶总宽' }],
                  })(<Input placeholder="请输入船舶总宽" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.depth}>
                  {getFieldDecorator('depth', {
                    rules: [{ required: true, message: '请输入船舶型深' }],
                  })(<Input placeholder="请输入船舶型深" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.height}>
                  {getFieldDecorator('height', {
                    rules: [{ required: true, message: '请输入船舶船高' }],
                  })(<Input placeholder="请输入船舶船高" />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="载重吨列表" bordered={false}>
            {getFieldDecorator('payloads', {
              initialValue: [],
            })(<TableForm areaList={businessAreas} />)}
          </Card>

          <Card title="船员信息" className={styles.card} bordered={false}>
            <div>todo</div>
          </Card>

          <FooterToolbar style={{ width }}>
            {this.getErrorInfo()}
            <Button type="primary" onClick={this.validate} loading={submitting}>
              保存船舶
            </Button>
          </FooterToolbar>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ShipCreateProps>()(ShipCreate);
