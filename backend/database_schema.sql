-- Create the database
CREATE DATABASE IF NOT EXISTS propverse;
USE propverse;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    user_type ENUM('tenant', 'landlord', 'both') DEFAULT 'tenant',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Amenities table (needed for property_amenities foreign key)
CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('apartment', 'villa', 'independent_house', 'pg', 'commercial_space', 'flat', 'room', 'hostel') NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    built_up_area INT NOT NULL,
    carpet_area INT,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    floor_number INT,
    total_floors INT,
    facing ENUM('north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west'),
    property_age INT,
    furnishing_status ENUM('furnished', 'semi_furnished', 'unfurnished') DEFAULT 'unfurnished',
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL,
    maintenance_charges DECIMAL(10, 2) DEFAULT 0,
    preferred_tenants ENUM('family', 'bachelor', 'female', 'students', 'any') DEFAULT 'any',
    available_from DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Property images table
CREATE TABLE property_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_cover_image BOOLEAN DEFAULT FALSE,
    image_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Property amenities table
CREATE TABLE property_amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    amenity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_property_amenity (property_id, amenity_id)
);

-- Property inquiries table
CREATE TABLE property_inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    inquirer_id INT NOT NULL,
    message TEXT,
    inquiry_type ENUM('call_request', 'email', 'visit_request', 'general') DEFAULT 'general',
    status ENUM('pending', 'responded', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (inquirer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rental applications table
CREATE TABLE rental_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    applicant_id INT NOT NULL,
    move_in_date DATE,
    lease_duration INT, -- in months
    monthly_income DECIMAL(10, 2),
    employment_status VARCHAR(100),
    references TEXT,
    additional_notes TEXT,
    status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Favorites table (referenced in indexes but not defined in the schema)
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_property (user_id, property_id)
);

-- Reviews table (referenced in indexes but not defined in the schema)
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_properties_location ON properties(city, location);
CREATE INDEX idx_properties_price ON properties(monthly_rent);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_available ON properties(is_available);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_property_images_property ON property_images(property_id);
CREATE INDEX idx_inquiries_property ON property_inquiries(property_id);
CREATE INDEX idx_inquiries_user ON property_inquiries(inquirer_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_reviews_property ON reviews(property_id);

-- Insert some sample data for testing
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, is_verified, is_active)
VALUES 
('john@example.com', '$2y$10$7CpMFQMFG4CvQNZUPJJJBu.1L1XnBdFAe4Zb2S/W.8Xg7UlAgvmxK', 'John', 'Doe', '+919876543210', 'landlord', TRUE, TRUE),
('jane@example.com', '$2y$10$7CpMFQMFG4CvQNZUPJJJBu.1L1XnBdFAe4Zb2S/W.8Xg7UlAgvmxK', 'Jane', 'Smith', '+919876543211', 'both', TRUE, TRUE),
('tenant@example.com', '$2y$10$7CpMFQMFG4CvQNZUPJJJBu.1L1XnBdFAe4Zb2S/W.8Xg7UlAgvmxK', 'Sam', 'Tenant', '+919876543212', 'tenant', TRUE, TRUE);

-- Insert some amenities
INSERT INTO amenities (name, icon, category)
VALUES 
('Parking', 'car', 'basic'),
('Lift', 'elevator', 'basic'),
('Security', 'shield', 'basic'),
('Power Backup', 'lightning', 'basic'),
('Gym', 'dumbbell', 'lifestyle'),
('Swimming Pool', 'swimming', 'lifestyle'),
('WiFi', 'wifi', 'utility'),
('AC', 'snowflake', 'utility'),
('Furnished', 'chair', 'interior'),
('Laundry', 'washing-machine', 'utility'),
('Garden', 'tree', 'exterior'),
('Balcony', 'home', 'exterior'),
('Study Room', 'book', 'interior'),
('Mess', 'utensils', 'service');

-- Sample properties (with current date as available_from)
INSERT INTO properties (
    owner_id, title, description, property_type, location, city, state, pincode,
    built_up_area, bedrooms, bathrooms, monthly_rent, security_deposit, preferred_tenants, available_from
)
VALUES 
(1, 'Modern 2BHK Apartment', 'Beautiful modern apartment with all amenities. Close to metro station and shopping centers.', 
'apartment', 'Koramangala', 'Bangalore', 'Karnataka', '560034', 1200, 2, 2, 35000, 100000, 'any', CURDATE()),

(1, 'Spacious 3BHK Villa', 'Independent villa with garden. Perfect for families. Quiet neighborhood with good connectivity.', 
'villa', 'Whitefield', 'Bangalore', 'Karnataka', '560066', 2000, 3, 3, 55000, 150000, 'family', CURDATE()),

(2, 'Luxury PG for Working Professionals', 'Fully furnished PG with meals included. Perfect for working professionals.', 
'pg', 'Indiranagar', 'Bangalore', 'Karnataka', '560038', 400, 1, 1, 18000, 36000, 'bachelor', CURDATE()),

(2, 'Student Hostel - Budget Friendly', 'Affordable hostel accommodation for students. Study room and mess facilities available.', 
'hostel', 'Electronic City', 'Bangalore', 'Karnataka', '560100', 200, 1, 1, 12000, 24000, 'students', CURDATE());

-- Add some property images
INSERT INTO property_images (property_id, image_url, is_cover_image, image_order)
VALUES 
(1, '/placeholder.svg', TRUE, 1),
(2, '/placeholder.svg', TRUE, 1),
(3, '/placeholder.svg', TRUE, 1),
(4, '/placeholder.svg', TRUE, 1);

-- Add some amenities to properties
INSERT INTO property_amenities (property_id, amenity_id)
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Modern 2BHK Apartment
(2, 1), (2, 3), (2, 4), (2, 11), -- Spacious 3BHK Villa
(3, 3), (3, 7), (3, 8), (3, 10), (3, 14), -- Luxury PG
(4, 3), (4, 7), (4, 10), (4, 13), (4, 14); -- Student Hostel 