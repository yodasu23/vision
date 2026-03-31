import { moduleLoaders } from './moduleLoader.js';
import { getModule } from './moduleRegistry.js';
import { moduleManager } from './moduleManager.js';

export async function router() {
	const path = normalizeRoute(location.hash.slice(1) || '/main');

	try {
		if (!getModule(path)) {
			const moduleLoader = moduleLoaders[path];

			if (!moduleLoader) {
				render404();
				return;
			}

			await moduleLoader.loader();
		}

		const record = getModule(path);

		if (!record) {
			render404();
			return;
		}

		const instance = new record.ModuleClass(record.meta);
		await moduleManager.load(instance);
	} catch (error) {
		console.error('[router] load failed', error);
		renderError(error);
	}
}

function normalizeRoute(path) {
	if (!path) return '/main';
	return path.startsWith('/') ? path : `/${path}`;
}

function render404() {
	const app = document.getElementById('app');
	if (app) app.innerHTML = '<div>404</div>';
}

function renderError(error) {
	const app = document.getElementById('app');
	if (app) {
		app.innerHTML = `<div>頁面載入失敗：${escapeHtml(error.message)}</div>`;
	}
}

function escapeHtml(str) {
	return String(str)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}