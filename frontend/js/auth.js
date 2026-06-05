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

function doLogin() {
  const email = document.getElementById('li-email').value.trim();
  const pw    = document.getElementById('li-pw').value;

  if (!email || !pw) {
    showToast('⚠️ Please fill in all fields');
    return;
  }

  const user = { name: email.split('@')[0], email };
  appState.currentUser = user;
  localStorage.setItem('dineflow_user', JSON.stringify(user));

  const btn = document.getElementById('authNavBtn');
  if (btn) {
    btn.textContent = '👤 ' + user.name;
    btn.onclick = doLogout;
  }
  closeModal('login');
  showToast(`👋 Welcome back, ${user.name}!`);
}

function doSignup() {
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

  const user = { name: `${fname} ${lname}`.trim(), email, phone, area, address: addr };
  appState.currentUser = user;
  localStorage.setItem('dineflow_user', JSON.stringify(user));

  const btn = document.getElementById('authNavBtn');
  if (btn) {
    btn.textContent = '👤 ' + fname;
    btn.onclick = doLogout;
  }
  closeModal('signup');
  showToast(`🎉 Welcome to DineFlow, ${fname}!`);
}
