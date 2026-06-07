let selectedRating = 0;

 function setRating(n) {
  selectedRating = n;
  const labels = ['', 'Poor 😞', 'Fair 😐', 'Good 😊', 'Great 😄', 'Excellent 🤩'];
  document.getElementById('ratingLabel').textContent = labels[n];

  document.querySelectorAll('#starSelect span').forEach((s, i) => {
    s.style.opacity   = i < n ? '1' : '0.3';
    s.style.transform = i < n ? 'scale(1.15)' : 'scale(1)';
  });
}

 async function submitReview() {
  const name = document.getElementById('rv-name').value.trim();
  const text = document.getElementById('rv-text').value.trim();

  if (!name || !text || !selectedRating) {
    showToast('⚠️ Please complete all fields and select a rating');
    return;
  }
  const token = getToken();
  if (token) {
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          rating: selectedRating,
          review_text: text
        })
      });
      const data = await res.json();
      if (!data.success) {
        showToast('⚠️ ' + data.message);
        return;
      }
    } catch (err) {
      console.log('Review sync failed:', err);
    }
  }

  const avatars = ['👤', '👨', '👩', '👦', '👧', '🧑'];
  const colors  = ['#FFE8EF', '#E8FFF7', '#F0E8FF', '#FFF0E8', '#E8F0FF'];

  appState.reviews.unshift({
    name,
    rating: selectedRating,
    text,
    date:   'Just now',
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    color:  colors[Math.floor(Math.random() * colors.length)]
  });

  // Reset form
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-text').value = '';
  selectedRating = 0;
  document.getElementById('ratingLabel').textContent = 'Click to rate';
  document.querySelectorAll('#starSelect span').forEach(s => {
    s.style.opacity = '1';
    s.style.transform = 'scale(1)';
  });

  renderReviews();
  showToast('🌟 Review submitted! Thank you!');
}
