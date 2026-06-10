USE dineflow;

CREATE TABLE IF NOT EXISTS user_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    item_id INT NULL,
    item_name VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_analytics_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    period VARCHAR(10) NOT NULL,
    total_actions INT DEFAULT 0,
    most_common_action VARCHAR(50),
    unique_items_interacted INT DEFAULT 0,
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY ux_user_period (user_id, period)
);