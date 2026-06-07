function getCatBg(cat) {
  const map = {
    burger:  'linear-gradient(135deg,#FFE8EF,#FFF0E8)',
    rice:    'linear-gradient(135deg,#FFFCE8,#E8FFF7)',
    pizza:   'linear-gradient(135deg,#FFF0E8,#FFE8EF)',
    dessert: 'linear-gradient(135deg,#F0E8FF,#FFE8EF)',
    drinks:  'linear-gradient(135deg,#E8FFF7,#E8F0FF)'
  };
  return map[cat] || '#f9f9f9';
}

function renderGrid(items, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!items.length) {
    el.innerHTML = '<p style="color:var(--muted);font-weight:700;grid-column:1/-1;padding:20px 0;">No items found 😅</p>';
    return;
  }

  el.innerHTML = items.map(f => `
    <div class="food-card">
      <div class="food-img" style="background:${getCatBg(f.cat)}; position:relative; height:180px; overflow:hidden; padding:0; display:block;">
        <span class="food-badge ${f.badgeClass}">${f.badge}</span>
        ${f.img
          ? `<img src="${f.img}" alt="${f.name}"
               style="width:100%;height:100%;object-fit:cover;display:block;"
               onerror="this.style.display='none';this.parentElement.querySelector('.emoji-fallback').style.display='flex';">
             <span class="emoji-fallback" style="display:none;font-size:5rem;position:absolute;top:0;left:0;width:100%;height:100%;align-items:center;justify-content:center;">${f.emoji}</span>`
          : `<span style="font-size:5rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">${f.emoji}</span>`
        }
      </div>
      <div class="food-body">
        <div class="food-name">${f.name}</div>
        <div class="stars">${'⭐'.repeat(Math.round(f.rating))} <span>${f.rating} (${f.reviews})</span></div>
        <div class="food-desc">${f.desc}</div>
        <div class="food-footer">
          <div class="food-price">৳${f.price}</div>
          <button class="add-btn" onclick="addToCart(${f.id},this)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderReviews() {
  const el = document.getElementById('reviewsList');
  if (!el) return;
  el.innerHTML = appState.reviews.map(r => `
    <div class="review-item">
      <div class="reviewer-avatar" style="background:${r.color}">${r.avatar}</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="reviewer-name">${r.name}</span>
          <span class="reviewer-date">${r.date}</span>
        </div>
        <div style="color:var(--yellow);font-size:.9rem;margin:2px 0;">
          ${'⭐'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
        </div>
        <div class="review-text">${r.text}</div>
      </div>
    </div>
  `).join('');
}

function renderOrderSummary() {
  const summaryEl = document.getElementById('orderSummary');
  if (!summaryEl) return;
  const subtotal = appState.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const vat      = Math.round(subtotal * 0.05);
  const grand    = subtotal + vat;
  summaryEl.innerHTML = appState.cart.map(c => `
    <div class="order-summary-item">
      <span>${c.emoji} ${c.name} × ${c.qty}</span>
      <span>৳${c.price * c.qty}</span>
    </div>
  `).join('');
  document.getElementById('summarySubtotal').textContent = `৳${subtotal}`;
  document.getElementById('summaryVat').textContent      = `৳${vat}`;
  document.getElementById('summaryGrand').textContent    = `৳${grand}`;
}
