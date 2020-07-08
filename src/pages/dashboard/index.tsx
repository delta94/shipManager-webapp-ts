import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import React, { Component } from 'react';

import { Link } from 'umi';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import defaultAvatar from '@/assets/icons/avatar.png';
import styles from './style.less';
import { ConnectState } from '@/models/connect';
import IAccount from '@/interfaces/IAccount';

const links = [
  {
    title: '操作一',
    href: '',
  },
  {
    title: '操作二',
    href: '',
  },
  {
    title: '操作三',
    href: '',
  },
  {
    title: '操作四',
    href: '',
  },
  {
    title: '操作五',
    href: '',
  },
  {
    title: '操作六',
    href: '',
  },
];

interface DashBoardProps {
  currentUser?: IAccount;
}

const PageHeaderContent: React.FC<{ currentUser: IAccount }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.imageUrl ? currentUser.imageUrl : defaultAvatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.login}
          ，祝你开心每一天！
        </div>
        <div>船务系统管理人员</div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{}> = () => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="待普通处理任务" value={56} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="待紧急处理任务" value={8} />
    </div>
  </div>
);

class DashBoard extends Component<DashBoardProps> {
  renderActivities = item => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const {
      currentUser,
      activities = [],
      projectNotice = [],
      radarData = [],
      projectLoading = false,
      activitiesLoading = false,
    } = this.props;

    if (!currentUser || !currentUser.id) {
      return null;
    }
    return (
      <PageHeaderWrapper content={<PageHeaderContent currentUser={currentUser} />} extraContent={<ExtraContent />}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="进行中的项目"
              bordered={false}
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              {projectNotice.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo} />
                          <Link to={item.href}>{item.title}</Link>
                        </div>
                      }
                      description={item.description}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to={item.memberLink}>{item.member || ''}</Link>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="动态"
              loading={activitiesLoading}
            >
              <List
                loading={activitiesLoading}
                renderItem={item => this.renderActivities(item)}
                dataSource={[]}
                className={styles.activitiesList}
                size="large"
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card style={{ marginBottom: 24 }} title="快速开始 / 便捷导航" bordered={false} bodyStyle={{ padding: 0 }}>
              <div></div>
            </Card>
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="团队"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {projectNotice.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(DashBoard);
