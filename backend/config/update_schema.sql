USE dineflow;

CREATE TABLE IF NOT EXISTS inventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(150) NOT NULL,
  category VARCHAR(50),
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(20),
  minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 10,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  vat DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  payment_method ENUM('Cash','Card','Mobile Banking') DEFAULT 'Cash',
  payment_status ENUM('Unpaid','Paid') DEFAULT 'Unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('Cash','Card','Mobile Banking') NOT NULL,
  payment_status ENUM('Success','Failed','Pending') DEFAULT 'Success',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE
);

-- Seed Inventory Data (25 records)
INSERT IGNORE INTO inventory (inventory_id, item_name, category, quantity, unit, minimum_stock) VALUES
(1, 'Chicken Breast', 'Meat', 50, 'kg', 10),
(2, 'Beef Mince', 'Meat', 30, 'kg', 10),
(3, 'Basmati Rice', 'Grains', 100, 'kg', 20),
(4, 'Burger Buns', 'Bakery', 200, 'pcs', 50),
(5, 'Cheddar Cheese', 'Dairy', 15, 'kg', 5),
(6, 'Mozzarella Cheese', 'Dairy', 20, 'kg', 5),
(7, 'Tomatoes', 'Vegetables', 40, 'kg', 10),
(8, 'Onions', 'Vegetables', 50, 'kg', 15),
(9, 'Lettuce', 'Vegetables', 10, 'kg', 5),
(10, 'Potatoes', 'Vegetables', 80, 'kg', 20),
(11, 'Cooking Oil', 'Pantry', 40, 'L', 10),
(12, 'Olive Oil', 'Pantry', 10, 'L', 2),
(13, 'Salt', 'Pantry', 20, 'kg', 5),
(14, 'Black Pepper', 'Spices', 5, 'kg', 1),
(15, 'Chili Powder', 'Spices', 5, 'kg', 1),
(16, 'Garlic', 'Vegetables', 15, 'kg', 3),
(17, 'Ginger', 'Vegetables', 10, 'kg', 2),
(18, 'Tomato Ketchup', 'Condiments', 25, 'kg', 5),
(19, 'Mayonnaise', 'Condiments', 20, 'kg', 5),
(20, 'BBQ Sauce', 'Condiments', 10, 'kg', 2),
(21, 'Strawberries', 'Fruits', 8, 'kg', 2),
(22, 'Mango Pulp', 'Fruits', 15, 'kg', 3),
(23, 'Milk', 'Dairy', 30, 'L', 10),
(24, 'Whipping Cream', 'Dairy', 10, 'L', 2),
(25, 'Chocolate Chips', 'Baking', 12, 'kg', 3);

-- Seed Dummy Orders (so we have enough data for dashboards)
INSERT IGNORE INTO customers (id, first_name, last_name, email, phone, password) VALUES 
(101, 'Admin', 'User', 'admin@dineflow.com', '01700000000', 'hashed_pass');

INSERT IGNORE INTO orders (id, order_code, customer_id, order_type, payment_method, subtotal, vat, discount, grand_total, status) VALUES
(1001, 'ORD-1001', 101, 'dine_in', 'cash', 500, 25, 0, 525, 'completed'),
(1002, 'ORD-1002', 101, 'online', 'cash', 1000, 50, 0, 1050, 'completed'),
(1003, 'ORD-1003', 101, 'dine_in', 'cash', 320, 16, 0, 336, 'completed'),
(1004, 'ORD-1004', 101, 'online', 'cash', 800, 40, 0, 840, 'pending'),
(1005, 'ORD-1005', 101, 'dine_in', 'cash', 280, 14, 0, 294, 'preparing'),
(1006, 'ORD-1006', 101, 'online', 'cash', 600, 30, 0, 630, 'ready'),
(1007, 'ORD-1007', 101, 'dine_in', 'cash', 1500, 75, 50, 1525, 'completed'),
(1008, 'ORD-1008', 101, 'online', 'cash', 200, 10, 0, 210, 'cancelled');

-- Seed Bills and Payments
INSERT IGNORE INTO bills (bill_id, order_id, subtotal, vat, discount, grand_total, payment_method, payment_status) VALUES
(1, 1001, 500, 25, 0, 525, 'Cash', 'Paid'),
(2, 1002, 1000, 50, 0, 1050, 'Mobile Banking', 'Paid'),
(3, 1003, 320, 16, 0, 336, 'Card', 'Paid'),
(4, 1007, 1500, 75, 50, 1525, 'Card', 'Paid');

INSERT IGNORE INTO payments (payment_id, bill_id, amount, payment_method) VALUES
(1, 1, 525, 'Cash'),
(2, 2, 1050, 'Mobile Banking'),
(3, 3, 336, 'Card'),
(4, 4, 1525, 'Card');
