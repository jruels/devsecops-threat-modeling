-- Create the database if not exists
CREATE DATABASE IF NOT EXISTS shopeasy;
USE shopeasy;

-- Users table (passwords stored in plain text)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Comments table (stores unsanitized comments)
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    comment TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert initial data
INSERT INTO users (username, password) VALUES
('alice', 'password123'),
('bob', 'qwerty');

INSERT INTO products (name, price) VALUES
('Laptop', 999.99),
('Headphones', 49.99),
('Mouse', 19.99);