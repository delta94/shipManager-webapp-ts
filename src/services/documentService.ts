import request from '@/utils/request';
import { IDocument, ITemplateDTO } from '@/interfaces/IDocument';
import { PageableData } from '@/interfaces/ITableList';
import { parsePagination } from '@/utils/parser';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';

export async function listDocument(page: number = 1, size: number = 20, extra: any): Promise<PageableData<IDocument>> {
  return await request('/api/documents', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      ...extra,
    },
    getResponse: true,
  }).then(({ data, response }) => {
    return {
      list: data,
      pagination: parsePagination(response.headers),
    } as PageableData<IDocument>;
  });
}

export async function createDocument(manager: IDocument) {
  return request(`/api/documents/`, {
    method: 'POST',
    data: manager,
  });
}

export async function updateDocument(manager: IDocument) {
  return request(`/api/documents/`, {
    method: 'PUT',
    data: manager,
  });
}

export async function deleteDocument(id: number) {
  return request(`/api/documents/${id}`, {
    method: 'DELETE',
  });
}

export async function infoDocument(id: string): Promise<IDocument> {
  return request(`/api/documents/${id}`, {
    method: 'GET',
  });
}

export async function generateDocument(id: string, data: ITemplateDTO): Promise<string> {
  return request(`/api/documents/generate/${id}`, {
    method: 'POST',
    data: data,
  });
}

export async function listDocumentCategory(): Promise<Record<ICategory, ICommonOptionType[]>> {
  return request(`api/common-option-types/document`, {
    method: 'GET',
  });
}

export const DocumentKeyMap = {
  name: '文件名',
  size: '文件大小',
  mimeType: '文件类型',
  remark: '备注',
  uploadBy: '上传者',
  updateAt: '上传日期',
  version: '版本号',
  documentCategoryTypeId: '分类',
  documentCategoryTypeName: '分类',
};
