// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}


/** 获取列表 GET */
export async function getList(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/inwe/essay/getEssayList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取列表 GET */
export async function insert(
  data: {
    text: string;
    source: string;
  },
  options?: { [key: string]: any },
) {
  return request('/inwe/essay/insertEssay', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}


/** 删除   DELETE */
export async function deleteById(
  data: {
    id: number
  },
  options?: { [key: string]: any },
) {
  return request(`/inwe/essay/deleteById/${data.id}`, {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 删除   DELETE */
export async function deleteByIds(
  data: {
    ids: React.Key[]
  },
  options?: { [key: string]: any },
) {
  return request(`/inwe/essay/deleteByIds`, {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}


/** 编辑   PUT */
export async function updateById(
  data: {
    infoId: number;
    text: string;
    source: string;
  },
  options?: { [key: string]: any },
) {
  return request(`/inwe/essay/updateById`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

