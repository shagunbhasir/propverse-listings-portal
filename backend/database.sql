-- Create the database
CREATE DATABASE IF NOT EXISTS propverse;
USE propverse;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    bedrooms INT,
    bathrooms INT,
    area DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    amenities JSON,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    preferences JSON,
    available_from DATE,
    security_deposit DECIMAL(10, 2),
    furnishing_status VARCHAR(50),
    floor_number VARCHAR(20),
    total_floors VARCHAR(20),
    facing VARCHAR(50),
    property_age VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add some sample data
INSERT INTO users (name, email, phone, password) VALUES
('John Doe', 'john@example.com', '+919876543210', '$2y$10$7CpMFQMFG4CvQNZUPJJJBu.1L1XnBdFAe4Zb2S/W.8Xg7UlAgvmxK'), -- password: password
('Jane Smith', 'jane@example.com', '+919876543211', '$2y$10$7CpMFQMFG4CvQNZUPJJJBu.1L1XnBdFAe4Zb2S/W.8Xg7UlAgvmxK'); -- password: password

-- Sample properties
INSERT INTO properties (user_id, title, location, price, type, bedrooms, bathrooms, area, description, image, amenities, contact_name, contact_phone, contact_email, preferences) VALUES
(1, 'Modern 2BHK Apartment', 'Koramangala, Bangalore', 35000, 'apartment', 2, 2, 1200, 'Beautiful modern apartment with all amenities. Close to metro station and shopping centers.', '/placeholder.svg', '["Parking", "Lift", "Security", "Power Backup", "Gym"]', 'John Doe', '+919876543210', 'john@example.com', '["family", "bachelor"]'),
(1, 'Spacious 3BHK Villa', 'Whitefield, Bangalore', 55000, 'flat', 3, 3, 2000, 'Independent villa with garden. Perfect for families. Quiet neighborhood with good connectivity.', '/placeholder.svg', '["Parking", "Garden", "Security", "Power Backup"]', 'John Doe', '+919876543210', 'john@example.com', '["family"]'),
(2, 'Luxury PG for Working Professionals', 'Indiranagar, Bangalore', 18000, 'pg', 1, 1, 400, 'Fully furnished PG with meals included. Perfect for working professionals.', '/placeholder.svg', '["Meals", "Laundry", "Security", "WiFi", "AC"]', 'Jane Smith', '+919876543211', 'jane@example.com', '["bachelor", "female"]'),
(2, 'Student Hostel - Budget Friendly', 'Electronic City, Bangalore', 12000, 'hostel', 1, 1, 200, 'Affordable hostel accommodation for students. Study room and mess facilities available.', '/placeholder.svg', '["Mess", "Study Room", "Security", "WiFi", "Laundry"]', 'Jane Smith', '+919876543211', 'jane@example.com', '["students"]'); 