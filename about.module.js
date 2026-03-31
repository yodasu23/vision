import { ModuleStrategy } from '../core/ModuleStrategy.js';
import { defineModule } from '../core/moduleRegistry.js';

export default defineModule({
	path: '/about',
	htmlPath: '/html/account/about.htm',
	stylePath: '/css/account/about.css',
	keepAlive: true
}, class extends ModuleStrategy {
	#value = '';
	#textEl = null;
	#plusBtn = null;

	async init(ctx) {
		this.ctx = ctx;
		this.#textEl = this.root.querySelector('.buttonCalss');
		this.#plusBtn = this.root.querySelector('.plusA');
	}

	bindEvents() {
		this.ctx.event.on(this.#plusBtn, 'click', () => {
			this.#value += 'A';
			this.#renderText();
		});
	}

	async afterRender() {
		this.#renderText();
	}

	onShow() {
		this.#renderText();
	}

	onHide() {
		// 保留給 timer / polling / animation 暫停使用
	}

	destroy() {
		super.destroy();
	}

	#renderText() {
		if (this.#textEl) {
			this.#textEl.textContent = this.#value;
		}
	}
});