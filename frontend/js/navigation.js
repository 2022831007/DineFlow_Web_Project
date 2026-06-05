const PAGE_NAV_MAP = {
  home:     0,
  menu:     1,
  tracking: 2,
  reviews:  3,
  checkout: -1   
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    target.classList.remove('page-anim');
    void target.offsetWidth; // reflow to restart animation
    target.classList.add('page-anim');
  }

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const idx = PAGE_NAV_MAP[name];
  if (idx >= 0) {
    const links = document.querySelectorAll('.nav-links a');
    if (links[idx]) links[idx].classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
