export function createStore(initialState) {
	const listeners = [];

	const state = new Proxy(initialState, {
		set(target, key, value) {
			target[key] = value;
			listeners.forEach(fn => fn({ key, value, state }));
			return true;
		}
	});

	return {
		state,
		subscribe(fn) {
			if (typeof fn !== 'function') return () => { };
			listeners.push(fn);
			return () => {
				const index = listeners.indexOf(fn);
				if (index >= 0) listeners.splice(index, 1);
			};
		}
	};
}

export const store = createStore({
	user: null
});