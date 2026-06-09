/* role.js - Simple role detection and permission handling */
(function() {
  // Determine role: first try global variable, then cookie, fallback to 'cashier'
  var role = window.currentUserRole || (function() {
    var match = document.cookie.match(/(?:^|; )role=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : 'cashier';
  })();
  window.currentUserRole = role; // Ensure global variable is set

  // Permission definitions (simple wildcard matching)
  var rolePermissions = {
    admin: [
      'dashboard.overview',
      'food.*',
      'inventory.*',
      'billing.*',
      'cashier.*',
      'reviews.*',
      'reports.*',
      'users.*',
      'settings.*'
    ],
    cashier: [
      'cashier.*',
      'billing.*'
    ]
  };

  // Helper to test wildcard permission
  function hasPermission(perm) {
    var perms = rolePermissions[role] || [];
    return perms.some(function(p) {
      if (p.endsWith('.*')) {
        var prefix = p.slice(0, -2);
        return perm.startsWith(prefix);
      }
      return p === perm;
    });
  }

  // Expose utility globally
  window.hasPermission = hasPermission;

  // Apply visibility to sidebar items based on data-permission attribute
  document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('.admin-menu a[data-permission]');
    links.forEach(function(link) {
      var perm = link.getAttribute('data-permission');
      if (!hasPermission(perm)) {
        link.style.display = 'none';
      }
    });
  });
})();
