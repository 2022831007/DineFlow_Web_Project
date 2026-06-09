import React, { useState, useEffect } from 'react';
import './admin.css';

// Import sub-components
import AdminDashboard from './AdminDashboard';
import AdminFood from './AdminFood';
import AdminInventory from './AdminInventory';
import AdminBilling from './AdminBilling';
import AdminReviews from './AdminReviews';
import AdminSales from './AdminSales';

// Import API functions
import {
  getAdminMenu,
  getInventory,
  getBills,
  getAdminReviews,
  getRecentOrders
} from '../../api/api';

const AdminPanel = ({ onBack }) => {
  const [subTab, setSubTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Shared React States
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [bills, setBills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [menuRes, invRes, billsRes, revRes, recentRes] = await Promise.all([
        getAdminMenu(),
        getInventory(),
        getBills(),
        getAdminReviews(),
        getRecentOrders()
      ]);

      if (menuRes.data.success) {
        const mappedMenu = menuRes.data.items.map(item => ({
          ...item,
          cat: item.category,
          img: item.img_url,
          badge: item.is_available ? (item.badge || '') : 'Out of Stock',
          badgeClass: item.is_available ? (item.badge_class || '') : 'danger'
        }));
        setMenu(mappedMenu);
      }
      
      if (invRes.data.success) {
        setInventory(invRes.data.data);
      }

      if (billsRes.data.success) {
        setBills(billsRes.data.bills);
      }

      if (revRes.data.success) {
        setReviews(revRes.data.reviews);
      }

      if (recentRes.data.success) {
        setRecentOrders(recentRes.data.orders);
      }
    } catch (err) {
      console.error("Error loading admin data from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectTab = (tab) => {
    setSubTab(tab);
    setIsSidebarOpen(false);
  };

  const renderActiveTab = () => {
    switch (subTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            menu={menu}
            inventory={inventory}
            bills={bills}
            reviews={reviews}
            recentOrders={recentOrders}
            setTab={setSubTab}
          />
        );
      case 'food':
        return <AdminFood menu={menu} refreshData={loadAllData} />;
      case 'inventory':
        return <AdminInventory inventory={inventory} refreshData={loadAllData} />;
      case 'billing':
        return <AdminBilling bills={bills} refreshData={loadAllData} />;
      case 'reviews':
        return <AdminReviews reviews={reviews} refreshData={loadAllData} />;
      case 'sales':
        return <AdminSales menu={menu} bills={bills} />;
      default:
        return <div className="page-anim">Admin Sub-page not found.</div>;
    }
  };

  const getPageTitle = () => {
    switch (subTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'food':
        return 'Food Menu Management';
      case 'inventory':
        return 'Inventory Management';
      case 'billing':
        return 'Billing & Invoices';
      case 'reviews':
        return 'Customer Reviews';
      case 'sales':
        return 'Sales Report Analytics';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="admin-body">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} id="adminSidebar">
        <div className="admin-brand" onClick={() => selectTab('dashboard')}>
          DineFlow Admin
        </div>
        <div className="admin-menu">
          <button className={subTab === 'dashboard' ? 'active' : ''} onClick={() => selectTab('dashboard')}>
            <span className="admin-menu-icon">📊</span> Dashboard
          </button>
          <button className={subTab === 'food' ? 'active' : ''} onClick={() => selectTab('food')}>
            <span className="admin-menu-icon">🍔</span> Food Menu
          </button>
          <button className={subTab === 'inventory' ? 'active' : ''} onClick={() => selectTab('inventory')}>
            <span className="admin-menu-icon">📦</span> Inventory
          </button>
          <button className={subTab === 'billing' ? 'active' : ''} onClick={() => selectTab('billing')}>
            <span className="admin-menu-icon">🧾</span> Billing
          </button>
          <button className={subTab === 'reviews' ? 'active' : ''} onClick={() => selectTab('reviews')}>
            <span className="admin-menu-icon">⭐</span> Reviews
          </button>
          <button className={subTab === 'sales' ? 'active' : ''} onClick={() => selectTab('sales')}>
            <span className="admin-menu-icon">📈</span> Sales Report
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Navbar */}
        <header className="admin-navbar no-print">
          <div className="admin-nav-left">
            <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
            <div className="admin-nav-title">{getPageTitle()}</div>
          </div>
          <div className="admin-nav-right">
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: '#f0f0f0',
                  color: 'var(--dark)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginRight: '16px'
                }}
              >
                ⬅ Back to Main
              </button>
            )}
            <div className="admin-profile">
              <span>Admin User</span>
              <div className="admin-avatar">A</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              color: 'var(--muted)',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              <span style={{ fontSize: '3rem', marginBottom: '12px', animation: 'spin 2s linear infinite' }}>⏳</span>
              <span>Loading Admin Console...</span>
            </div>
          ) : (
            renderActiveTab()
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
