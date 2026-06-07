CREATE DATABASE IF NOT EXISTS dineflow;
USE dineflow;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS food_items;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE customers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100),
  email       VARCHAR(150) NOT NULL UNIQUE,
  phone       VARCHAR(20)  NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE addresses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  area        VARCHAR(150),
  full_address TEXT NOT NULL,
  is_default  TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE food_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  category     VARCHAR(50),
  emoji        VARCHAR(10),
  badge        VARCHAR(50),
  badge_class  VARCHAR(50),
  rating       DECIMAL(3,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  img_url      VARCHAR(300),
  is_available TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  customer_id  INT NOT NULL,
  food_item_id INT NOT NULL,
  quantity     INT NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id)  REFERENCES customers(id)  ON DELETE CASCADE,
  FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (customer_id, food_item_id)
);

CREATE TABLE orders (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  order_code     VARCHAR(20) NOT NULL UNIQUE,
  customer_id    INT NOT NULL,
  address_id     INT,
  order_type     ENUM('online','dine_in') DEFAULT 'online',
  payment_method ENUM('cod','cash') DEFAULT 'cod',
  subtotal       DECIMAL(10,2) NOT NULL,
  vat            DECIMAL(10,2) DEFAULT 0,
  discount       DECIMAL(10,2) DEFAULT 0,
  grand_total    DECIMAL(10,2) NOT NULL,
  status         ENUM('pending','confirmed','preparing','ready','delivered','cancelled') DEFAULT 'pending',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id)  REFERENCES addresses(id)  ON DELETE SET NULL
);

CREATE TABLE order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT NOT NULL,
  food_item_id INT NOT NULL,
  name         VARCHAR(150) NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  quantity     INT NOT NULL,
  subtotal     DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)     REFERENCES orders(id)     ON DELETE CASCADE,
  FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_id    INT,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id)    REFERENCES orders(id)    ON DELETE SET NULL
);

INSERT IGNORE INTO food_items (id, name, description, price, category, emoji, badge, badge_class, rating, review_count, img_url)
VALUES
(1,  'Classic Beef Burger',   'Juicy beef patty with cheddar, lettuce & special sauce',    220.00, 'burger',  '🍔', 'Best Seller', '',       4.8, 142, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'),
(2,  'Chicken Zinger Burger', 'Crispy fried chicken with spicy mayo & coleslaw',           180.00, 'burger',  '🍔', 'Spicy',       'purple', 4.6, 98,  'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop'),
(3,  'Mutton Biryani',        'Aromatic basmati rice with tender mutton pieces & raita',   280.00, 'rice',    '🍛', 'Popular',     '',       4.9, 210, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop'),
(4,  'Chicken Fried Rice',    'Wok-tossed rice with egg, chicken & vegetables',            160.00, 'rice',    '🍚', 'Value',       'green',  4.5, 77,  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'),
(5,  'Margherita Pizza',      'Fresh tomato sauce, mozzarella & basil on thin crust',      320.00, 'pizza',   '🍕', 'New',         'purple', 4.7, 54,  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'),
(6,  'BBQ Chicken Pizza',     'Smoky BBQ sauce, grilled chicken, red onion & cheddar',     360.00, 'pizza',   '🍕', 'Best Seller', '',       4.8, 120, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'),
(7,  'Chocolate Lava Cake',   'Warm chocolate cake with gooey molten centre & ice cream',  140.00, 'dessert', '🍰', 'Must Try!',   '',       4.9, 189, 'https://images.unsplash.com/photo-1617305855058-336d24456869?w=400&h=300&fit=crop'),
(8,  'Blueberry Cheesecake',  'Creamy cheesecake topped with fresh blueberry compote',     160.00, 'dessert', '🧁', 'Seasonal',    'green',  4.7, 63,  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop'),
(9,  'Fresh Mango Lassi',     'Chilled yogurt drink blended with sweet Alphonso mangoes',  80.00,  'drinks',  '🥭', 'Fresh',       'green',  4.6, 95,  'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop'),
(10, 'Strawberry Milkshake',  'Thick milkshake with real strawberries & whipped cream',    100.00, 'drinks',  '🍓', 'Cold',        'purple', 4.8, 112, 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&h=300&fit=crop'),
(11, 'Chicken Shawarma',      'Tender chicken wrap with garlic sauce & fresh veggies',     150.00, 'burger',  '🌯', 'Hot',         '',       4.7, 87,  'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=400&h=300&fit=crop'),
(12, 'Vegetable Khichuri',    'Comforting lentil rice with mixed vegetables & ghee',       120.00, 'rice',    '🍲', 'Comfort',     'green',  4.4, 45,  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop');