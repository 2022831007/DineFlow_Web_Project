import React, { useState } from 'react';
import { updateReviewStatus, deleteReview as deleteReviewApi } from '../../api/api';

const AdminReviews = ({ reviews, refreshData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '0.0';
  const pendingCount = reviews.filter(r => r.status === 'Pending').length;

  const updateStatus = async (id, newStatus) => {
    try {
      await updateReviewStatus(id, newStatus);
      alert(`Review has been ${newStatus.toLowerCase()}!`);
      await refreshData();
    } catch (err) {
      alert('Failed to update review: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReviewApi(id);
        alert('Review deleted successfully!');
        await refreshData();
      } catch (err) {
        alert('Failed to delete review: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchQ =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.id && r.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;
    return matchQ && matchRating;
  });

  return (
    <div className="page-anim">
      {/* Review Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon yellow">⭐</div>
          <div className="stat-info">
            <h3>Average Rating</h3>
            <div className="stat-value">{avgRating} / 5.0</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💬</div>
          <div className="stat-info">
            <h3>Total Reviews</h3>
            <div className="stat-value">{totalReviews}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-info">
            <h3>Pending Approval</h3>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>
      </div>

      {/* Reviews List Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Customer Reviews</div>
          <div className="admin-actions">
            <input
              type="text"
              className="admin-search"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="admin-search"
              style={{ width: '150px' }}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review Text</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map(r => {
                let badgeClass = 'warning';
                if (r.status === 'Approved') badgeClass = 'success';
                if (r.status === 'Rejected') badgeClass = 'danger';

                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: r.color || '#F0E8FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {r.avatar || '👤'}
                        </div>
                        <strong>{r.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--yellow)' }}>{'⭐'.repeat(r.rating)}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.text}>
                      {r.text}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{r.date}</td>
                    <td><span className={`status-badge ${badgeClass}`}>{r.status || 'Pending'}</span></td>
                    <td>
                      <div className="action-btns">
                        {r.status === 'Pending' && (
                          <>
                            <button className="icon-btn edit" onClick={() => updateStatus(r.id, 'Approved')} title="Approve">✅</button>
                            <button className="icon-btn delete" onClick={() => updateStatus(r.id, 'Rejected')} title="Reject">❌</button>
                          </>
                        )}
                        <button className="icon-btn delete" onClick={() => deleteReview(r.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
