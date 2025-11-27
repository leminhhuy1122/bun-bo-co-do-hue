-- ===============================================
-- Database: bun_bo_hue_co_do
-- Optimized for Railway MySQL Deployment
-- Character Set: UTF8MB4 (Full Unicode Support)
-- ===============================================

SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ===============================================
-- Procedures
-- ===============================================

DELIMITER $$

CREATE PROCEDURE `apply_coupon` (
    IN `p_coupon_code` VARCHAR(50), 
    IN `p_order_amount` DECIMAL(10,2), 
    OUT `p_is_valid` BOOLEAN, 
    OUT `p_discount_amount` DECIMAL(10,2), 
    OUT `p_message` VARCHAR(255)
)
BEGIN
    DECLARE v_discount_type VARCHAR(20);
    DECLARE v_discount_value DECIMAL(10,2);
    DECLARE v_min_order DECIMAL(10,2);
    DECLARE v_max_discount DECIMAL(10,2);
    DECLARE v_usage_limit INT;
    DECLARE v_used_count INT;
    DECLARE v_valid_until TIMESTAMP;
    DECLARE v_is_active BOOLEAN;
    
    SELECT 
        discount_type, discount_value, min_order_amount, 
        max_discount_amount, usage_limit, used_count, 
        valid_until, is_active
    INTO 
        v_discount_type, v_discount_value, v_min_order, 
        v_max_discount, v_usage_limit, v_used_count, 
        v_valid_until, v_is_active
    FROM coupons 
    WHERE code = p_coupon_code;
    
    IF v_discount_type IS NULL THEN
        SET p_is_valid = FALSE;
        SET p_discount_amount = 0;
        SET p_message = 'Mã giảm giá không tồn tại';
        
    ELSEIF v_is_active = FALSE THEN
        SET p_is_valid = FALSE;
        SET p_discount_amount = 0;
        SET p_message = 'Mã giảm giá đã bị vô hiệu hóa';
        
    ELSEIF v_valid_until IS NOT NULL AND v_valid_until < NOW() THEN
        SET p_is_valid = FALSE;
        SET p_discount_amount = 0;
        SET p_message = 'Mã giảm giá đã hết hạn';
        
    ELSEIF v_usage_limit IS NOT NULL AND v_used_count >= v_usage_limit THEN
        SET p_is_valid = FALSE;
        SET p_discount_amount = 0;
        SET p_message = 'Mã giảm giá đã hết lượt sử dụng';
        
    ELSEIF p_order_amount < v_min_order THEN
        SET p_is_valid = FALSE;
        SET p_discount_amount = 0;
        SET p_message = CONCAT('Đơn hàng tối thiểu ', FORMAT(v_min_order, 0), 'đ');
        
    ELSE
        SET p_is_valid = TRUE;
        
        IF v_discount_type = 'percentage' THEN
            SET p_discount_amount = p_order_amount * v_discount_value / 100;
            IF v_max_discount IS NOT NULL AND p_discount_amount > v_max_discount THEN
                SET p_discount_amount = v_max_discount;
            END IF;
        ELSE
            SET p_discount_amount = v_discount_value;
        END IF;
        
        SET p_message = 'Áp dụng mã thành công';
    END IF;
END$$

CREATE PROCEDURE `create_order` (
    IN `p_customer_name` VARCHAR(100), 
    IN `p_customer_phone` VARCHAR(15), 
    IN `p_customer_email` VARCHAR(100), 
    IN `p_order_type` VARCHAR(20), 
    IN `p_subtotal` DECIMAL(10,2), 
    IN `p_discount_amount` DECIMAL(10,2), 
    IN `p_total_amount` DECIMAL(10,2), 
    IN `p_coupon_code` VARCHAR(50), 
    OUT `p_order_id` INT, 
    OUT `p_order_number` VARCHAR(20)
)
BEGIN
    DECLARE v_order_number VARCHAR(20);
    
    SET v_order_number = CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 1000), 3, '0'));
    
    INSERT INTO orders (
        order_number, customer_name, customer_phone, customer_email,
        order_type, subtotal, discount_amount, total_amount, coupon_code
    ) VALUES (
        v_order_number, p_customer_name, p_customer_phone, p_customer_email,
        p_order_type, p_subtotal, p_discount_amount, p_total_amount, p_coupon_code
    );
    
    SET p_order_id = LAST_INSERT_ID();
    SET p_order_number = v_order_number;
    
    IF p_coupon_code IS NOT NULL THEN
        UPDATE coupons SET used_count = used_count + 1 WHERE code = p_coupon_code;
    END IF;
END$$

DELIMITER ;

-- ===============================================
-- Table: combos
-- ===============================================
CREATE TABLE `combos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `combo_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `valid_from` timestamp NOT NULL DEFAULT current_timestamp(),
  `valid_until` timestamp NULL DEFAULT NULL,
  `sold_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `combos` (`id`, `name`, `slug`, `description`, `original_price`, `combo_price`, `image_url`, `is_available`, `valid_from`, `valid_until`, `sold_count`, `created_at`, `updated_at`) VALUES
(1, 'Combo Gia Đình', 'combo-gia-dinh', '4 bát bún bò + 4 nước ngọt + Nem lụi', 320000.00, 280000.00, '/images/combo-gia-dinh.jpg', 1, '2025-11-24 15:53:05', NULL, 0, '2025-11-24 15:53:05', '2025-11-24 15:53:05'),
(2, 'Combo Đôi', 'combo-doi', '2 bát bún bò + 2 nước mía + Bánh bèo', 160000.00, 135000.00, '/images/combo-doi.jpg', 1, '2025-11-24 15:53:05', NULL, 0, '2025-11-24 15:53:05', '2025-11-24 15:53:05'),
(3, 'Combo Tiết Kiệm', 'combo-tiet-kiem', '1 bát bún bò + 1 nước ngọt + 3 chả giò', 105000.00, 85000.00, '/images/combo-tiet-kiem.jpg', 1, '2025-11-24 15:53:05', NULL, 0, '2025-11-24 15:53:05', '2025-11-24 15:53:05');

-- ===============================================
-- Table: combo_items
-- ===============================================
CREATE TABLE `combo_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `combo_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `menu_item_id` (`menu_item_id`),
  KEY `idx_combo` (`combo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: coupons
-- ===============================================
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL COMMENT 'NULL = unlimited',
  `used_count` int(11) DEFAULT 0,
  `valid_from` timestamp NOT NULL DEFAULT current_timestamp(),
  `valid_until` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `usage_limit`, `used_count`, `valid_from`, `valid_until`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME2024', 'Giảm 20% cho khách hàng mới', 'percentage', 20.00, 100000.00, 0.00, 0, 0, '2025-11-24 15:53:05', '2025-12-28 17:00:00', 1, '2025-11-24 15:53:05', '2025-11-25 13:34:17'),
(2, 'COMBO50K', 'Giảm 50K cho đơn từ 200K', 'fixed', 50000.00, 200000.00, NULL, NULL, 0, '2025-11-24 15:53:05', '2025-12-31 16:59:59', 1, '2025-11-24 15:53:05', '2025-11-24 19:28:56'),
(3, 'FREESHIP', 'Miễn phí ship cho đơn từ 150K', 'fixed', 20000.00, 150000.00, NULL, NULL, 0, '2025-11-24 15:53:05', '2025-12-31 16:59:59', 1, '2025-11-24 15:53:05', '2025-11-24 15:53:05'),
(4, 'HAPPYHOUR', 'Giảm 15% giờ vàng 14h-16h', 'percentage', 15.00, 50000.00, NULL, NULL, 0, '2025-11-24 15:53:05', '2025-12-31 16:59:59', 1, '2025-11-24 15:53:05', '2025-11-24 15:53:05'),
(5, 'COMBO100K', 'Giảm 100K cho đơn từ 500K', 'fixed', 100000.00, 500000.00, NULL, NULL, 0, '2025-11-24 15:53:05', '2025-12-31 16:59:59', 1, '2025-11-24 15:53:05', '2025-11-24 15:53:05');

-- ===============================================
-- Table: customers
-- ===============================================
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text DEFAULT NULL,
  `total_orders` int(11) DEFAULT 0,
  `total_spent` decimal(10,2) DEFAULT 0.00,
  `loyalty_points` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_customers_phone` (`phone`),
  KEY `idx_customers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: email_logs
-- ===============================================
CREATE TABLE `email_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `error_message` text DEFAULT NULL,
  `message_id` varchar(255) DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_reservation_id` (`reservation_id`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_sent_at` (`sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: email_settings
-- ===============================================
CREATE TABLE `email_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `email_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 'email_enabled', 'true', '2025-11-25 05:34:02', '2025-11-25 05:34:02'),
(2, 'email_from_name', 'Bún Bò Huế Cố Đô', '2025-11-25 05:34:02', '2025-11-25 05:34:02'),
(3, 'email_signature', 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '2025-11-25 05:34:02', '2025-11-25 05:34:02');

-- ===============================================
-- Table: menu_items
-- ===============================================
CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('main','side','drink','dessert','combo') NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_spicy` tinyint(1) DEFAULT 0,
  `preparation_time` int(11) DEFAULT 15 COMMENT 'Thời gian chuẩn bị (phút)',
  `calories` int(11) DEFAULT NULL,
  `ingredients` text DEFAULT NULL COMMENT 'Nguyên liệu chính',
  `allergens` text DEFAULT NULL COMMENT 'Dị ứng',
  `stock_quantity` int(11) DEFAULT 999,
  `sold_count` int(11) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 5.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`),
  KEY `idx_available` (`is_available`),
  KEY `idx_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `menu_items` (`id`, `name`, `slug`, `description`, `price`, `category`, `image_url`, `is_available`, `is_featured`, `is_spicy`, `preparation_time`, `calories`, `ingredients`, `allergens`, `stock_quantity`, `sold_count`, `rating`, `created_at`, `updated_at`) VALUES
(15, 'Bún Bò Đặc Biệt', 'bun-bo-dac-biet', 'Bún bò Huế trọn vị với đầy đủ bắp hoa, giò heo, chả cua, tiết', 79000.00, 'main', '/images/bun-bo-dac-biet.jpg', 1, 1, 1, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-25 13:49:26'),
(16, 'Bún Bò Bắp Hoa', 'bun-bo-bap-hoa', 'Bún bò với bắp hoa giòn ngon đặc trưng', 79000.00, 'main', '/images/bun-bo-bap-hoa.jpg', 1, 1, 1, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-25 13:49:20'),
(17, 'Bún Bò Giò Heo', 'bun-bo-gio-heo', 'Bún bò với giò heo mềm thơm', 79000.00, 'main', '/images/bun-bo-gio-heo.jpg', 1, 0, 1, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-25 13:49:45'),
(18, 'Bún Bò Tái Nạm', 'bun-bo-tai-nam', 'Bún bò với thịt tái và nạm mềm ngon', 69000.00, 'main', '/images/bun-bo-tai-nam.jpg', 1, 1, 1, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-25 13:49:30'),
(19, 'Bún Chả Cua - Chả Huế', 'bun-cha-cua-cha-hue', 'Bún với chả cua và chả Huế đặc sản', 79000.00, 'main', '/images/bun-cha-cua-cha-hue.jpg', 1, 1, 1, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-25 13:49:38'),
(20, 'Chén Xí Quách', 'chen-xi-quach', 'Xí quách thơm ngon, ăn kèm', 30000.00, 'side', '/images/chen-xi-quach.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:57:44'),
(21, 'Chén Hột Gà', 'chen-hot-ga', 'Hột gà tươi ngon đậm đà', 20000.00, 'side', '/images/chen-hot-ga.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:47:43'),
(22, 'Chén Chả Cua Thêm', 'chen-cha-cua-them', 'Thêm chả cua đặc sản Huế', 20000.00, 'side', '/images/chen-cha-cua-them.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:51:26'),
(23, 'Chén Tiết Luộc', 'chen-tiet-luoc', 'Tiết luộc tươi ngon', 20000.00, 'side', '/images/chen-tiet-luoc.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:57:36'),
(24, 'Rau Nhúng & Hành Ngâm Giấm', 'rau-nhung-hanh-ngam', 'Rau sống tươi ngon và hành ngâm giấm chua ngọt', 19000.00, 'side', '/images/rau-nhung-hanh-ngam.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:58:09'),
(25, 'Nước Mía Tắc', 'nuoc-mia-tac', 'Nước mía tươi ép kết hợp chanh tắc', 25000.00, 'drink', '/images/nuoc-mia-tac.jpg', 1, 1, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:49:52'),
(26, 'Sữa Đậu Nành (Lá Dứa)', 'sua-dau-nanh-la-dua', 'Sữa đậu nành thơm lá dứa tự làm', 19000.00, 'drink', '/images/sua-dau-nanh-la-dua.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:58:15'),
(27, 'Nước Sâm', 'nuoc-sam', 'Nước sâm mát lạnh giải nhiệt', 19000.00, 'drink', '/images/nuoc-sam.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:57:56'),
(28, 'Rau Má Đậu Xanh', 'nuoc-rau-ma-dau-xanh', 'Nước rau má đậu xanh mát lành', 19000.00, 'drink', '/images/nuoc-rau-ma-dau-xanh.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:58:03'),
(29, 'Trà Đá', 'tra-da', 'Trà đá tươi mát miễn phí', 0.00, 'drink', '/images/tra-da.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:47:43'),
(30, 'Trà Tắc', 'tra-tac', 'Trà tắc vị chanh tươi mát', 19000.00, 'drink', '/images/tra-tac.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:58:21'),
(31, 'Coca Cola', 'nuoc-coca', 'Coca Cola lon 330ml', 19000.00, 'drink', '/images/nuoc-coca.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:47:43', '2025-11-24 18:57:52'),
(32, '7up', '7up', 'Nước giải khat', 19000.00, 'drink', 'https://product.hstatic.net/1000301274/product/_10100996__7up_320ml_sleek_lon_0366766c074a4b538595ed8d91dc6b0d_grande.png', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-24 18:59:37', '2025-11-24 18:59:37'),
(33, 'Combo Gia Đình 4 Người', 'combo-4-nguoi', 'Bốn tô bún bò (Đặc Biệt, Bắp Hoa, Giò Heo, Tái Nạm), Một chén Xí Quách, Một chén Chả Cua, 2 ly Nước Mía Tắc, 2 ly Rau Má Đậu Xanh', 399000.00, 'combo', '/images/combo-4-nguoi.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-25 10:02:36', '2025-11-25 10:02:36'),
(34, 'Combo Cặp Đôi 2 Người', 'combo-2-nguoi', 'Một tô Bún Bò Đặc Biệt, một tô Bún Bò Tái Nạm, hai ly Nước Mía Tắc', 189000.00, 'combo', '/images/combo-2-nguoi.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-25 10:02:36', '2025-11-25 10:02:36'),
(35, 'Combo Cô Đơn Tiết Kiệm 1 Người', 'combo-1-nguoi', 'Bún Bò Đặc Biệt, một chén Xí Quách, một ly Nước Mía Tắc, một đĩa nhỏ Rau Nhúng & Hành Ngâm', 99000.00, 'combo', '/images/combo-1-nguoi.jpg', 1, 0, 0, 15, NULL, NULL, NULL, 999, 0, 5.0, '2025-11-25 10:02:36', '2025-11-25 10:02:36');

-- ===============================================
-- Table: orders
-- ===============================================
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(20) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `order_type` enum('dine-in','takeaway','delivery') DEFAULT 'dine-in',
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `delivery_fee` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `payment_method` enum('cash','card','momo','vnpay','bank') DEFAULT 'cash',
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `sms_sent` tinyint(1) DEFAULT 0,
  `sms_sent_at` timestamp NULL DEFAULT NULL,
  `sms_count` int(11) DEFAULT 0,
  `order_status` enum('pending','confirmed','preparing','ready','delivering','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_sent` tinyint(1) DEFAULT 0,
  `email_sent_at` timestamp NULL DEFAULT NULL,
  `email_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_status` (`order_status`),
  KEY `idx_created` (`created_at`),
  KEY `idx_orders_created` (`created_at`),
  KEY `idx_orders_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: order_items
-- ===============================================
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) DEFAULT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `toppings` text DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: reservations
-- ===============================================
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_number` varchar(20) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `number_of_guests` int(11) NOT NULL,
  `table_number` varchar(20) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `status` enum('pending','confirmed','seated','completed','cancelled','no-show') DEFAULT 'pending',
  `reminder_sent` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sms_sent` tinyint(1) DEFAULT 0,
  `sms_sent_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservation_number` (`reservation_number`),
  KEY `customer_id` (`customer_id`),
  KEY `idx_date` (`reservation_date`),
  KEY `idx_status` (`status`),
  KEY `idx_phone` (`customer_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: reviews
-- ===============================================
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `menu_item_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `idx_menu_item` (`menu_item_id`),
  KEY `idx_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: settings
-- ===============================================
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `updated_at`) VALUES
(1, 'restaurant_name', 'Bún Bò Huế Cố Đô', 'string', 'Tên nhà hàng', '2025-11-24 15:53:05'),
(2, 'restaurant_phone', '0901234567', 'string', 'Số điện thoại', '2025-11-24 15:53:05'),
(3, 'restaurant_email', 'contact@bunbohuecodo.vn', 'string', 'Email liên hệ', '2025-11-24 15:53:05'),
(4, 'restaurant_address', '123 Đường Huỳnh Thúc Kháng, TP Huế', 'string', 'Địa chỉ', '2025-11-24 15:53:05'),
(5, 'delivery_fee', '20000', 'number', 'Phí giao hàng', '2025-11-24 15:53:05'),
(6, 'free_ship_threshold', '150000', 'number', 'Miễn phí ship từ', '2025-11-24 15:53:05'),
(7, 'business_hours', '{\"open\": \"07:00\", \"close\": \"22:00\"}', 'json', 'Giờ mở cửa', '2025-11-24 15:53:05'),
(8, 'tax_rate', '0', 'number', 'Thuế VAT (%)', '2025-11-24 15:53:05'),
(9, 'loyalty_points_rate', '1000', 'number', 'Tích điểm: 1000đ = 1 điểm', '2025-11-24 15:53:05');

-- ===============================================
-- Table: sms_logs
-- ===============================================
CREATE TABLE `sms_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `message_type` enum('order_status','order_confirmation','reservation_confirmation','marketing','other') DEFAULT 'order_status',
  `message_content` text DEFAULT NULL,
  `status` enum('sent','failed','pending') DEFAULT 'pending',
  `error_message` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `provider` varchar(50) DEFAULT 'esms',
  `message_id` varchar(100) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reservation_id` (`reservation_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_phone` (`phone_number`),
  KEY `idx_status` (`status`),
  KEY `idx_sent_at` (`sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- Table: sms_settings
-- ===============================================
CREATE TABLE `sms_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sms_settings` (`id`, `setting_key`, `setting_value`, `description`, `updated_at`, `created_at`) VALUES
(1, 'sms_enabled', 'true', 'Bật/tắt tính năng gửi SMS', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(2, 'auto_send_on_status_change', 'true', 'Tự động gửi SMS khi thay đổi trạng thái đơn hàng', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(3, 'sms_provider', 'esms', 'Nhà cung cấp SMS (esms, viettel, vnpt, speedsms)', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(4, 'sms_api_key', '', 'API Key của nhà cung cấp SMS', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(5, 'sms_secret_key', '', 'Secret Key của nhà cung cấp SMS', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(6, 'sms_brand_name', 'BunBoHue', 'Tên thương hiệu hiển thị trong SMS', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(7, 'send_sms_on_pending', 'false', 'Gửi SMS khi đơn hàng ở trạng thái chờ xác nhận', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(8, 'send_sms_on_confirmed', 'true', 'Gửi SMS khi đơn hàng được xác nhận', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(9, 'send_sms_on_preparing', 'false', 'Gửi SMS khi đơn hàng đang chuẩn bị', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(10, 'send_sms_on_delivering', 'true', 'Gửi SMS khi đơn hàng đang giao', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(11, 'send_sms_on_completed', 'true', 'Gửi SMS khi đơn hàng hoàn thành', '2025-11-25 04:36:28', '2025-11-25 04:36:28'),
(12, 'send_sms_on_cancelled', 'true', 'Gửi SMS khi đơn hàng bị hủy', '2025-11-25 04:36:28', '2025-11-25 04:36:28');

-- ===============================================
-- Table: toppings
-- ===============================================
CREATE TABLE `toppings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `toppings` (`id`, `name`, `price`, `is_available`, `created_at`) VALUES
(1, 'Thêm bò', 20000.00, 1, '2025-11-24 15:53:05'),
(2, 'Thêm chả', 15000.00, 1, '2025-11-24 15:53:05'),
(3, 'Thêm giò heo', 15000.00, 1, '2025-11-24 15:53:05'),
(4, 'Thêm tim', 12000.00, 1, '2025-11-24 15:53:05'),
(5, 'Thêm gan', 12000.00, 1, '2025-11-24 15:53:05'),
(6, 'Bún thêm', 10000.00, 1, '2025-11-24 15:53:05');

-- ===============================================
-- Table: users
-- ===============================================
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('admin','staff','customer') DEFAULT 'customer',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$oOIGxPzZbuKPZfqe9zi57uRiZPZZHC9HfP2Dah6s9FsmogjQhTeuO', 'Quản Trị Viên', 'admin@bunbohuecodo.vn', '0901234567', 'admin', 'active', '2025-11-24 15:53:05', '2025-11-25 11:32:00');

-- ===============================================
-- Triggers
-- ===============================================
DELIMITER $$

CREATE TRIGGER `update_customer_stats` AFTER UPDATE ON `orders` FOR EACH ROW 
BEGIN
    IF NEW.order_status = 'completed' AND OLD.order_status != 'completed' THEN
        IF NEW.customer_id IS NOT NULL THEN
            UPDATE customers 
            SET 
                total_orders = total_orders + 1,
                total_spent = total_spent + NEW.total_amount,
                loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 1000)
            WHERE id = NEW.customer_id;
        END IF;
    END IF;
END$$

DELIMITER ;

-- ===============================================
-- Views
-- ===============================================

CREATE VIEW `daily_sales` AS 
SELECT 
    CAST(`orders`.`created_at` AS DATE) AS `order_date`, 
    COUNT(0) AS `total_orders`, 
    SUM(`orders`.`total_amount`) AS `total_revenue`, 
    AVG(`orders`.`total_amount`) AS `avg_order_value` 
FROM `orders` 
WHERE `orders`.`order_status` <> 'cancelled' 
GROUP BY CAST(`orders`.`created_at` AS DATE);

CREATE VIEW `email_statistics` AS 
SELECT 
    CAST(`email_logs`.`sent_at` AS DATE) AS `date`, 
    COUNT(0) AS `total_emails`, 
    SUM(CASE WHEN `email_logs`.`status` = 'sent' THEN 1 ELSE 0 END) AS `sent_count`, 
    SUM(CASE WHEN `email_logs`.`status` = 'failed' THEN 1 ELSE 0 END) AS `failed_count`, 
    SUM(CASE WHEN `email_logs`.`status` = 'pending' THEN 1 ELSE 0 END) AS `pending_count` 
FROM `email_logs` 
GROUP BY CAST(`email_logs`.`sent_at` AS DATE) 
ORDER BY CAST(`email_logs`.`sent_at` AS DATE) DESC;

CREATE VIEW `order_details_full` AS 
SELECT 
    `o`.`id` AS `order_id`, 
    `o`.`order_number` AS `order_number`, 
    `o`.`customer_name` AS `customer_name`, 
    `o`.`customer_phone` AS `customer_phone`, 
    `o`.`order_type` AS `order_type`, 
    `o`.`order_status` AS `order_status`, 
    `o`.`payment_status` AS `payment_status`, 
    `o`.`total_amount` AS `total_amount`, 
    `o`.`created_at` AS `created_at`, 
    `oi`.`item_name` AS `item_name`, 
    `oi`.`quantity` AS `quantity`, 
    `oi`.`item_price` AS `item_price`, 
    `oi`.`subtotal` AS `subtotal` 
FROM (`orders` `o` LEFT JOIN `order_items` `oi` ON(`o`.`id` = `oi`.`order_id`));

CREATE VIEW `sms_statistics` AS 
SELECT 
    CAST(`sms_logs`.`sent_at` AS DATE) AS `date`, 
    `sms_logs`.`message_type` AS `message_type`, 
    `sms_logs`.`status` AS `status`, 
    COUNT(0) AS `total_messages`, 
    SUM(`sms_logs`.`cost`) AS `total_cost` 
FROM `sms_logs` 
GROUP BY CAST(`sms_logs`.`sent_at` AS DATE), `sms_logs`.`message_type`, `sms_logs`.`status` 
ORDER BY CAST(`sms_logs`.`sent_at` AS DATE) DESC;

CREATE VIEW `top_selling_items` AS 
SELECT 
    `mi`.`id` AS `id`, 
    `mi`.`name` AS `name`, 
    `mi`.`category` AS `category`, 
    `mi`.`price` AS `price`, 
    COUNT(`oi`.`id`) AS `times_ordered`, 
    SUM(`oi`.`quantity`) AS `total_quantity`, 
    SUM(`oi`.`subtotal`) AS `total_revenue` 
FROM (`menu_items` `mi` LEFT JOIN `order_items` `oi` ON(`mi`.`id` = `oi`.`menu_item_id`)) 
GROUP BY `mi`.`id` 
ORDER BY SUM(`oi`.`quantity`) DESC;

-- ===============================================
-- Foreign Keys
-- ===============================================

ALTER TABLE `combo_items`
  ADD CONSTRAINT `combo_items_ibfk_1` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `combo_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

ALTER TABLE `email_logs`
  ADD CONSTRAINT `email_logs_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `email_logs_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE;

ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

ALTER TABLE `sms_logs`
  ADD CONSTRAINT `sms_logs_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sms_logs_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE;

COMMIT;

-- ===============================================
-- End of SQL Script
-- ===============================================
