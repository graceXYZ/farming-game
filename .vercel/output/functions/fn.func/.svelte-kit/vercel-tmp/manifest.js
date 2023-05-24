export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.e5697925.js","app":"_app/immutable/entry/app.1bf5ad28.js","imports":["_app/immutable/entry/start.e5697925.js","_app/immutable/chunks/index.96eae084.js","_app/immutable/chunks/singletons.a8a261b6.js","_app/immutable/chunks/index.d15f2b6b.js","_app/immutable/chunks/paths.562b5c7b.js","_app/immutable/entry/app.1bf5ad28.js","_app/immutable/chunks/index.96eae084.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js'),
			() => import('../output/server/nodes/2.js'),
			() => import('../output/server/nodes/3.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/level0",
				pattern: /^\/level0\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
