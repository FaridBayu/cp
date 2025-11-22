import { DashboardPresenter } from '../features/dashboard/DashboardPresenter.js';
import { ProductPresenter } from '../features/products/ProductPresenter.js';
import { HistoryPresenter } from '../features/history/HistoryPresenter.js';
import { CalculatorPresenter } from '../features/estimation/CalculatorPresenter.js';
import { KursPresenter } from '../features/market-data/KursPresenter.js';
import { AuditPresenter } from '../features/audit/AuditPresenter.js';
import { updateSidebarActive } from './layouts/SidebarLayout.js';

const routes = {
  '/dashboard': DashboardPresenter,
  '/products': ProductPresenter,
  '/history': HistoryPresenter,
  '/calculator': CalculatorPresenter,
  '/market-data': KursPresenter,
  '/audit': AuditPresenter,
};

const mainContent = document.querySelector('#main-content');

function router() {
  const hash = window.location.hash || '#/dashboard';
  const route = hash.substring(1);
  const presenter = routes[route] || routes['/dashboard'];
  presenter(mainContent);
  updateSidebarActive(hash);
}

export function initializeRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}
