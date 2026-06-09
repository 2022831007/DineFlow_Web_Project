import React, { useState } from 'react';
import { createBill, payBill } from '../../api/api';

const AdminBilling = ({ bills, refreshData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Form states
  const [bOrderNo, setBOrderNo] = useState('');
  const [bCustomer, setBCustomer] = useState('');
  const [bAmount, setBAmount] = useState('');
  const [bMethod, setBMethod] = useState('Cash');
  const [bStatus, setBStatus] = useState('Paid');

  // Summary Metrics
  const totalRevenue = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidCount = bills.filter(b => b.status === 'Paid').length;
  const pendingCount = bills.filter(b => b.status === 'Pending').length;

  const openGenerateModal = () => {
    setBOrderNo('');
    setBCustomer('');
    setBAmount('');
    setBMethod('Cash');
    setBStatus('Paid');
    setIsGenerateModalOpen(true);
  };

  const closeGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const generateBill = async (e) => {
    e.preventDefault();
    const amountNum = parseInt(bAmount, 10);

    try {
      await createBill({
        orderNo: bOrderNo,
        customer: bCustomer,
        amount: amountNum,
        method: bMethod,
        status: bStatus
      });
      alert('Bill generated successfully!');
      await refreshData();
      closeGenerateModal();
    } catch (err) {
      alert('Failed to generate bill: ' + (err.response?.data?.message || err.message));
    }
  };

  const markAsPaid = async (id) => {
    if (window.confirm('Mark this bill as Paid?')) {
      try {
        await payBill(id);
        alert('Bill marked as Paid successfully!');
        await refreshData();
      } catch (err) {
        alert('Failed to update payment: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const viewBill = (bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const printBill = () => {
    window.print();
  };

  const filteredBills = bills.filter(b => {
    const matchQ =
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.orderNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchQ && matchStatus;
  });

  return (
    <div className="page-anim">
      {/* Billing Summary Stats */}
      <div className="stats-grid no-print">
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <h3>Total Revenue (All time)</h3>
            <div className="stat-value">৳{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">✅</div>
          <div className="stat-info">
            <h3>Paid Bills</h3>
            <div className="stat-value">{paidCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-info">
            <h3>Pending Bills</h3>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>
      </div>

      {/* Main Billing Table */}
      <div className="admin-card no-print">
        <div className="admin-card-header">
          <div className="admin-card-title">Bills & Invoices</div>
          <div className="admin-actions">
            <input
              type="text"
              className="admin-search"
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="admin-search"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <button className="admin-btn" onClick={openGenerateModal}>🧾 Generate Bill</button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Order No</th>
                <th>Customer Name</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(b => {
                const badgeClass = b.status === 'Paid' ? 'success' : 'warning';
                return (
                  <tr key={b.id}>
                    <td><strong>{b.id}</strong></td>
                    <td>{b.orderNo}</td>
                    <td>{b.customer}</td>
                    <td>{b.method}</td>
                    <td style={{ color: 'var(--muted)' }}>{b.date}</td>
                    <td style={{ fontWeight: 800, color: 'var(--dark)' }}>৳{b.amount}</td>
                    <td><span className={`status-badge ${badgeClass}`}>{b.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn view" onClick={() => viewBill(b)} title="View/Print Bill">👁️</button>
                        {b.status === 'Pending' && (
                          <button className="icon-btn edit" onClick={() => markAsPaid(b.id)} title="Mark as Paid">💰</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      {isGenerateModalOpen && (
        <div className="admin-modal-overlay open" onClick={(e) => e.target.classList.contains('admin-modal-overlay') && closeGenerateModal()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Generate Bill</h2>
              <button className="admin-modal-close" onClick={closeGenerateModal}>✕</button>
            </div>
            <form onSubmit={generateBill}>
              <div className="admin-form-group">
                <label>Order Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ORD-600"
                  value={bOrderNo}
                  onChange={(e) => setBOrderNo(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Customer Name"
                  value={bCustomer}
                  onChange={(e) => setBCustomer(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Total Amount (৳) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0"
                  value={bAmount}
                  onChange={(e) => setBAmount(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Payment Method *</label>
                <select value={bMethod} onChange={(e) => setBMethod(e.target.value)} required>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="bKash">bKash</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Status *</label>
                <select value={bStatus} onChange={(e) => setBStatus(e.target.value)} required>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={closeGenerateModal}>Cancel</button>
                <button type="submit" className="admin-btn">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Bill Print Overlay (Used for printing window) */}
      {isViewModalOpen && selectedBill && (
        <div className="admin-modal-overlay open" onClick={(e) => e.target.classList.contains('admin-modal-overlay') && closeViewModal()}>
          <div className="admin-modal" id="printableBillArea">
            <div className="admin-modal-header" style={{ borderBottom: '2px dashed #ddd', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: "'Pacifico', cursive", color: 'var(--pink)' }}>DineFlow</h2>
                <small style={{ color: 'var(--muted)' }}>Invoice / Receipt</small>
              </div>
              <button className="admin-modal-close no-print" onClick={closeViewModal}>✕</button>
            </div>
            <div id="billDetailsContent" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p><strong>Bill To:</strong> {selectedBill.customer}</p>
                  <p><strong>Date:</strong> {selectedBill.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Bill No:</strong> {selectedBill.id}</p>
                  <p><strong>Order No:</strong> {selectedBill.orderNo}</p>
                  <p><strong>Status:</strong> <span style={{ color: selectedBill.status === 'Paid' ? 'green' : 'orange' }}>{selectedBill.status}</span></p>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '8px 0' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px 0' }}>Order Items ({selectedBill.orderNo})</td>
                    <td style={{ textAlign: 'right', padding: '12px 0' }}>৳{selectedBill.amount}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: 'right', fontSize: '1.2rem', marginTop: '20px' }}>
                <strong>Total: ৳{selectedBill.amount}</strong>
              </div>
              <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                <p>Thank you for dining with DineFlow!</p>
                <p>Payment Method: {selectedBill.method}</p>
              </div>
            </div>
            <div className="admin-modal-footer no-print" style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
              <button className="admin-btn secondary" onClick={closeViewModal}>Close</button>
              <button className="admin-btn" onClick={printBill}>🖨️ Print Bill</button>
            </div>
          </div>
        </div>
      )}

      {/* Printing Styles scoped locally */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printableBillArea, #printableBillArea * { visibility: visible; }
          #printableBillArea { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; transform: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminBilling;
