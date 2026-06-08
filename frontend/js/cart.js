let appliedPromo = JSON.parse(localStorage.getItem('dineflow_promo') || 'null');

const PROMO_CODES = {
  'WELCOME10': { type: 'percent', value: 10, label: '10% off' },
  'FLAT50':    { type: 'flat',    value: 50, label: '৳50 off' },
  'DINE20':    { type: 'percent', value: 20, label: '20% off' },
};

async function addToCart(id, btnEl) {
  const item = MENU.find(m => m.id === id);
  const existing = appState.cart.find(c => c.id === id);
  if (existing) { existing.qty++; }
  else { appState.cart.push({ ...item, qty: 1 }); }
  saveCart();
  updateCartUI();
  showToast(`✅ ${item.name} added to cart!`);
  if (btnEl) {
    btnEl.style.transform = 'scale(1.35)';
    setTimeout(() => { btnEl.style.transform = ''; }, 200);
  }
  const token = getToken();
  if (token) {
    try {
      await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ food_item_id: id, quantity: 1 })
      });
    } catch (err) { console.log('Cart sync failed:', err); }
  }
}

function changeQty(id, delta) {
  const idx = appState.cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  appState.cart[idx].qty += delta;
  if (appState.cart[idx].qty <= 0) appState.cart.splice(idx, 1);
  if (appState.cart.length === 0) {
    appliedPromo = null;
    localStorage.removeItem('dineflow_promo');
  }
  saveCart();
  updateCartUI();
}

function applyPromo() {
  const input = document.getElementById('promoInput');
  const code  = input.value.trim().toUpperCase();
  const msgEl = document.getElementById('promoMsg');
  if (!code) { msgEl.textContent = '⚠️ Please enter a code.'; msgEl.style.color = '#e74c3c'; return; }
  const promo = PROMO_CODES[code];
  if (!promo) { msgEl.textContent = '❌ Invalid promo code.'; msgEl.style.color = '#e74c3c'; return; }
  appliedPromo = { code, ...promo };
  localStorage.setItem('dineflow_promo', JSON.stringify(appliedPromo));
  msgEl.textContent = '✅ ' + promo.label + ' applied!';
  msgEl.style.color = '#27ae60';
  updateCartUI();
}

function updateCartUI() {
  const count = appState.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!appState.cart.length) {
    itemsEl.innerHTML = `<div class="empty-cart"><div class="emoji">🛒</div><p>Your cart is empty!<br/>Add some delicious items</p></div>`;
    footerEl.style.display = 'none'; return;
  }
  itemsEl.innerHTML = appState.cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-emoji">${c.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">৳${c.price} × ${c.qty} = ৳${c.price * c.qty}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
      </div>
    </div>`).join('');
  const subtotal = appState.cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percent'
      ? Math.round(subtotal * appliedPromo.value / 100)
      : Math.min(appliedPromo.value, subtotal);
  }
  const total = subtotal - discount;
  document.getElementById('cartSubtotal').textContent = '৳' + subtotal;
  const discountRow = document.getElementById('cartDiscountRow');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('cartDiscount').textContent = '−৳' + discount;
    document.getElementById('cartPromoLabel').textContent = appliedPromo.code;
  } else { discountRow.style.display = 'none'; }
  document.getElementById('cartTotal').textContent = '৳' + total;
  footerEl.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function goCheckout() {
  if (!appState.cart.length) { showToast('⚠️ Your cart is empty!'); return; }
  toggleCart();
  window.location.href = 'cart.html';
}