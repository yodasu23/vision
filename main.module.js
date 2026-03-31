import { ModuleStrategy } from '../core/ModuleStrategy.js';
import { defineModule } from '../core/moduleRegistry.js';
import * as Util from '../../../new_friday/util.js'
import * as System from '../../../new_friday/system.js'

export default defineModule({
	path: '/main',
	htmlPath: '/html/account/main.htm',
	stylePath: '/css/account/main.css',
	keepAlive: true
}, class extends ModuleStrategy {
	#plusBtn = null;
	#timer = null;

	async init(ctx) {
		this.ctx = ctx;
		Util.httpGet(System.ApiName.PLAY_LIST, { contentType: 0, offset: 0, length: 3 }, (data) => {
			this.apiCache(System.ApiName.PLAY_LIST, { contentType: 0, offset: 0, length: 3 }, data)
			this.#renderPlayList(data)
		})
	}

	bindEvents() {
		this.ctx.event.on(this.#plusBtn, 'click', () => {

		});
	}

	async afterRender() {
		//this.#renderCounter();
	}

	onShow() {
		this.#timer = window.setInterval(() => {
			console.log('[main] active');
		}, 5000);
	}

	onHide() {
		if (this.#timer) {
			clearInterval(this.#timer);
			this.#timer = null;
		}
	}

	destroy() {
		this.onHide();
		super.destroy();
	}

	#renderPlayList(data) {
		debugger
		const playList = this.root.querySelector('.playList');
		data.data?.playList?.forEach(item => {
			let htmltemple = `<div><span>${item.chineseName}</span></div><br/>`
			const parse = new DOMParser().parseFromString(htmltemple, 'text/html').body.firstElementChild
			playList.append(parse.cloneNode(true))
		})
	}


});