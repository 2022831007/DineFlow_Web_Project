USE dineflow;
ALTER TABLE reviews ADD COLUMN status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending';
