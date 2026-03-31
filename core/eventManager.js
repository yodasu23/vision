export function createEventManager() {
	const events = [];

	return {
		on(el, evt, fn, options) {
			if (!el) {
				console.warn(`[eventManager] element not found for event "${evt}"`);
				return;
			}

			el.addEventListener(evt, fn, options);
			events.push(() => el.removeEventListener(evt, fn, options));
		},

		cleanup() {
			events.forEach(off => off());
			events.length = 0;
		}
	};
}