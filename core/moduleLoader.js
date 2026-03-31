export const moduleLoaders = {
	'/main': {
		loader: () => import('../modules/main.module.js'),
		meta: { path: '/main', title: '會員專區' }
	},
	'/about': {
		loader: () => import('../modules/about.module.js'),
		meta: { path: '/about', title: '關於' }
	}
};