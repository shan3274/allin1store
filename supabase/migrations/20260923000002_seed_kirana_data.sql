-- ==============================================================================
-- ALLIN1STORE: SEED DATA FOR KIRANA STORE
-- Inserts essential categories, store settings, and initial grocery inventory
-- ==============================================================================

-- 1. Insert Default Store Settings if not exists
INSERT INTO store_settings (
    store_name, tagline, phone, email, address, city, state, pincode,
    delivery_radius_km, delivery_charge, free_delivery_above, min_order_amount, is_store_open
) VALUES (
    'Apna Kirana Store',
    'Fresh Groceries & Daily Needs Delivered Fast',
    '+91 9876543210',
    'contact@apnakiranastore.com',
    'Shop No. 4, Main Market, Sector 12',
    'Ghaziabad',
    'Uttar Pradesh',
    '201001',
    5.0,
    25.00,
    499.00,
    99.00,
    true
) ON CONFLICT DO NOTHING;

-- 2. Insert Core Kirana Categories
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Atta & Flour', 'atta-flour', 'Fresh chakki atta, maida, sooji and besan', 1, true),
('Rice & Grains', 'rice-grains', 'Basmati rice, daily kolam, poha and dalia', 2, true),
('Pulses & Dal', 'pulses-dal', 'Toor dal, moong, chana, urad and rajma', 3, true),
('Oil & Ghee', 'oil-ghee', 'Mustard oil, refined sunflower, and pure desi cow ghee', 4, true),
('Spices & Masala', 'spices-masala', 'Haldi, mirch, dhaniya, jeera, and garam masala', 5, true),
('Salt & Sugar', 'salt-sugar', 'Tata salt, sendha namak, and refined sugar', 6, true),
('Dairy & Bakery', 'dairy-bakery', 'Fresh milk, curd, paneer, and bread', 7, true),
('Biscuits & Snacks', 'biscuits-snacks', 'Cookies, namkeen, chips, and rusk', 8, true),
('Tea & Coffee', 'tea-coffee', 'Chai patti, green tea, and instant coffee', 9, true),
('Household & Cleaning', 'household-cleaning', 'Detergents, dishwash, soaps, and floor cleaners', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Popular Kirana Products
DO $$
DECLARE
    v_cat_atta UUID;
    v_cat_rice UUID;
    v_cat_dal UUID;
    v_cat_oil UUID;
    v_cat_spices UUID;
    v_cat_sugar UUID;
    v_cat_dairy UUID;
    v_cat_tea UUID;
BEGIN
    SELECT id INTO v_cat_atta FROM categories WHERE slug = 'atta-flour' LIMIT 1;
    SELECT id INTO v_cat_rice FROM categories WHERE slug = 'rice-grains' LIMIT 1;
    SELECT id INTO v_cat_dal FROM categories WHERE slug = 'pulses-dal' LIMIT 1;
    SELECT id INTO v_cat_oil FROM categories WHERE slug = 'oil-ghee' LIMIT 1;
    SELECT id INTO v_cat_spices FROM categories WHERE slug = 'spices-masala' LIMIT 1;
    SELECT id INTO v_cat_sugar FROM categories WHERE slug = 'salt-sugar' LIMIT 1;
    SELECT id INTO v_cat_dairy FROM categories WHERE slug = 'dairy-bakery' LIMIT 1;
    SELECT id INTO v_cat_tea FROM categories WHERE slug = 'tea-coffee' LIMIT 1;

    -- Atta Products
    INSERT INTO products (category_id, name, slug, brand, unit, weight_volume, mrp, selling_price, cost_price, stock_quantity, min_stock_alert, is_active, is_featured, barcode)
    VALUES 
    (v_cat_atta, 'Aashirvaad Shudh Chakki Atta', 'aashirvaad-shudh-chakki-atta-5kg', 'Aashirvaad', 'kg', '5 kg', 270.00, 245.00, 220.00, 50, 10, true, true, '890103000001'),
    (v_cat_atta, 'Fortune Chakki Fresh Atta', 'fortune-chakki-fresh-atta-10kg', 'Fortune', 'kg', '10 kg', 495.00, 440.00, 390.00, 30, 5, true, true, '890103000002'),
    (v_cat_atta, 'Rajdhani Besan (Gram Flour)', 'rajdhani-besan-500g', 'Rajdhani', 'g', '500 g', 65.00, 55.00, 46.00, 40, 8, true, false, '890103000003')
    ON CONFLICT (slug) DO NOTHING;

    -- Rice & Grains
    INSERT INTO products (category_id, name, slug, brand, unit, weight_volume, mrp, selling_price, cost_price, stock_quantity, min_stock_alert, is_active, is_featured, barcode)
    VALUES 
    (v_cat_rice, 'Fortune Everyday Basmati Rice', 'fortune-everyday-basmati-rice-1kg', 'Fortune', 'kg', '1 kg', 115.00, 95.00, 80.00, 60, 10, true, true, '890103000004'),
    (v_cat_rice, 'Daawat Rozana Gold Basmati Rice', 'daawat-rozana-gold-5kg', 'Daawat', 'kg', '5 kg', 485.00, 410.00, 360.00, 25, 5, true, true, '890103000005')
    ON CONFLICT (slug) DO NOTHING;

    -- Dal & Pulses
    INSERT INTO products (category_id, name, slug, brand, unit, weight_volume, mrp, selling_price, cost_price, stock_quantity, min_stock_alert, is_active, is_featured, barcode)
    VALUES 
    (v_cat_dal, 'Tata Sampann Unpolished Toor Dal', 'tata-sampann-toor-dal-1kg', 'Tata Sampann', 'kg', '1 kg', 195.00, 175.00, 155.00, 45, 10, true, true, '890103000006'),
    (v_cat_dal, 'Premium Moong Dal Dhuli', 'premium-moong-dal-dhuli-1kg', 'Local Choice', 'kg', '1 kg', 140.00, 120.00, 102.00, 40, 8, true, false, '890103000007'),
    (v_cat_dal, 'Tata Sampann Chana Dal', 'tata-sampann-chana-dal-1kg', 'Tata Sampann', 'kg', '1 kg', 110.00, 96.00, 82.00, 35, 8, true, false, '890103000008')
    ON CONFLICT (slug) DO NOTHING;

    -- Oil & Ghee
    INSERT INTO products (category_id, name, slug, brand, unit, weight_volume, mrp, selling_price, cost_price, stock_quantity, min_stock_alert, is_active, is_featured, barcode)
    VALUES 
    (v_cat_oil, 'Fortune Premium Kachi Ghani Mustard Oil', 'fortune-mustard-oil-1l', 'Fortune', 'l', '1 L Pouch', 165.00, 145.00, 128.00, 75, 15, true, true, '890103000009'),
    (v_cat_oil, 'Amul Pure Desi Ghee Tin', 'amul-pure-ghee-1l', 'Amul', 'l', '1 L', 650.00, 610.00, 565.00, 20, 5, true, true, '890103000010')
    ON CONFLICT (slug) DO NOTHING;

    -- Salt & Sugar
    INSERT INTO products (category_id, name, slug, brand, unit, weight_volume, mrp, selling_price, cost_price, stock_quantity, min_stock_alert, is_active, is_featured, barcode)
    VALUES 
    (v_cat_sugar, 'Tata Salt Vacuum Evaporated Iodised', 'tata-salt-1kg', 'Tata', 'kg', '1 kg', 28.00, 26.00, 22.00, 120, 20, true, true, '890103000011'),
    (v_cat_sugar, 'Madhur Pure & Hygienic Refined Sugar', 'madhur-sugar-1kg', 'Madhur', 'kg', '1 kg', 58.00, 50.00, 44.00, 80, 15, true, true, '890103000012')
    ON CONFLICT (slug) DO NOTHING;

    -- Tea & Beverages
    INSERT INTO products (category_id, name, slug, brand, unit, weight_volume, mrp, selling_price, cost_price, stock_quantity, min_stock_alert, is_active, is_featured, barcode)
    VALUES 
    (v_cat_tea, 'Tata Tea Premium Desh Ki Chai', 'tata-tea-premium-500g', 'Tata Tea', 'g', '500 g', 260.00, 225.00, 195.00, 50, 10, true, true, '890103000013'),
    (v_cat_tea, 'Red Label Strong Blend Tea', 'red-label-tea-250g', 'Brooke Bond', 'g', '250 g', 140.00, 125.00, 108.00, 40, 10, true, false, '890103000014')
    ON CONFLICT (slug) DO NOTHING;
END $$;
