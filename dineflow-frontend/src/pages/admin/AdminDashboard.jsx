import React from 'react';

const AdminDashboard = ({ menu, inventory, bills, reviews, recentOrders, setTab }) => {
  const totalFoods = menu.length;
  const totalOrders = bills.length;
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
  const lowStockCount = inventory.filter(i => i.qty < 10).length;
  const totalReviews = reviews.length;

  return (
    <div className="page-anim">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange">🍔</div>
          <div className="stat-info">
            <h3>Total Foods</h3>
            <div className="stat-value">{totalFoods}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🧾</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <div className="stat-value">{totalOrders}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <div className="stat-value">৳{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⭐</div>
          <div className="stat-info">
            <h3>Reviews</h3>
            <div className="stat-value">{totalReviews}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">⚠️</div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <div className="stat-value">{lowStockCount}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Recent Orders</div>
            <button className="admin-btn secondary" onClick={() => setTab('billing')}>View All</button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => {
                  let badge = 'info';
                  if (o.status === 'Delivered') badge = 'success';
                  if (o.status === 'Pending') badge = 'warning';
                  if (o.status === 'Preparing') badge = 'info';
                  return (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>৳{o.total}</td>
                      <td><span className={`status-badge ${badge}`}>{o.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Low Stock Alerts ⚠️</div>
            <button className="admin-btn secondary" onClick={() => setTab('inventory')}>Manage Stock</button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty Left</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.filter(i => i.qty < 10).map(i => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td style={{ color: 'var(--pink)', fontWeight: 800 }}>{i.qty} {i.unit}</td>
                    <td>
                      <button className="admin-btn secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setTab('inventory')}>
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
                {inventory.filter(i => i.qty < 10).length === 0 && (
                  <tr>
                    <td colSpan="3">No low stock items!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Recent Reviews</div>
          <button className="admin-btn secondary" onClick={() => setTab('reviews')}>Manage Reviews</button>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {reviews.slice(0, 3).map((r, idx) => (
                <tr key={r.id || idx}>
                  <td>
                    <strong>{r.name}</strong>
                    <br />
                    <small style={{ color: 'var(--muted)' }}>{r.date}</small>
                  </td>
                  <td style={{ color: 'var(--yellow)' }}>{'⭐'.repeat(r.rating)}</td>
                  <td>{r.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
