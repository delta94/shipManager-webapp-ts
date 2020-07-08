import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest, useToggle } from '@umijs/hooks';
import { Descriptions, Card, Table, Button, Modal, message } from 'antd';
import { getCompanyInfo, CompanyKeyMap as CompanyKeys } from '@/services/companyService';
import { getCompanyCertInfo, deleteCompanyCert } from '@/services/companyCertService';
import { ICompanyCert } from '@/interfaces/ICompany';
import { columns, tabList } from './constant';
import EditBasicForm from './editBaiscForm';
import EditContactForm from '@/pages/company/infoCompany/editContactForm';
import EditCertificateForm from '@/pages/company/infoCompany/editCertificateForm';
import hooks from '@/pages/company/infoCompany/hooks';

const InfoCompany: React.FC = () => {
  const [permissionCerts, updatePermissionCerts] = useState<ICompanyCert[]>([]);
  const [extraCerts, updateExtraCerts] = useState<ICompanyCert[]>([]);
  const [tab, updateTab] = useState<string>('permission'); // 'permission' | 'extra'
  const [editCertificate, updateEditCertificate] = useState<ICompanyCert>();

  const { setLeft: hideEditBasic, setRight: showEditBasic, state: editBasicVisible } = useToggle(false);

  const { setLeft: hideEditContact, setRight: showEditContact, state: editContactVisible } = useToggle(false);

  const { setLeft: hideEditCerts, setRight: showEditCerts, state: editCertsVisible } = useToggle(false);

  const { data: company, loading: loadingCompany, refresh: refreshCompanyInfo } = useRequest(getCompanyInfo, {
    cacheKey: 'company_base_info',
  });

  const { loading: loadingCompanyCert, refresh: refreshCompanyCert } = useRequest(getCompanyCertInfo, {
    cacheKey: 'company_certs_info',
    onSuccess(result) {
      updateExtraCerts(result.filter(item => item.companyCertTypeId > 3));
      updatePermissionCerts(result.filter(item => item.companyCertTypeId <= 3));
    },
  });

  const { run: deleteCertificate } = useRequest(deleteCompanyCert, {
    manual: true,
    onSuccess() {
      refreshCompanyCert();
      message.success('证书已删除');
    },
  });

  useEffect(() => {
    const unTapDeleteCompanyCert = hooks.DeleteCompanyCert.tap(value => {
      deleteCertificate(value.id);
    });
    const unTapEditCompanyCert = hooks.EditCompanyCert.tap(value => {
      updateEditCertificate({ ...value });
      showEditCerts();
    });
    const unTapInfoCompanyCert = hooks.InfoCompanyCert.tap(value => {
      console.log(value);
    });

    return () => {
      unTapDeleteCompanyCert();
      unTapEditCompanyCert();
      unTapInfoCompanyCert();
    };
  }, []);

  const onBasicUpdate = () => {
    refreshCompanyInfo();
    hideEditBasic();
    hideEditContact();
  };

  const onCertificateUpdate = () => {
    refreshCompanyCert();
    hideEditCerts();
    updateEditCertificate(undefined);
  };

  const onCertificateCancel = () => {
    hideEditCerts();
    updateEditCertificate(undefined);
  };

  const contentList = {
    permission: (
      <Table pagination={false} loading={loadingCompanyCert} dataSource={permissionCerts} columns={columns} />
    ),
    extra: <Table pagination={false} loading={loadingCompanyCert} dataSource={extraCerts} columns={columns} />,
  };

  return (
    <PageHeaderWrapper title="公司基本信息">
      <Card
        title="基础信息"
        bordered={false}
        style={{ marginTop: 24 }}
        loading={loadingCompany}
        extra={
          <Button type="link" onClick={showEditBasic}>
            编辑
          </Button>
        }
      >
        <Descriptions style={{ marginBottom: 32 }}>
          <Descriptions.Item label={CompanyKeys.name}>{company?.name}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.englishName}>{company?.englishName}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.businessLicenseNumber}>
            {company?.businessLicenseNumber}
          </Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.taxRegistrationNumber}>
            {company?.taxRegistrationNumber}
          </Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.registeredCapital}>{company?.registeredCapital} 万元</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.businessScope}>{company?.businessScope}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.companyTypeName}>{company?.companyTypeName}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.legalPerson}>{company?.legalPerson}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        title="联系方式"
        bordered={false}
        style={{ marginTop: 24 }}
        loading={loadingCompany}
        extra={
          <Button type="link" onClick={showEditContact}>
            编辑
          </Button>
        }
      >
        <Descriptions style={{ marginBottom: 32 }}>
          <Descriptions.Item label={CompanyKeys.district}>{company?.district}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.address}>{company?.address}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.phone}>{company?.phone}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.fax}>{company?.fax}</Descriptions.Item>
          <Descriptions.Item label={CompanyKeys.postcode}>{company?.postcode}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        bordered={false}
        tabList={tabList}
        style={{ marginTop: 24 }}
        onTabChange={updateTab}
        tabBarExtraContent={
          <Button type="link" onClick={showEditCerts}>
            新增证书
          </Button>
        }
      >
        {contentList[tab]}
      </Card>

      <Modal
        visible={editBasicVisible}
        title="编辑公司信息"
        destroyOnClose={true}
        footer={null}
        onCancel={hideEditBasic}
      >
        <EditBasicForm company={company} onUpdate={onBasicUpdate} onCancel={hideEditBasic} />
      </Modal>

      <Modal
        visible={editContactVisible}
        title="编辑公司联系方式"
        destroyOnClose={true}
        footer={null}
        onCancel={hideEditContact}
      >
        <EditContactForm company={company} onUpdate={onBasicUpdate} onCancel={hideEditContact} />
      </Modal>

      <Modal
        width={600}
        title={`${editCertificate ? '编辑' : '新增'}公司证书`}
        visible={editCertsVisible}
        destroyOnClose={true}
        footer={null}
        onCancel={onCertificateCancel}
      >
        <EditCertificateForm
          certificate={editCertificate}
          onUpdate={onCertificateUpdate}
          onCancel={onCertificateCancel}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default InfoCompany;
