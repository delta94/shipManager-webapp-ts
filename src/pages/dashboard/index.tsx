import { Row, Col, Card } from 'antd';
import * as React from 'react';

class Dashboard extends React.Component {
  render() {
    return (
      <div style={{ padding: '12px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
