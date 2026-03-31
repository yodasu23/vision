const plugins = [];

export function use(plugin) {
	if (!plugin || typeof plugin !== 'object') {
		throw new Error('plugin must be an object');
	}

	plugins.push(plugin);
}

export function runHook(hook, ctx) {
	for (const plugin of plugins) {
		const fn = plugin?.[hook];
		if (typeof fn !== 'function') continue;

		try {
			fn(ctx);
		} catch (error) {
			console.error(`[pluginSystem] plugin hook error: ${hook}`, error);
		}
	}
}