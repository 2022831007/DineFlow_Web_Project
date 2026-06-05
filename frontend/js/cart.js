function addToCart(id) {
  const item = MENU.find(m => m.id === id);
  const existing = appState.cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    appState.cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`✅ ${item.name} added to cart!`);

  event.target.style.transform = 'scale(1.35)';
  setTimeout(() => { event.target.style.transform = ''; }, 200);
}

function changeQty(id, delta) {
  const idx = appState.cart.findIndex(c => c.id === id);
  if (idx === -1) return;

  appState.cart[idx].qty += delta;
  if (appState.cart[idx].qty <= 0) {
    appState.cart.splice(idx, 1);
  }
  updateCartUI();
}

function updateCartUI() {
  const total = appState.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = appState.cart.reduce((s, i) => s + i.qty, 0);

  document.getElementById('cartCount').textContent = count;

  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (!appState.cart.length) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <div class="emoji">🛒</div>
        <p>Your cart is empty!<br/>Add some delicious items</p>
      </div>`;
    footerEl.style.display = 'none';
    return;
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
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = `৳${total}`;
  footerEl.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function goCheckout() {
  toggleCart();
  renderOrderSummary();
  showPage('checkout');
}
