/* Admin Mock Data and Shared Logic */

const INVENTORY = [
  { id: 'INV-001', name: 'Burger Buns', cat: 'Bakery', qty: 50, unit: 'pcs', status: 'Low Stock', updated: '2026-06-05' },
  { id: 'INV-002', name: 'Beef Patties', cat: 'Meat', qty: 200, unit: 'pcs', status: 'In Stock', updated: '2026-06-06' },
  { id: 'INV-003', name: 'Cheddar Cheese', cat: 'Dairy', qty: 15, unit: 'kg', status: 'In Stock', updated: '2026-06-04' },
  { id: 'INV-004', name: 'Lettuce', cat: 'Vegetables', qty: 5, unit: 'kg', status: 'Low Stock', updated: '2026-06-06' },
  { id: 'INV-005', name: 'Tomatoes', cat: 'Vegetables', qty: 10, unit: 'kg', status: 'In Stock', updated: '2026-06-06' },
  { id: 'INV-006', name: 'Basmati Rice', cat: 'Grains', qty: 100, unit: 'kg', status: 'In Stock', updated: '2026-06-01' },
];

const BILLS = [
  { id: 'B-1001', customer: 'Rahim Uddin', orderNo: 'ORD-501', amount: 850, method: 'Cash', status: 'Paid', date: '2026-06-06' },
  { id: 'B-1002', customer: 'Karim Hasan', orderNo: 'ORD-502', amount: 1200, method: 'Card', status: 'Paid', date: '2026-06-06' },
  { id: 'B-1003', customer: 'Fatima Begum', orderNo: 'ORD-503', amount: 450, method: 'bKash', status: 'Pending', date: '2026-06-06' },
  { id: 'B-1004', customer: 'Sajid Ali', orderNo: 'ORD-504', amount: 2300, method: 'Cash', status: 'Paid', date: '2026-06-05' },
  { id: 'B-1005', customer: 'Nusrat Jahan', orderNo: 'ORD-505', amount: 320, method: 'Card', status: 'Pending', date: '2026-06-05' },
];

const RECENT_ORDERS = [
  { id: 'ORD-501', customer: 'Rahim Uddin', items: 3, total: 850, status: 'Delivered', time: '10:30 AM' },
  { id: 'ORD-502', customer: 'Karim Hasan', items: 5, total: 1200, status: 'Preparing', time: '11:15 AM' },
  { id: 'ORD-503', customer: 'Fatima Begum', items: 2, total: 450, status: 'Pending', time: '11:45 AM' },
];

/* Shared Logic */

function toggleAdminMenu() {
  const sidebar = document.getElementById('adminSidebar');
  sidebar.classList.toggle('open');
}

function openAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

// Close modals when clicking on overlay
document.addEventListener('DOMContentLoaded', () => {
  const overlays = document.querySelectorAll('.admin-modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('open');
      }
    });
  });
});

// Utility to generate random ID for new items
function generateId(prefix) {
  return prefix + '-' + Math.floor(Math.random() * 10000);
}
