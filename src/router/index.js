import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import login from "../views/login/login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
    children:[
      {
        path: "teacherManage",
        name: "教师管理",
        component: () => import(/* webpackChunkName: "teacherManager" */ '../views/home/admin/teachersManage.vue')
      },
      {
        path: "studentManage",
        name: "学生管理",
        component: () => import(/* webpackChunkName: "studentManage" */ '../views/home/admin/studentsManage.vue')
      },
      {
        path: "adminManage",
        name: "管理员管理",
        component: () => import(/* webpackChunkName: "adminsManage" */ '../views/home/admin/adminsManage.vue')
      },
      {
        path: "placeManage",
        name: "楼栋管理",
        component: () => import(/* webpackChunkName: "placeManage" */ '../views/home/admin/placeManage.vue')
      },
      {
        path: "apartmentManage",
        name: "实验室管理",
        component: () => import(/* webpackChunkName: "apartmentManage" */ '../views/home/admin/apartmentManage.vue')
      },
      {
        path: "addequipment",
        name: "添加设备",
        component: () => import(/* webpackChunkName: "addequipment" */ '../views/home/admin/addequipment.vue')
      },
      {
        path: "deleteequipment",
        name: "删除/状态管理",
        component: () => import(/* webpackChunkName: "deleteequipment" */ '../views/home/admin/deleteequipment.vue')
      }, {
        path: "experimental",
        name: "实验室预约",
        component: () => import(/* webpackChunkName: "experimental" */ '../views/home/admin/experimental.vue')
      },{
        path: "equipment",
        name: "设备预约",
        component: () => import(/* webpackChunkName: "equipment" */ '../views/home/admin/equipment.vue')
      },

    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {path:'*',redirect:'/home'}
];

const router = new VueRouter({
  mode:'history',
  routes
});

export default router
