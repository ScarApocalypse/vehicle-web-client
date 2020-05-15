import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/book',
    name: 'book',
    redirect: '/book/create',
    component: Layout,
    meta: {
      title: '图书管理',
      icon: 'documentation',
      roles: ['administrator', 'editor']
    },
    hidden: false,
    children: [
      {
        path: '/book/create',
        name: 'bookCreate',
        component: () => import('@/views/book/create'),
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/book/edit/:fileName',
        name: 'bookEdit',
        component: () => import('@/views/book/edit'),
        meta: {
          title: '编辑图书',
          icon: 'edit',
          roles: ['administrator'],
          activeMenu: '/book/list'
        },
        hidden: false
      },
      {
        path: '/book/list',
        name: 'bookList',
        component: () => import('@/views/book/list'),
        meta: {
          title: '图书列表',
          icon: 'list',
          roles: ['editor', 'administrator']
        },
        children: [
          {
            path: '/book/create',
            name: 'bookCreate',
            component: () => import('@/views/book/create'),
            meta: { title: '上传图书', icon: 'edit', roles: ['administrator'] }
          }
        ]
      }
    ]
  },
  {
    path: '/vehicle',
    name: 'vehicle',
    redirect: '/vehicle/list',
    component: Layout,
    meta: {
      title: ' 车辆管理',
      icon: 'documentation',
      roles: ['administrator']
    },
    children: [
      {
        path: '/vehicle/list',
        name: 'vehicleList',
        component: () => import('@/views/vehicle/list'),
        meta: { title: 'GPS信息', icon: 'list' }
      },
      {
        path: '/vehicle/data/:id',
        name: 'vehicleData',
        component: () => import('@/views/vehicle/data'),
        meta: {
          title: '报警统计',
          icon: 'list',

          activeMenu: '/vehicle/data'
        },
        hidden: true
      },
      {
        path: '/vehicle/data',
        name: 'vehicleData',
        redirect: '/vehicle/data/0',
        component: () => import('@/views/vehicle/data'),
        meta: {
          title: '报警统计',
          icon: 'list',

          activeMenu: '/vehicle/data'
        }
      }
    ]
  },
  {
    path: '/uservehicle',
    name: 'uservehicle',
    redirect: '/uservehicle/list',
    component: Layout,
    meta: {
      title: ' 车辆信息',
      icon: 'documentation',
      roles: ['user']
    },
    children: [
      {
        path: '/uservehicle/list',
        name: 'uservehicleList',
        component: () => import('@/views/uservehicle/list'),
        meta: { title: 'GPS信息', icon: 'list' }
      },
      {
        path: '/uservehicle/data',
        name: 'uservehicleList',
        component: () => import('@/views/uservehicle/data'),
        meta: { title: '报警统计', icon: 'list' }
      }
    ]
  },
  { path: '*', redirect: '/', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
