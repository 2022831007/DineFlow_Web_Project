function placeOrder() {
  const name  = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const area  = document.getElementById('co-area').value.trim();
  const addr  = document.getElementById('co-address').value.trim();

  if (!name || !phone || !addr) {
    showToast('⚠️ Please fill in all delivery details!');
    return;
  }

  const orderId = 'DF-' + Math.floor(1000 + Math.random() * 9000);
  appState.lastOrderId = orderId;
  appState.deliveryInfo = { name, phone, area, address: addr };

  document.getElementById('trackOrderId').textContent = `Order #${orderId}`;
  const now = new Date();
  document.getElementById('t1time').textContent =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  appState.cart = [];
  updateCartUI();

  showToast(`🎉 Order placed! #${orderId}`);
  showPage('tracking');
}
