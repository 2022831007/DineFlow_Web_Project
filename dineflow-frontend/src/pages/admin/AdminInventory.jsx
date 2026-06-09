import React, { useState } from 'react';
import { addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../../api/api';

const AdminInventory = ({ inventory, refreshData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  // Form states
  const [iId, setIId] = useState('');
  const [iName, setIName] = useState('');
  const [iCat, setICat] = useState('');
  const [iQty, setIQty] = useState('');
  const [iUnit, setIUnit] = useState('kg');

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setIId('');
      setIName('');
      setICat('');
      setIQty('');
      setIUnit('kg');
    } else if (mode === 'edit' && item) {
      setIId(item.id);
      setIName(item.name);
      setICat(item.cat);
      setIQty(item.qty);
      setIUnit(item.unit);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveInventory = async (e) => {
    e.preventDefault();
    const qtyNum = parseInt(iQty, 10);

    try {
      const dataPayload = {
        name: iName,
        cat: iCat,
        qty: qtyNum,
        unit: iUnit
      };

      if (iId) {
        // Edit mode
        await updateInventoryItem(iId, dataPayload);
        alert('Inventory item updated successfully!');
      } else {
        // Add mode
        await addInventoryItem(dataPayload);
        alert('Inventory item added successfully!');
      }
      await refreshData();
      closeModal();
    } catch (err) {
      alert('Failed to save inventory item: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteInventory = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteInventoryItem(id);
        alert('Inventory item deleted successfully!');
        await refreshData();
      } catch (err) {
        alert('Failed to delete inventory item: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Filtered inventory logic
  const filteredInventory = inventory.filter(item => {
    const matchQ = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStock = stockFilter === 'all' || (stockFilter === 'low' && item.qty < 10);
    return matchQ && matchStock;
  });

  return (
    <div className="page-anim">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Inventory Items</div>
          <div className="admin-actions">
            <input
              type="text"
              className="admin-search"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="admin-search"
              style={{ width: '150px' }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock Only</option>
            </select>
            <button className="admin-btn" onClick={() => openModal('add')}>➕ Add Item</button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Stock Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const isLow = item.qty < 10;
                const status = isLow ? 'Low Stock' : 'In Stock';
                const badgeClass = isLow ? 'danger' : 'success';
                const qtyStyle = isLow ? { color: 'var(--pink)', fontWeight: 900 } : {};

                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.cat}</td>
                    <td style={qtyStyle}>{item.qty} {item.unit}</td>
                    <td><span className={`status-badge ${badgeClass}`}>{status}</span></td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.updated}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit" onClick={() => openModal('edit', item)} title="Edit/Restock">✏️</button>
                        <button className="icon-btn delete" onClick={() => deleteInventory(item.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay open" onClick={(e) => e.target.classList.contains('admin-modal-overlay') && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{modalMode === 'add' ? 'Add Inventory Item' : 'Update Inventory'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={saveInventory}>
              <div className="admin-form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato Ketchup"
                  value={iName}
                  onChange={(e) => setIName(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sauces"
                  value={iCat}
                  onChange={(e) => setICat(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={iQty}
                    onChange={(e) => setIQty(e.target.value)}
                  />
                </div>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Unit *</label>
                  <select value={iUnit} onChange={(e) => setIUnit(e.target.value)} required>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="pcs">pcs</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="admin-btn">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
