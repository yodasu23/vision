const modules = new Map();

function normalizePath(path) {
	if (!path) throw new Error('module path is required');
	return path.startsWith('/') ? path : `/${path}`;
}

export function registerModule(meta, ModuleClass) {
	const normalizedMeta = {
		...meta,
		path: normalizePath(meta.path)
	};

	if (modules.has(normalizedMeta.path)) {
		console.warn(`[moduleRegistry] duplicate module path: ${normalizedMeta.path}`);
	}

	modules.set(normalizedMeta.path, {
		meta: normalizedMeta,
		ModuleClass
	});
}

export function getModule(path) {
	return modules.get(normalizePath(path));
}

export function getAllModules() {
	return [...modules.values()];
}

export function defineModule(meta, ModuleClass) {
	registerModule(meta, ModuleClass);
	return ModuleClass;
}

export function withAuth(role) {
	return function(ModuleClass) {
		return class extends ModuleClass {
			requiredRole = role;
		};
	};
}