/* Cashier Dashboard Mock Data & Logic */

// Mock LIVE orders for Cashier
let CASHIER_ORDERS = [
  { id: 'ORD-601', customer: 'Hasan Ali', itemsCount: 4, total: 1050, status: 'Pending', payment: 'Unpaid', time: '14:20' },
  { id: 'ORD-602', customer: 'Sumaiya', itemsCount: 2, total: 420, status: 'Preparing', payment: 'Paid', time: '14:15' },
  { id: 'ORD-603', customer: 'Rakib', itemsCount: 6, total: 2100, status: 'Ready', payment: 'Unpaid', time: '14:05' },
  { id: 'ORD-604', customer: 'Sadia', itemsCount: 1, total: 180, status: 'Completed', payment: 'Paid', time: '13:50' },
  { id: 'ORD-605', customer: 'Arif', itemsCount: 3, total: 750, status: 'Pending', payment: 'Unpaid', time: '14:35' },
];

// Mock Stats
let CASHIER_STATS = {
  todayOrders: 42,
  pendingOrders: 3,
  completedOrders: 38,
  revenue: 25400,
  billsGenerated: 40,
  payments: {
    cash: 15400,
    card: 8000,
    mobile: 2000
  }
};

// State for current billing session
let currentBillItems = [];
const VAT_RATE = 0.05; // 5% VAT

function renderCashierStats() {
  document.getElementById('stat-today-orders').textContent = CASHIER_STATS.todayOrders;
  document.getElementById('stat-pending').textContent = CASHIER_ORDERS.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  document.getElementById('stat-completed').textContent = CASHIER_STATS.completedOrders;
  document.getElementById('stat-revenue').textContent = `৳${CASHIER_STATS.revenue.toLocaleString()}`;
  document.getElementById('stat-bills').textContent = CASHIER_STATS.billsGenerated;

  document.getElementById('widget-total-sales').textContent = `৳${CASHIER_STATS.revenue.toLocaleString()}`;
  document.getElementById('widget-cash').textContent = `৳${CASHIER_STATS.payments.cash.toLocaleString()}`;
  document.getElementById('widget-card').textContent = `৳${CASHIER_STATS.payments.card.toLocaleString()}`;
  document.getElementById('widget-mobile').textContent = `৳${CASHIER_STATS.payments.mobile.toLocaleString()}`;
}

function renderOrdersTable() {
  const q = document.getElementById('orderSearch').value.toLowerCase();
  const cName = document.getElementById('customerSearch').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const payFilter = document.getElementById('payFilter').value;

  const filtered = CASHIER_ORDERS.filter(o => {
    return (o.id.toLowerCase().includes(q)) &&
           (o.customer.toLowerCase().includes(cName)) &&
           (statusFilter === 'all' || o.status === statusFilter) &&
           (payFilter === 'all' || o.payment === payFilter);
  });

  const tbody = document.getElementById('cashierOrdersTable');
  tbody.innerHTML = filtered.map(o => {
    let statBadge = 'warning';
    if(o.status === 'Completed') statBadge = 'success';
    if(o.status === 'Ready') statBadge = 'info';
    if(o.status === 'Cancelled') statBadge = 'danger';

    let payBadge = o.payment === 'Paid' ? 'success' : 'danger';

    return `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${o.itemsCount}</td>
        <td>৳${o.total}</td>
        <td><span class="status-badge ${statBadge}">${o.status}</span></td>
        <td><span class="status-badge ${payBadge}">${o.payment}</span></td>
        <td>${o.time}</td>
        <td>
          <div class="action-btns">
            ${o.status === 'Pending' ? `<button class="icon-btn edit" onclick="updateOrderStatus('${o.id}', 'Preparing')" title="Start Preparing">🍳</button>` : ''}
            ${o.status === 'Preparing' ? `<button class="icon-btn info" style="background:#E8F0FF; color:#2B5EFF;" onclick="updateOrderStatus('${o.id}', 'Ready')" title="Mark Ready">🔔</button>` : ''}
            ${o.status === 'Ready' && o.payment === 'Paid' ? `<button class="icon-btn success" style="background:#E8FFF7; color:var(--green);" onclick="updateOrderStatus('${o.id}', 'Completed')" title="Complete Order">✅</button>` : ''}
            ${o.payment === 'Unpaid' ? `<button class="icon-btn view" onclick="loadOrderToBilling('${o.id}')" title="Process Payment">💳</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Re-calculate stats based on current orders arrays
  renderCashierStats();
}

function updateOrderStatus(id, newStatus) {
  const idx = CASHIER_ORDERS.findIndex(o => o.id === id);
  if (idx > -1) {
    CASHIER_ORDERS[idx].status = newStatus;
    if(newStatus === 'Completed') CASHIER_STATS.completedOrders++;
    renderOrdersTable();
  }
}

function loadOrderToBilling(id) {
  const order = CASHIER_ORDERS.find(o => o.id === id);
  if(!order) return;
  
  document.getElementById('b-customer-name').value = order.customer;
  document.getElementById('b-phone').value = '017XXXXX'; // Mock
  document.getElementById('b-table').value = Math.floor(Math.random() * 10) + 1;
  
  // Mock items
  currentBillItems = [
    { name: 'Mock Item 1', qty: 1, price: Math.floor(order.total * 0.6) },
    { name: 'Mock Item 2', qty: order.itemsCount - 1 || 1, price: Math.floor(order.total * 0.4) }
  ];
  
  document.getElementById('payment-order-id').value = order.id; // Hidden field to track order
  
  updateBillingUI();
}

function addMockItemToBill() {
  currentBillItems.push({ name: 'Extra Item ' + (currentBillItems.length+1), qty: 1, price: 100 });
  updateBillingUI();
}

function updateBillingUI() {
  const tbody = document.getElementById('billItemsTable');
  
  if (currentBillItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--muted);">No items added.</td></tr>`;
    document.getElementById('bill-subtotal').textContent = '0';
    document.getElementById('bill-vat').textContent = '0';
    document.getElementById('bill-total').textContent = '0';
    document.getElementById('pay-total-bill').value = '0';
    return;
  }

  let subtotal = 0;
  tbody.innerHTML = currentBillItems.map((item, index) => {
    const itemTotal = item.qty * item.price;
    subtotal += itemTotal;
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>৳${item.price}</td>
        <td>৳${itemTotal}</td>
      </tr>
    `;
  }).join('');

  const vat = subtotal * VAT_RATE;
  const discount = parseFloat(document.getElementById('b-discount').value) || 0;
  const grandTotal = Math.round(subtotal + vat - discount);

  document.getElementById('bill-subtotal').textContent = subtotal.toLocaleString();
  document.getElementById('bill-vat').textContent = vat.toLocaleString();
  document.getElementById('bill-total').textContent = grandTotal.toLocaleString();
  
  // Update Payment Section
  document.getElementById('pay-total-bill').value = grandTotal;
  calculateChange();
}

function calculateChange() {
  const total = parseFloat(document.getElementById('pay-total-bill').value) || 0;
  const received = parseFloat(document.getElementById('pay-received').value) || 0;
  const changeInput = document.getElementById('pay-change');
  const payStatus = document.getElementById('payment-status-ind');
  
  const change = received - total;
  changeInput.value = change;

  if (received === 0) {
    payStatus.innerHTML = '<span class="status-badge warning">Waiting for payment</span>';
  } else if (change >= 0) {
    payStatus.innerHTML = '<span class="status-badge success">Payment Sufficient</span>';
  } else {
    payStatus.innerHTML = `<span class="status-badge danger">Need ৳${Math.abs(change)} more</span>`;
  }
}

function processPayment() {
  const total = parseFloat(document.getElementById('pay-total-bill').value) || 0;
  const received = parseFloat(document.getElementById('pay-received').value) || 0;
  const method = document.getElementById('pay-method').value;
  
  if(total === 0) {
    alert("Bill is empty!");
    return;
  }
  if(received < total) {
    alert("Insufficient amount received!");
    return;
  }

  // Update Stats
  CASHIER_STATS.revenue += total;
  CASHIER_STATS.billsGenerated++;
  if(method === 'Cash') CASHIER_STATS.payments.cash += total;
  if(method === 'Card') CASHIER_STATS.payments.card += total;
  if(method === 'Mobile') CASHIER_STATS.payments.mobile += total;

  // Update Order Status if linked
  const orderId = document.getElementById('payment-order-id').value;
  if (orderId) {
    const idx = CASHIER_ORDERS.findIndex(o => o.id === orderId);
    if(idx > -1) {
      CASHIER_ORDERS[idx].payment = 'Paid';
    }
  }

  renderOrdersTable();
  alert("Payment Processed Successfully!");
  
  // Generate Receipt
  showReceiptModal(orderId || 'NEW-BILL', method, received);
  clearBillingForm();
}

function clearBillingForm() {
  document.getElementById('b-customer-name').value = '';
  document.getElementById('b-phone').value = '';
  document.getElementById('b-table').value = '';
  document.getElementById('b-discount').value = '';
  document.getElementById('payment-order-id').value = '';
  document.getElementById('pay-received').value = '';
  currentBillItems = [];
  updateBillingUI();
}

function showReceiptModal(billNo, method, received) {
  const total = parseFloat(document.getElementById('pay-total-bill').value) || 0;
  const customer = document.getElementById('b-customer-name').value || 'Walk-in Customer';
  
  const receiptHTML = `
    <div style="text-align: center; border-bottom: 2px dashed #ddd; padding-bottom: 15px; margin-bottom: 15px;">
      <h2 style="font-family: 'Pacifico', cursive; color: var(--pink); margin: 0;">DineFlow</h2>
      <p style="margin: 5px 0 0 0; color: var(--muted); font-size: 0.9rem;">Dhanmondi Branch, Dhaka</p>
      <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Tel: +880 1XXX XXXXXX</p>
    </div>
    
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 15px;">
      <div>
        <p style="margin: 3px 0;"><strong>Bill No:</strong> ${billNo}</p>
        <p style="margin: 3px 0;"><strong>Customer:</strong> ${customer}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 3px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="margin: 3px 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 0.9rem;">
      <tr style="border-bottom: 1px solid #ddd;">
        <th style="text-align: left; padding: 5px 0;">Item</th>
        <th style="text-align: center; padding: 5px 0;">Qty</th>
        <th style="text-align: right; padding: 5px 0;">Amount</th>
      </tr>
      ${currentBillItems.map(i => `
        <tr>
          <td style="padding: 5px 0;">${i.name}</td>
          <td style="text-align: center; padding: 5px 0;">${i.qty}</td>
          <td style="text-align: right; padding: 5px 0;">৳${i.qty * i.price}</td>
        </tr>
      `).join('')}
    </table>

    <div style="text-align: right; font-size: 0.9rem; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px dashed #ddd;">
      <p style="margin: 3px 0;">Subtotal: ৳${document.getElementById('bill-subtotal').textContent}</p>
      <p style="margin: 3px 0;">VAT (5%): ৳${document.getElementById('bill-vat').textContent}</p>
      <p style="margin: 3px 0;">Discount: -৳${document.getElementById('b-discount').value || 0}</p>
      <h3 style="margin: 10px 0 0 0; font-size: 1.2rem;">Grand Total: ৳${total}</h3>
    </div>

    <div style="font-size: 0.9rem;">
      <p style="margin: 3px 0;"><strong>Payment Method:</strong> ${method}</p>
      <p style="margin: 3px 0;"><strong>Amount Received:</strong> ৳${received}</p>
      <p style="margin: 3px 0;"><strong>Change Returned:</strong> ৳${received - total}</p>
    </div>
    
    <div style="text-align: center; margin-top: 25px; color: var(--muted); font-size: 0.85rem;">
      <p>Thank you! Please visit again.</p>
    </div>
  `;

  document.getElementById('receiptContent').innerHTML = receiptHTML;
  openAdminModal('receiptModal');
}

function printReceipt() {
  window.print();
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  renderOrdersTable();
  updateBillingUI();
});
