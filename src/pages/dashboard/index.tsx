import { Avatar, Card, Col, Skeleton, Row, Statistic } from 'antd';
import React, { Component } from 'react';
import { Link, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import { ConnectState } from '@/models/connect';
import IAccount from '@/interfaces/IAccount';
import useCreation from '@/hooks/useCreation';
import { ReactComponent as User } from '@/assets/svg/user.svg';

interface DashBoardProps {
  currentUser?: IAccount;
  activities: any[];
  projectNotice: any[];
  radarData: any[];
  projectLoading: boolean;
  activitiesLoading: boolean;
}

const PageHeaderContent: React.FC<{ currentUser: IAccount }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  const helloText = useCreation(() => {
    let timeNow = new Date();
    let hours = timeNow.getHours();
    let text = '';
    if (hours >= 0 && hours <= 10) {
      text = '早上好';
    } else if (hours > 10 && hours <= 14) {
      text = '中午好';
    } else if (hours > 14 && hours <= 18) {
      text = '下午好';
    } else if (hours > 18 && hours <= 24) {
      text = '晚上好';
    }
    return `${text} ${currentUser.login}！`;
  }, [currentUser]);
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar
          size={72}
          icon={<User />}
          src={currentUser.imageUrl}
          alt="avatar"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>{helloText}</div>
        <div>
          <strong>{currentUser.company.name}</strong> - 船务系统管理人员
        </div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{}> = () => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="待普通处理任务" value={0} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="待紧急处理任务" value={0} />
    </div>
  </div>
);

class DashBoard extends Component<DashBoardProps> {

  render() {
    const { currentUser, projectNotice = [], projectLoading = false } = this.props;

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
              bodyStyle={{ padding: 0 }}
            >

            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="团队"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {projectNotice.map((item) => (
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
