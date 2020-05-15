import request from '../utils/request'

export function listVehicle(params) {
  return request({
    url: '/vehicle/list',
    method: 'get',
    params
  })
}

export function getDashInfo(params) {
  return request({
    url: '/vehicle/dashinfo',
    method: 'get',
    params
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
