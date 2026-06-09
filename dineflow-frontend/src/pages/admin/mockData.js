export const MENU = [
  {
    id: 1,
    name: 'Classic Beef Burger',
    desc: 'Juicy beef patty with cheddar, lettuce & special sauce',
    price: 220, emoji: '🍔', cat: 'burger',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    badge: 'Best Seller', badgeClass: '', rating: 4.8, reviews: 142
  },
  {
    id: 2,
    name: 'Chicken Zinger Burger',
    desc: 'Crispy fried chicken with spicy mayo & coleslaw',
    price: 180, emoji: '🍔', cat: 'burger',
    img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
    badge: 'Spicy 🌶️', badgeClass: 'purple', rating: 4.6, reviews: 98
  },
  {
    id: 3,
    name: 'Mutton Biryani',
    desc: 'Aromatic basmati rice with tender mutton pieces & raita',
    price: 280, emoji: '🍛', cat: 'rice',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    badge: 'Popular', badgeClass: '', rating: 4.9, reviews: 210
  },
  {
    id: 4,
    name: 'Chicken Fried Rice',
    desc: 'Wok-tossed rice with egg, chicken & vegetables',
    price: 160, emoji: '🍚', cat: 'rice',
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    badge: 'Value', badgeClass: 'green', rating: 4.5, reviews: 77
  },
  {
    id: 5,
    name: 'Margherita Pizza',
    desc: 'Fresh tomato sauce, mozzarella & basil on thin crust',
    price: 320, emoji: '🍕', cat: 'pizza',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    badge: 'New', badgeClass: 'purple', rating: 4.7, reviews: 54
  },
  {
    id: 6,
    name: 'BBQ Chicken Pizza',
    desc: 'Smoky BBQ sauce, grilled chicken, red onion & cheddar',
    price: 360, emoji: '🍕', cat: 'pizza',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    badge: 'Best Seller', badgeClass: '', rating: 4.8, reviews: 120
  },
  {
    id: 7,
    name: 'Chocolate Lava Cake',
    desc: 'Warm chocolate cake with gooey molten centre & ice cream',
    price: 140, emoji: '🍰', cat: 'dessert',
    img: 'https://images.unsplash.com/photo-1617305855058-336d24456869?w=400&h=300&fit=crop',
    badge: 'Must Try!', badgeClass: '', rating: 4.9, reviews: 189
  },
  {
    id: 8,
    name: 'Blueberry Cheesecake',
    desc: 'Creamy cheesecake topped with fresh blueberry compote',
    price: 160, emoji: '🧁', cat: 'dessert',
    img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    badge: 'Must Try!', badgeClass: 'green', rating: 4.7, reviews: 63
  },
  {
    id: 9,
    name: 'Fresh Mango Lassi',
    desc: 'Chilled yogurt drink blended with sweet Alphonso mangoes',
    price: 80, emoji: '🥭', cat: 'drinks',
    img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop',
    badge: 'Fresh', badgeClass: 'green', rating: 4.6, reviews: 95
  },
  {
    id: 10,
    name: 'Strawberry Milkshake',
    desc: 'Thick milkshake with real strawberries & whipped cream',
    price: 100, emoji: '🍓', cat: 'drinks',
    img: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&h=300&fit=crop',
    badge: 'Cold', badgeClass: 'purple', rating: 4.8, reviews: 112
  },
  {
    id: 11,
    name: 'Chicken Shawarma',
    desc: 'Tender chicken wrap with garlic sauce & fresh veggies',
    price: 150, emoji: '🌯', cat: 'burger',
    img: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=400&h=300&fit=crop',
    badge: 'Hot', badgeClass: '', rating: 4.7, reviews: 87
  },
  {
    id: 12,
    name: 'Vegetable Khichuri',
    desc: 'Comforting lentil rice with mixed vegetables & ghee',
    price: 120, emoji: '🍲', cat: 'rice',
    img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    badge: 'Comfort', badgeClass: 'green', rating: 4.4, reviews: 45
  }
];

export const INITIAL_REVIEWS = [
  {
    name: 'Tanha', rating: 5,
    text: "Amazing biryani! Best I've had in Mymensingh. Fast delivery and still hot!",
    date: '2 hours ago', avatar: '👩🏻', color: '#FFE8EF'
  },
  {
    name: 'Tasnim R.', rating: 4,
    text: 'The chocolate lava cake is absolutely divine 😍 Will definitely order again.',
    date: 'Yesterday', avatar: '👩', color: '#E8FFF7'
  },
  {
    name: 'Choiti', rating: 5,
    text: 'Beef burger was juicy and perfectly seasoned. Great value for money!',
    date: '3 days ago', avatar: '👩🏻', color: '#F0E8FF'
  }
];

export const INVENTORY = [
  { id: 'INV-001', name: 'Burger Buns', cat: 'Bakery', qty: 5, unit: 'pcs', status: 'Low Stock', updated: '2026-06-05' },
  { id: 'INV-002', name: 'Beef Patties', cat: 'Meat', qty: 200, unit: 'pcs', status: 'In Stock', updated: '2026-06-06' },
  { id: 'INV-003', name: 'Cheddar Cheese', cat: 'Dairy', qty: 15, unit: 'kg', status: 'In Stock', updated: '2026-06-04' },
  { id: 'INV-004', name: 'Lettuce', cat: 'Vegetables', qty: 5, unit: 'kg', status: 'Low Stock', updated: '2026-06-06' },
  { id: 'INV-005', name: 'Tomatoes', cat: 'Vegetables', qty: 10, unit: 'kg', status: 'In Stock', updated: '2026-06-06' },
  { id: 'INV-006', name: 'Basmati Rice', cat: 'Grains', qty: 100, unit: 'kg', status: 'In Stock', updated: '2026-06-01' }
];

export const BILLS = [
  { id: 'B-1001', customer: 'Rahim Uddin', orderNo: 'ORD-501', amount: 850, method: 'Cash', status: 'Paid', date: '2026-06-06' },
  { id: 'B-1002', customer: 'Karim Hasan', orderNo: 'ORD-502', amount: 1200, method: 'Card', status: 'Paid', date: '2026-06-06' },
  { id: 'B-1003', customer: 'Fatima Begum', orderNo: 'ORD-503', amount: 450, method: 'bKash', status: 'Pending', date: '2026-06-06' },
  { id: 'B-1004', customer: 'Sajid Ali', orderNo: 'ORD-504', amount: 2300, method: 'Cash', status: 'Paid', date: '2026-06-05' },
  { id: 'B-1005', customer: 'Nusrat Jahan', orderNo: 'ORD-505', amount: 320, method: 'Card', status: 'Pending', date: '2026-06-05' }
];

export const RECENT_ORDERS = [
  { id: 'ORD-501', customer: 'Rahim Uddin', items: 3, total: 850, status: 'Delivered', time: '10:30 AM' },
  { id: 'ORD-502', customer: 'Karim Hasan', items: 5, total: 1200, status: 'Preparing', time: '11:15 AM' },
  { id: 'ORD-503', customer: 'Fatima Begum', items: 2, total: 450, status: 'Pending', time: '11:45 AM' }
];
