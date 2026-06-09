/* admin_router.js - Simple hash based client side router */
(function() {
  // Mapping of hash routes to module HTML files
  const routes = {
    '/overview': 'modules/overview.html',
    '/food': 'modules/food-management.html',
    '/inventory': 'modules/inventory-management.html',
    '/billing': 'modules/billing.html',
    '/cashier': 'modules/cashier.html',
    '/reviews': 'modules/review-management.html',
    '/reports': 'modules/sales-report.html',
    '/users': 'modules/user-management.html',
    '/settings': 'modules/system-settings.html'
  };

  // Load a module fragment into the #content container
  async function loadModule(path) {
    const container = document.getElementById('content');
    if (!container) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Failed to load');
      const html = await res.text();
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<p style="color:red;">Error loading module: ${e.message}</p>`;
    }
  }

  // Router handler
  function onRouteChange() {
    const hash = window.location.hash || '#/overview';
    const route = hash.replace('#', '');
    const modulePath = routes[route] || routes['/overview'];
    // Highlight active menu link
    document.querySelectorAll('.admin-menu a').forEach(a => {
      const target = a.getAttribute('href');
      if (target === `#${route}`) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
    loadModule(modulePath);
  }

  // Initial load
  window.addEventListener('hashchange', onRouteChange);
  document.addEventListener('DOMContentLoaded', onRouteChange);
})();
