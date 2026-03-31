import { createEventManager } from './eventManager.js';
import { runHook } from './pluginSystem.js';
import { store } from './store.js';

class ModuleManager {
	#currentStyle = null;
	#currentModule = null;

	constructor() {
		this.cache = new Map();
	}

	async load(module) {
		const app = document.getElementById('app');
		const previousModule = this.#currentModule;

		if (!app) {
			throw new Error('#app element not found');
		}

		if (previousModule?.path === module.path) {
			return;
		}

		if (previousModule?.onHide) {
			previousModule.onHide();
		}

		if (module.stylePath) {
			this.#loadCSS(module.stylePath);
		}

		if (module.keepAlive && this.cache.has(module.path)) {
			const cached = this.cache.get(module.path);

			app.innerHTML = '';
			app.appendChild(cached.root);

			this.#currentModule = cached.module;

			await cached.module.afterRender?.();
			cached.module.onShow?.();

			runHook('afterLoad', {
				module: cached.module,
				ctx: cached.module.ctx,
				fromCache: true
			});

			return;
		}

		if (previousModule && !previousModule.keepAlive) {
			previousModule.destroy?.();
		}

		const ctx = {
			event: createEventManager(),
			store,
		};

		runHook('beforeLoad', { module, ctx });

		const html = await module.mount(ctx);
		const wrap = document.createElement('div');
		wrap.innerHTML = html.trim();

		const root = wrap.firstElementChild;

		if (!root) {
			throw new Error(`[moduleManager] module ${module.path} has no root element`);
		}

		app.innerHTML = '';
		app.appendChild(root);

		module.setRoot(root);
		module.ctx = ctx;

		if (!module.initialized) {
			await module.init(ctx);
			module.bindEvents?.();
			module.initialized = true;
		}

		await module.afterRender?.();
		module.onShow?.();

		if (module.keepAlive) {
			this.cache.set(module.path, {
				module,
				root
			});
		}

		this.#currentModule = module;

		runHook('afterLoad', { module, ctx, fromCache: false });
	}

	clearCache(path) {
		const normalized = path.startsWith('/') ? path : `/${path}`;
		const cached = this.cache.get(normalized);

		if (!cached) return;

		cached.module?.destroy?.();
		this.cache.delete(normalized);
	}

	#loadCSS(path) {
		if (this.#currentStyle?.getAttribute('href') === path) {
			return;
		}

		if (this.#currentStyle) {
			this.#currentStyle.remove();
		}

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = path;

		document.head.appendChild(link);
		this.#currentStyle = link;
	}
}

export const moduleManager = new ModuleManager();