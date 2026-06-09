import React, { useState } from 'react';
import { addMenuItem, updateMenuItem, deleteMenuItem } from '../../api/api';

const AdminFood = ({ menu, refreshData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  // Form states
  const [fId, setFId] = useState('');
  const [fName, setFName] = useState('');
  const [fCat, setFCat] = useState('burger');
  const [fPrice, setFPrice] = useState('');
  const [fImg, setFImg] = useState('');
  const [fStatus, setFStatus] = useState('Available');

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setFId('');
      setFName('');
      setFCat('burger');
      setFPrice('');
      setFImg('');
      setFStatus('Available');
    } else if (mode === 'edit' && item) {
      setFId(item.id);
      setFName(item.name);
      setFCat(item.cat);
      setFPrice(item.price);
      setFImg(item.img);
      setFStatus(item.badge === 'Out of Stock' ? 'Out of Stock' : 'Available');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveFood = async (e) => {
    e.preventDefault();
    const priceNum = parseInt(fPrice, 10);
    if (priceNum <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    try {
      const dataPayload = {
        name: fName,
        description: 'Managed by Admin Panel',
        price: priceNum,
        category: fCat,
        emoji: '🍽️',
        badge: fStatus === 'Out of Stock' ? 'Out of Stock' : '',
        badge_class: fStatus === 'Out of Stock' ? 'danger' : '',
        is_available: fStatus === 'Available' ? 1 : 0
      };

      if (fId) {
        // Edit mode
        await updateMenuItem(fId, dataPayload);
        alert('Food item updated successfully!');
      } else {
        // Add mode
        await addMenuItem(dataPayload);
        alert('Food item added successfully!');
      }
      await refreshData();
      closeModal();
    } catch (err) {
      alert('Failed to save food item: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await deleteMenuItem(id);
        alert('Food item deleted successfully!');
        await refreshData();
      } catch (err) {
        alert('Failed to delete food item: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Filtered menu logic
  const filteredMenu = menu.filter(item => {
    const matchQ = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toString().includes(searchQuery);
    const matchCat = categoryFilter === 'all' || item.cat === categoryFilter;
    return matchQ && matchCat;
  });

  return (
    <div className="page-anim">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Food Menu List</div>
          <div className="admin-actions">
            <input
              type="text"
              className="admin-search"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="admin-search"
              style={{ width: '150px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="burger">Burgers</option>
              <option value="rice">Rice & Biryani</option>
              <option value="pizza">Pizza</option>
              <option value="dessert">Dessert</option>
              <option value="drinks">Drinks</option>
            </select>
            <button className="admin-btn" onClick={() => openModal('add')}>➕ Add Food</button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Food Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenu.map(item => {
                const status = item.badge === 'Out of Stock' ? 'Out of Stock' : 'Available';
                const badgeClass = status === 'Available' ? 'success' : 'danger';
                return (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      {item.img && (item.img.startsWith('data:') || item.img.startsWith('http')) ? (
                        <img src={item.img} className="table-img" alt={item.name} />
                      ) : (
                        <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
                      )}
                    </td>
                    <td><strong>{item.name}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{item.cat}</td>
                    <td>৳{item.price}</td>
                    <td><span className={`status-badge ${badgeClass}`}>{status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit" onClick={() => openModal('edit', item)} title="Edit">✏️</button>
                        <button className="icon-btn delete" onClick={() => deleteFood(item.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="admin-modal-overlay open" onClick={(e) => e.target.classList.contains('admin-modal-overlay') && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{modalMode === 'add' ? 'Add New Food' : 'Edit Food'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={saveFood}>
              <div className="admin-form-group">
                <label>Food Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Burger"
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Category *</label>
                <select value={fCat} onChange={(e) => setFCat(e.target.value)} required>
                  <option value="burger">Burger</option>
                  <option value="rice">Rice & Biryani</option>
                  <option value="pizza">Pizza</option>
                  <option value="dessert">Dessert</option>
                  <option value="drinks">Drinks</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Price (৳) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 250"
                  value={fPrice}
                  onChange={(e) => setFPrice(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/image.jpg"
                  value={fImg}
                  onChange={(e) => setFImg(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Status *</label>
                <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} required>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="admin-btn">Save Food</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFood;
