import request from '@/utils/request'

export function listAccount(params) {
  return request({
    url: '/account/list',
    method: 'get',
    params
  })
}

export function addAccount(data) {
  return request({
    url: '/account/add',
    method: 'post',
    data
  })
}

export function deleteAccount(id) {
  return request({
    url: '/account/delete',
    method: 'delete',
    params: { id }
  })
}

export function updateAccount(data) {
  return request({
    url: '/account/update',
    method: 'post',
    data
  })
}
