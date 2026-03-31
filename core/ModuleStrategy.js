/**
@class
@classdesc Module 模板
@description
init()：只做一次，抓 DOM、準備狀態<br/>
bindEvents()：只做一次，綁事件<br/>
afterRender()：每次 DOM 掛上後執行<br/>
onShow()：頁面顯示時執行<br/>
onHide()：頁面切走時暫停行為<br/>
destroy()：完全清理<br/>
*/

export class ModuleStrategy {
	_path;
	_htmlPath;
	_stylePath;
	_keepAlive = true;
	_htmlCache = null;
	#apiCacheMap = new Map();

	ctx = null;
	root = null;
	initialized = false;

	/**
	@constructor
	@param path 路徑名稱
	@param htmlPath html template 路徑
	@param stylePath css style 路徑
	@param keepAlive 物件建立是否保留
	 */
	constructor({ path, htmlPath, stylePath = '', keepAlive = true }) {
		this._path = path;
		this._htmlPath = htmlPath;
		this._stylePath = stylePath;
		this._keepAlive = keepAlive;
	}

	async render() {
		if (this._htmlCache) return this._htmlCache;

		const html = await fetch(this._htmlPath).then(r => r.text());
		this._htmlCache = html;
		return html;
	}

	async mount(ctx) {
		this.ctx = ctx;
		return this.render();
	}

	setRoot(rootEl) {
		this.root = rootEl;
	}

	/**
	@abstract 只初始化一次
	 */
	async init() { }
	
	/**
	@abstract DOM 已掛上後可做的事
	 */
	async afterRender() { }

	/**
	@abstract 綁事件集中放這裡
	 */
	bindEvents() {}

	/**
	@abstract 暫停後啟動的行為
	 */
	onShow() { }

	/**
	@abstract 暫停後的行為
	 */
	onHide() { }

	/**
	@abstract 功能結束
	 */
	destroy() {
		this.ctx?.event?.cleanup?.();
		this.root = null;
		this.ctx = null;
		this.initialized = false;
	}


	/**
	@
	 */
	#createCacheKey(apiName, options) {
		return `${apiName}::${JSON.stringify(options ?? {})}`;
	}

	apiCache(url, options = {}, data) {
		const key = this.#createCacheKey(url, options);
		if (this.#apiCacheMap.has(key)) {
			if (data != null) {
				this.#apiCacheMap.set(key, data)
			}
			return this.#apiCacheMap.get(key);
		}
		return null;
	}

	clearApiCache(urlPart = '') {
		for (const key of this.#apiCacheMap.keys()) {
			if (!urlPart || key.includes(urlPart)) {
				this.#apiCacheMap.delete(key);
			}
		}
	}

	get path() { return this._path; }
	get stylePath() { return this._stylePath; }
	get keepAlive() { return this._keepAlive; }
}