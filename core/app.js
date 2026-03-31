import { router } from './route.js';
import { moduleLoaders } from '../core/moduleLoader.js';

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export function renderSidebar() {
  const el = document.getElementById('sidebar');

  el.innerHTML = Object.values(moduleLoaders)
    .map(m => `<a href="#${m.meta.path}">${m.meta.title}</a>`)
    .join('');
}

renderSidebar();