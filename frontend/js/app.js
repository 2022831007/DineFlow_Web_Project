const appState = {
  cart:         [],
  currentUser:  null,
  reviews:      [...INITIAL_REVIEWS],
  lastOrderId:  null,
  deliveryInfo: null
};

document.addEventListener('DOMContentLoaded', () => {
  
  renderGrid(MENU, 'homeGrid');
  renderGrid(MENU, 'menuGrid');
  renderReviews();

  document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('login');
  });
  document.getElementById('signupModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('signup');
  });
});
