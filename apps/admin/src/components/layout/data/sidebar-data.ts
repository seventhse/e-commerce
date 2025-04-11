import {
  IconCategory,
  IconLayoutDashboard,
  IconReceipt,
  IconShoppingCart,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: '仪表盘',
      items: [
        {
          title: '概览',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: '商品管理',
      items: [
        {
          title: '商品列表',
          url: '/products',
          icon: IconShoppingCart,
        },
        {
          title: '商品分类',
          url: '/product-categories',
          icon: IconCategory,
        },
      ],
    },
    {
      title: '订单管理',
      items: [
        {
          title: '订单列表',
          url: '/orders',
          icon: IconReceipt,
        },
      ],
    },
    {
      title: '系统管理',
      items: [
        {
          title: '用户管理',
          url: '/users',
          icon: IconUsers,
        },
        {
          title: '客户管理',
          url: '/consumers',
          icon: IconUsersGroup,
        },
      ],
    },
  ],
}
