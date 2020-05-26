import request from '../utils/request'

export function listVehicle(params) {
  return request({
    url: '/vehicle/list',
    method: 'get',
    params
  })
}

export function getDashInfo(date) {
  return request({
    url: '/vehicle/dashinfo',
    method: 'get',
    params: { date }
  })
}

export function getAlarmMsg(params) {
  return request({
    url: '/vehicle/data',
    method: 'get',
    params
  })
}

export function getUserGpsList(params) {
  return request({
    url: '/vehicle/usergpslist',
    method: 'get',
    params
  })
}

export function addGpsInfo(gpsInfo) {
  return request({
    url: '/vehicle/addgpsinfo',
    method: 'post',
    data: gpsInfo
  })
}

export function deleteGpsInfo({ id, pos_time }) {
  return request({
    url: '/vehicle/delete',
    method: 'delete',
    params: { id, pos_time }
  })
}

export function updateDash(params) {
  return request({
    url: '/vehicle/updatedash',
    method: 'get',
    params
  })
}
