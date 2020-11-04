import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest, IRouteComponentProps } from 'umi';
import { Descriptions, Card, Table, Button, Modal, message } from 'antd';
import { getCompanyInfo, CompanyKeyMap as CompanyKeys } from '@/services/companyService';
import { deleteCompanyCert } from '@/services/companyCertService';
import { ICompanyCert } from '@/interfaces/ICompany';
import { columns } from './constant';
import EditBasicForm from './editBaiscForm';
import EditContactForm from '@/pages/company/infoCompany/editContactForm';
import EditCertificateForm from '@/pages/company/infoCompany/editCertificateForm';
import hooks from '@/pages/company/infoCompany/hooks';
import useToggle from '@/hooks/useToggle';

const InfoCompany: React.FC<IRouteComponentProps> = ({ history }) => {
  const [editCertificate, updateEditCertificate] = useState<ICompanyCert>();

  const [editBasicVisible, { setLeft: hideEditBasic, setRight: showEditBasic }] = useToggle(false);

  const [editContactVisible, { setLeft: hideEditContact, setRight: showEditContact }] = useToggle(false);

  const [editCertsVisible, { setLeft: hideEditCerts, setRight: showEditCerts }] = useToggle(false);

  const { data: company, loading: loadingCompany, refresh: refreshCompanyInfo } = useRequest(getCompanyInfo, {
    cacheKey: 'company_base_info',
  });

  const { run: deleteCertificate } = useRequest(deleteCompanyCert, {
    manual: true,
    onSuccess() {
      refreshCompanyInfo();
      message.success('证书已删除');
    },
  });

  useEffect(() => {
    const unTapDeleteCompanyCert = hooks.DeleteCompanyCert.tap((value) => {
      deleteCertificate(value.id);
    });
    const unTapEditCompanyCert = hooks.EditCompanyCert.tap((value) => {
      updateEditCertificate({ ...value });
      showEditCerts();
    });
    const unTapInfoCompanyCert = hooks.InfoCompanyCert.tap((value) => {
      history.push(`/company/certificate/${value.id}`);
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
    hideEditCerts();
    updateEditCertificate(undefined);
    refreshCompanyInfo();
  };

  const onCertificateCancel = () => {
    hideEditCerts();
    updateEditCertificate(undefined);
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
        title="相关证书"
        bordered={false}
        style={{ marginTop: 24 }}
        extra={
          <Button type="link" onClick={showEditCerts}>
            新增证书
          </Button>
        }
      >
        <Table
          pagination={false}
          key="id"
          loading={loadingCompany}
          dataSource={company?.companyCerts}
          columns={columns}
        />
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
