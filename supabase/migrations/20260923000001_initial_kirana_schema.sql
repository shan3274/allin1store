-- ==============================================================================
-- ALLIN1STORE: COMPLETE PRODUCTION DATABASE SCHEMA FOR KIRANA COMMERCE + POS
-- Compatible with Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('owner', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cod', 'upi', 'card', 'netbanking', 'wallet', 'cash_pos');
CREATE TYPE order_type AS ENUM ('online_delivery', 'online_pickup', 'pos_counter');
CREATE TYPE inventory_movement_type AS ENUM ('purchase_in', 'sale_out', 'pos_sale_out', 'return_in', 'damage_loss', 'adjustment');

-- 3. PROFILES / USERS
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. STORE SETTINGS (Single Store Instance)
CREATE TABLE store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Apna Kirana Store',
    tagline TEXT DEFAULT 'Fresh Groceries Daily',
    phone TEXT NOT NULL DEFAULT '+91 9876543210',
    email TEXT,
    address TEXT NOT NULL DEFAULT 'Main Market, Road No 1',
    city TEXT NOT NULL DEFAULT 'New Delhi',
    state TEXT NOT NULL DEFAULT 'Delhi',
    pincode TEXT NOT NULL DEFAULT '110001',
    latitude DOUBLE PRECISION DEFAULT 28.6139,
    longitude DOUBLE PRECISION DEFAULT 77.2090,
    delivery_radius_km NUMERIC(5,2) DEFAULT 5.0,
    delivery_charge NUMERIC(10,2) DEFAULT 30.0,
    free_delivery_above NUMERIC(10,2) DEFAULT 499.0,
    min_order_amount NUMERIC(10,2) DEFAULT 99.0,
    is_store_open BOOLEAN DEFAULT true,
    opening_time TIME DEFAULT '07:00:00',
    closing_time TIME DEFAULT '22:00:00',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT,
    description TEXT,
    image_url TEXT,
    barcode TEXT UNIQUE,
    sku TEXT UNIQUE,
    hsn_code TEXT,
    unit TEXT NOT NULL DEFAULT 'kg', -- kg, g, l, ml, piece, pack
    weight_volume TEXT, -- e.g. "1 kg", "500 ml"
    
    mrp NUMERIC(10,2) NOT NULL,
    selling_price NUMERIC(10,2) NOT NULL,
    cost_price NUMERIC(10,2) DEFAULT 0, -- hidden from customers
    gst_rate NUMERIC(5,2) DEFAULT 0,
    
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_alert INT DEFAULT 5,
    
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. CUSTOMER ADDRESSES
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    house_flat TEXT NOT NULL,
    street_area TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    address_type TEXT DEFAULT 'home', -- 'home', 'work', 'other'
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number BIGSERIAL UNIQUE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    order_type order_type NOT NULL DEFAULT 'online_delivery',
    status order_status NOT NULL DEFAULT 'pending',
    
    -- Pricing
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_charge NUMERIC(10,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    
    -- Payment
    payment_method payment_method NOT NULL DEFAULT 'cod',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_transaction_id TEXT,
    
    -- Address Snapshot
    shipping_name TEXT,
    shipping_phone TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_pincode TEXT,
    
    notes TEXT,
    cancelled_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. INVENTORY MOVEMENTS (Ledger / Audit trail)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type inventory_movement_type NOT NULL,
    quantity_changed INT NOT NULL, -- negative for sales, positive for purchases/returns
    quantity_after INT NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. BANNERS / PROMOTIONS
CREATE TABLE store_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_banners ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'owner'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view & update their own profile, owner can view all
CREATE POLICY "Public profiles can view own" ON profiles
    FOR SELECT USING (auth.uid() = id OR is_owner());
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Categories: Public readable, owner editable
CREATE POLICY "Categories are public readable" ON categories
    FOR SELECT USING (is_active = true OR is_owner());
CREATE POLICY "Owner can manage categories" ON categories
    FOR ALL USING (is_owner());

-- Products: Public can view active products, owner full access
CREATE POLICY "Active products public readable" ON products
    FOR SELECT USING (is_active = true OR is_owner());
CREATE POLICY "Owner can manage products" ON products
    FOR ALL USING (is_owner());

-- Customer Addresses: Users view/manage own
CREATE POLICY "Users manage own addresses" ON customer_addresses
    FOR ALL USING (auth.uid() = user_id OR is_owner());

-- Store Settings: Public readable, owner editable
CREATE POLICY "Settings are public readable" ON store_settings
    FOR SELECT USING (true);
CREATE POLICY "Owner can edit settings" ON store_settings
    FOR ALL USING (is_owner());

-- Orders: Users view own orders, owner views/manages all
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR is_owner());
CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR is_owner());
CREATE POLICY "Owner can manage orders" ON orders
    FOR ALL USING (is_owner());

-- Order Items
CREATE POLICY "Users view order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR is_owner())
        )
    );
CREATE POLICY "Users insert order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL OR is_owner())
        )
    );

-- Banners: Public readable, owner editable
CREATE POLICY "Banners are public readable" ON store_banners
    FOR SELECT USING (is_active = true OR is_owner());
CREATE POLICY "Owner can manage banners" ON store_banners
    FOR ALL USING (is_owner());

-- Inventory: Owner only
CREATE POLICY "Owner can view/manage inventory movements" ON inventory_movements
    FOR ALL USING (is_owner());

-- 13. ATOMIC STORED PROCEDURE: CHECKOUT / CREATE ORDER WITH STOCK LOCK
CREATE OR REPLACE FUNCTION place_kirana_order(
    p_user_id UUID,
    p_order_type order_type,
    p_items JSONB, -- Array of [{ "product_id": "...", "quantity": 1 }]
    p_shipping_name TEXT,
    p_shipping_phone TEXT,
    p_shipping_address TEXT,
    p_shipping_city TEXT,
    p_shipping_pincode TEXT,
    p_payment_method payment_method,
    p_delivery_charge NUMERIC
) RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product RECORD;
    v_subtotal NUMERIC(10,2) := 0;
    v_total NUMERIC(10,2) := 0;
    v_item_total NUMERIC(10,2) := 0;
BEGIN
    -- 1. Create order shell first
    INSERT INTO orders (
        user_id,
        order_type,
        status,
        subtotal,
        delivery_charge,
        total_amount,
        payment_method,
        payment_status,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_pincode
    ) VALUES (
        p_user_id,
        p_order_type,
        'pending',
        0,
        p_delivery_charge,
        0,
        p_payment_method,
        CASE WHEN p_payment_method = 'cash_pos' THEN 'paid'::payment_status ELSE 'pending'::payment_status END,
        p_shipping_name,
        p_shipping_phone,
        p_shipping_address,
        p_shipping_city,
        p_shipping_pincode
    ) RETURNING id INTO v_order_id;

    -- 2. Process items, lock row and deduct inventory atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Row lock product for safety
        SELECT * INTO v_product
        FROM products
        WHERE id = (v_item->>'product_id')::UUID
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % not found', (v_item->>'product_id');
        END IF;

        IF v_product.stock_quantity < (v_item->>'quantity')::INT THEN
            RAISE EXCEPTION 'Insufficient stock for % (Available: %, Requested: %)',
                v_product.name, v_product.stock_quantity, (v_item->>'quantity')::INT;
        END IF;

        v_item_total := v_product.selling_price * (v_item->>'quantity')::INT;
        v_subtotal := v_subtotal + v_item_total;

        -- Insert order item
        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total_price
        ) VALUES (
            v_order_id,
            v_product.id,
            v_product.name,
            (v_item->>'quantity')::INT,
            v_product.selling_price,
            v_item_total
        );

        -- Deduct inventory
        UPDATE products
        SET stock_quantity = stock_quantity - (v_item->>'quantity')::INT,
            updated_at = now()
        WHERE id = v_product.id;

        -- Record movement
        INSERT INTO inventory_movements (
            product_id,
            movement_type,
            quantity_changed,
            quantity_after,
            order_id,
            notes
        ) VALUES (
            v_product.id,
            CASE WHEN p_order_type = 'pos_counter' THEN 'pos_sale_out' ELSE 'sale_out' END,
            -(v_item->>'quantity')::INT,
            v_product.stock_quantity - (v_item->>'quantity')::INT,
            v_order_id,
            'Order placed'
        );
    END LOOP;

    -- 3. Calculate final total & update order
    v_total := v_subtotal + p_delivery_charge;

    UPDATE orders
    SET subtotal = v_subtotal,
        total_amount = v_total
    WHERE id = v_order_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
