-- 1. Create restaurant_tables table
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number VARCHAR(50) NOT NULL UNIQUE,
  capacity INT DEFAULT 4,
  status ENUM('available', 'occupied', 'reserved') DEFAULT 'available'
);

-- 2. Create users (waiters / staff) table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role ENUM('waiter', 'kitchen', 'cashier', 'admin') DEFAULT 'waiter',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  cat VARCHAR(100) NOT NULL,
  qty INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
  status VARCHAR(50) DEFAULT 'In Stock',
  updated DATE NOT NULL
);

-- 4. Alter reviews table to add status column
ALTER TABLE reviews ADD COLUMN status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending';

-- 5. Alter orders table to be compatible with dine_in columns
ALTER TABLE orders 
ADD COLUMN table_id INT NULL,
ADD COLUMN user_id INT NULL,
ADD COLUMN total_amount DECIMAL(10,2) NULL,
MODIFY COLUMN customer_id INT NULL,
MODIFY COLUMN subtotal DECIMAL(10,2) NULL,
MODIFY COLUMN grand_total DECIMAL(10,2) NULL,
MODIFY COLUMN status ENUM('pending','confirmed','preparing','ready','served','delivered','cancelled') DEFAULT 'pending';

-- 6. Alter order_items table to be compatible with dine_in columns
ALTER TABLE order_items 
ADD COLUMN menu_item_id INT NULL,
ADD COLUMN special_note TEXT NULL,
MODIFY COLUMN name VARCHAR(150) NULL,
MODIFY COLUMN subtotal DECIMAL(10,2) NULL;

-- 7. Create menu VIEW referencing food_items for compatibility
CREATE OR REPLACE VIEW menu AS SELECT * FROM food_items;

-- 8. Seed restaurant_tables
INSERT IGNORE INTO restaurant_tables (id, table_number, capacity, status) VALUES
(1, '1', 2, 'available'),
(2, '2', 4, 'occupied'),
(3, '3', 4, 'available'),
(4, '4', 6, 'occupied'),
(5, '5', 8, 'available'),
(6, '6', 2, 'available'),
(7, '7', 4, 'available'),
(8, '8', 6, 'occupied');

-- 9. Seed users
INSERT IGNORE INTO users (id, name, email, role, password) VALUES
(1, 'Sajid Ali', 'sajid@dineflow.com', 'waiter', '$2a$10$abcdefghijklmnopqrstuv'),
(2, 'Nusrat Jahan', 'nusrat@dineflow.com', 'waiter', '$2a$10$abcdefghijklmnopqrstuv'),
(3, 'Rahim Uddin', 'rahim@dineflow.com', 'waiter', '$2a$10$abcdefghijklmnopqrstuv'),
(4, 'Chef Monsur', 'monsur@dineflow.com', 'kitchen', '$2a$10$abcdefghijklmnopqrstuv');

-- 10. Seed inventory
INSERT IGNORE INTO inventory (id, name, cat, qty, unit, status, updated) VALUES
('INV-001', 'Burger Buns', 'Bakery', 5, 'pcs', 'Low Stock', '2026-06-05'),
('INV-002', 'Beef Patties', 'Meat', 200, 'pcs', 'In Stock', '2026-06-06'),
('INV-003', 'Cheddar Cheese', 'Dairy', 15, 'kg', 'In Stock', '2026-06-04'),
('INV-004', 'Lettuce', 'Vegetables', 5, 'kg', 'Low Stock', '2026-06-06'),
('INV-005', 'Tomatoes', 'Vegetables', 10, 'kg', 'In Stock', '2026-06-06'),
('INV-006', 'Basmati Rice', 'Grains', 100, 'kg', 'In Stock', '2026-06-01');

-- 11. Seed some orders (including active/served ones) for billing/cashier dashboards
INSERT IGNORE INTO orders (id, order_code, customer_id, table_id, user_id, order_type, total_amount, status, created_at) VALUES
(101, 'ORD-501', NULL, 4, 1, 'dine_in', 540.00, 'ready', NOW() - INTERVAL 30 MINUTE),
(102, 'ORD-502', NULL, 2, 2, 'dine_in', 440.00, 'preparing', NOW() - INTERVAL 15 MINUTE),
(103, 'ORD-503', NULL, 8, 3, 'dine_in', 320.00, 'pending', NOW() - INTERVAL 5 MINUTE);

-- 12. Seed order items
INSERT IGNORE INTO order_items (order_id, food_item_id, menu_item_id, name, price, quantity, subtotal) VALUES
(101, 1, 1, 'Classic Beef Burger', 220.00, 2, 440.00),
(101, 10, 10, 'Strawberry Milkshake', 100.00, 1, 100.00),
(102, 3, 3, 'Mutton Biryani', 280.00, 1, 280.00),
(102, 8, 8, 'Blueberry Cheesecake', 160.00, 1, 160.00),
(103, 5, 5, 'Margherita Pizza', 320.00, 1, 320.00);
