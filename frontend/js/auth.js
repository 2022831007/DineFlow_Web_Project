function initAuth() {
  const saved = localStorage.getItem('dineflow_user');
  if (saved) {
    const user = JSON.parse(saved);
    appState.currentUser = user;
    const btn = document.getElementById('authNavBtn');
    if (btn) {
      btn.textContent = '👤 ' + user.name.split(' ')[0];
      btn.onclick = doLogout;

      
    }
  }
}

function doLogout() {
  localStorage.removeItem('dineflow_user');
  localStorage.removeItem('dineflow_token');
  appState.currentUser = null;
  const btn = document.getElementById('authNavBtn');
  if (btn) {
    btn.textContent = 'Sign In';
    btn.onclick = () => openModal('login');
  }
  showToast('👋 Logged out successfully!');
}

function openModal(type) {
  closeModal('login');
  closeModal('signup');
  const modal = document.getElementById(type + 'Modal');
  if (modal) modal.classList.add('open');
}

function closeModal(type) {
  const modal = document.getElementById(type + 'Modal');
  if (modal) modal.classList.remove('open');
}


  async function doLogin() {
  const email = document.getElementById('li-email').value.trim();
  const pw    = document.getElementById('li-pw').value;

  if (!email || !pw) { showToast('⚠️ Please fill in all fields'); return; }

  try {
    const res  = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('dineflow_token', data.token);
      localStorage.setItem('dineflow_user', JSON.stringify(data.customer));
      appState.currentUser = data.customer;
      const btn = document.getElementById('authNavBtn');
      if (btn) { btn.textContent = '👤 ' + data.customer.name.split(' ')[0]; btn.onclick = doLogout; }
      closeModal('login');
      showToast(`👋 Welcome back, ${data.customer.name}!`);
    } else {
      showToast('⚠️ ' + data.message);
    }
  } catch (err) {
    showToast('⚠️ Server connection failed!');
  }
}

 async function doSignup() {
  const fname = document.getElementById('su-fname').value.trim();
  const lname = document.getElementById('su-lname').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const phone = document.getElementById('su-phone').value.trim();
  const area  = document.getElementById('su-area').value.trim();
  const addr  = document.getElementById('su-addr').value.trim();
  const pw    = document.getElementById('su-pw').value;

  if (!fname || !email || !phone || !addr || !pw) {
    showToast('⚠️ Please fill in all required fields');
    return;
  }

  try {
    const res  = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: fname, last_name: lname,
        email, phone, password: pw,
        area, full_address: addr
      })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('dineflow_token', data.token);
      localStorage.setItem('dineflow_user', JSON.stringify(data.customer));
      appState.currentUser = data.customer;
      const btn = document.getElementById('authNavBtn');
      if (btn) { btn.textContent = '👤 ' + data.customer.name.split(' ')[0]; btn.onclick = doLogout; }
      closeModal('signup');
      showToast(`🎉 Welcome, ${data.customer.name}!`);
      } else {
      showToast('⚠️ ' + data.message);
    }
  } catch (err) {
    showToast('⚠️ Server connection failed!');
  }
}