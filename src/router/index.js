import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/views/Welcome.vue'
import Users from '@/views/Users.vue'
import Rights from '@/views/Rights.vue'
import Roles from '@/views/Roles.vue'
import Categories from '@/views/Categories.vue'
import Cateparams from '@/views/Cateparams.vue'
import Goods from '@/views/Goods.vue'
import Add from '@/views/Add.vue'
import Orders from '@/views/Orders.vue'
import Reports from '@/views/Reports.vue'
Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/home',
			component: Home,
			redirect: '/home/welcome',
			children: [{
					path: 'welcome',
					component: Welcome
				},
				{
					path: 'users',
					component: Users
				},
				{
					path: 'rights',
					component: Rights
				},
				{
					path: 'roles',
					component: Roles
				},
				{
					path: 'categories',
					component: Categories
				},
				{
					path: 'params',
					component: Cateparams
				},
				{
					path: 'goods',
					component: Goods,
				},
				{
					path:'add',
					component:Add
				},
				{
					path:'orders',
					component:Orders
				},
				{
					path:'reports',
					component:Reports
				}
			]
		}
	]

})

router.beforeEach((to, from, next) => {
	if (to.path === '/login') {
		next()
	}
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) {
		next('/login')
	} else {
		next()
	}
})

export default router
