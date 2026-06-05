let activeCategory = 'all';
let searchQuery    = '';

function filterCategory(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  if (el) {
    document.querySelectorAll('.cat-chip').forEach(chip => {
      if (chip.textContent.trim() === el.textContent.trim()) {
        chip.classList.add('active');
      }
    });
  }

  applyFilter();
}

function filterMenu(query) {
  searchQuery = query.toLowerCase();
  applyFilter();
}

function applyFilter() {
  let items = MENU;

  if (activeCategory !== 'all') {
    items = items.filter(i => i.cat === activeCategory);
  }
  if (searchQuery) {
    items = items.filter(i =>
      i.name.toLowerCase().includes(searchQuery) ||
      i.desc.toLowerCase().includes(searchQuery)
    );
  }

  renderGrid(items, 'homeGrid');
  renderGrid(items, 'menuGrid');
}
