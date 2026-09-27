# 🛒 SINGLE-STORE KIRANA — COMPLETE PRODUCTION MASTER PROMPT

## 0. MASTER INSTRUCTION

Build a **production-ready single-store Kirana Grocery Commerce + Store Management Platform**.

This is for **ONE physical grocery store owned and operated by ONE store owner**.

The system has exactly two primary experiences:

1. **Customer Storefront / PWA**
2. **Store Owner Admin Dashboard**

Additionally, the Owner Dashboard contains an integrated:

3. **POS / Counter Billing System**

Do NOT design this as a multi-vendor marketplace.

Do NOT build a multi-store SaaS.

Do NOT create separate supplier portals.

Do NOT create unnecessary employee-management complexity.

The architecture should be clean, secure, scalable and maintainable while remaining optimized for a single physical store.

The final product must feel like a real commercial grocery business application, not a demo, template or AI-generated CRUD application.

---

# 1. PRODUCT OBJECTIVE

Customers should be able to:

```text
Open Store
↓
Browse Grocery Products
↓
Search / Filter
↓
Add Products
↓
Checkout
↓
Select Address
↓
Choose Delivery
↓
Pay Online / COD
↓
Receive Order
↓
Track Order
↓
Review / Reorder
```

Store owner should be able to:

```text
Login
↓
See Business Dashboard
↓
Manage Products
↓
Manage Inventory
↓
Receive Purchases
↓
Manage Orders
↓
Process Delivery
↓
Manage Customers
↓
Handle Returns / Refunds
↓
Manage POS Sales
↓
Track Expenses
↓
See Revenue / Profit
↓
Manage Offers
↓
View Reports
```

---

# 2. TECHNOLOGY STACK

Use:

## Frontend

* Next.js 15+
* React
* TypeScript preferred
* Tailwind CSS
* shadcn/ui
* Framer Motion

## Backend

* Next.js Server Actions / API Routes
* Supabase
* PostgreSQL

## Authentication

* Supabase Auth

Support:

* Customer phone/email authentication
* Owner secure authentication

## Database

PostgreSQL via Supabase.

## Storage

Supabase Storage.

Use separate storage buckets for:

```text
product-images
category-images
store-assets
customer-assets
invoice-files
```

## Payments

Razorpay.

Support:

* UPI
* Cards
* Net Banking
* Wallets where available
* Cash on Delivery

## Notifications

Architecture ready for:

* Web Push
* Firebase Cloud Messaging
* Email
* WhatsApp integration

## Maps

Google Maps API / equivalent.

## PWA

Implement:

* Web App Manifest
* Service Worker
* Install prompt
* Offline fallback
* App icons
* Splash screen
* Standalone mode

---

# 3. USER TYPES

Only two primary user types.

## CUSTOMER

Can:

* Browse
* Search
* Add to cart
* Checkout
* Order
* Track
* Review
* Reorder
* Manage profile

## STORE OWNER

Has complete access to:

* Orders
* Products
* Inventory
* Purchases
* POS
* Customers
* Payments
* Delivery
* Coupons
* Offers
* Expenses
* Reports
* Settings

No complex staff-role system is required.

The Owner is the single authority.

---

# 4. AUTHENTICATION

## Customer Authentication

Support:

* Mobile number
* OTP
* Email optional

Customer account fields:

```text
id
name
phone
email
profile_image
status
created_at
updated_at
last_login
```

## Owner Authentication

Use secure authentication.

Owner login:

```text
Email
Password
```

Add:

* Strong password validation
* Session management
* Logout
* Forgot password
* Optional 2FA architecture
* Login activity
* Rate limiting

Never expose owner credentials.

---

# 5. CUSTOMER APP — GLOBAL NAVIGATION

Mobile bottom navigation:

```text
Home
Categories
Orders
Cart
Profile
```

Desktop navigation:

```text
Logo
Search
Categories
Offers
Orders
Profile
Cart
```

Sticky cart button on mobile when cart contains items.

---

# 6. CUSTOMER HOME PAGE

Create a premium grocery shopping experience.

## Header

Show:

* Store logo
* Store name
* Current delivery location
* Search
* Cart
* Profile

Example:

```text
Deliver to
Home • Ghaziabad

[ Search groceries... ]

🛒 3
```

## Hero

Admin-controlled banners.

Examples:

```text
Fresh groceries delivered to your door

Up to 20% OFF
Shop Now
```

Banner management must be available from Owner Dashboard.

---

# 7. HOME PAGE SECTIONS

Dynamic sections:

```text
Shop by Category

Popular Products

Today's Deals

Best Sellers

New Arrivals

Recommended For You

Frequently Bought Together

Recently Viewed

Offers

Featured Products
```

Owner can control:

* Visibility
* Ordering
* Products
* Banner
* Heading

---

# 8. GROCERY CATEGORIES

Initial categories:

```text
Atta & Flour
Rice & Grains
Pulses & Dal
Oil & Ghee
Spices & Masala
Salt & Sugar
Dairy
Bread & Bakery
Biscuits
Snacks
Namkeen
Chocolates
Beverages
Tea & Coffee
Instant Food
Noodles & Pasta
Sauces & Spreads
Dry Fruits
Fruits & Vegetables
Personal Care
Hair Care
Skin Care
Baby Care
Household
Cleaning
Laundry
Kitchen
Stationery
Pet Care
Other
```

Categories must be editable from Owner Dashboard.

---

# 9. CATEGORY PAGE

Show:

* Category name
* Category image
* Product count
* Products
* Filters
* Sort

Filters:

```text
Price
Brand
Discount
Availability
Rating
Weight
```

Sort:

```text
Relevance
Price Low → High
Price High → Low
Discount
Popular
Newest
```

---

# 10. PRODUCT SEARCH

Implement fast search.

Search by:

* Product name
* Brand
* SKU
* Barcode
* Category
* Search keywords
* Synonyms

Examples:

Searching:

```text
atta
```

can find:

```text
Aashirvaad Atta
Fortune Chakki Atta
Pillsbury Atta
```

Search UI should include:

* Recent searches
* Popular searches
* Search suggestions
* Category suggestions
* Product suggestions

---

# 11. PRODUCT CARD

Every product card:

```text
Image

Product Name
Brand
Weight / Quantity

MRP
Selling Price
Discount %

Rating

[ + ADD ]
```

After adding:

```text
[ - ] 2 [ + ]
```

Out of stock:

```text
OUT OF STOCK

Notify Me
```

---

# 12. PRODUCT DETAILS

Product detail page:

```text
Product Images
Product Name
Brand
Rating
Reviews

MRP
Selling Price
Discount

Quantity

Description
Highlights
Ingredients
Manufacturer
Country of Origin
Weight
Unit

Availability

Add to Cart
Buy Now
Wishlist

Related Products
Frequently Bought Together
Reviews
```

Support optional product fields:

```text
HSN
GST Rate
Barcode
SKU
Batch
Expiry
```

Do not expose internal purchase price.

---

# 13. PRODUCT TYPES

System should support:

### Simple Product

Example:

```text
Sugar 1 KG
```

### Multiple Variant Product

Example:

```text
Sugar
1 KG
5 KG
10 KG
```

### Weight-based Product

Example:

```text
Rice
500g
1KG
5KG
```

Architecture should allow variants without duplicating unnecessary data.

---

# 14. CART

Cart must persist.

Cart contains:

```text
Product
Variant
Quantity
MRP
Selling Price
Discount
Tax
Subtotal
```

Cart operations:

* Add
* Remove
* Increase
* Decrease
* Clear
* Save for later

Cart should survive:

* Refresh
* App restart
* Login

For logged-in users, sync with backend.

---

# 15. CART VALIDATION

Before checkout, always validate server-side:

```text
Product exists
Product active
Product available
Stock available
Current price
Current discount
Coupon validity
Store open
Delivery availability
```

Never trust prices or stock received from frontend.

---

# 16. CART STOCK RESERVATION

Implement safe inventory handling.

When order is being placed:

```text
Check Stock
↓
Reserve Stock
↓
Create Order
↓
Process Payment
↓
Confirm Stock Deduction
```

If payment fails:

```text
Release Reservation
```

Prevent overselling during simultaneous orders.

---

# 17. CHECKOUT

Checkout should be simple and mobile friendly.

Steps:

```text
Cart
↓
Address
↓
Delivery
↓
Coupon
↓
Payment
↓
Order Confirmation
```

---

# 18. CUSTOMER ADDRESS

Customer can:

* Add
* Edit
* Delete
* Select default

Fields:

```text
Full Name
Phone
House / Flat
Street
Area
Landmark
City
State
Pincode
Latitude
Longitude
Address Type
```

Address types:

```text
Home
Work
Other
```

---

# 19. DELIVERY SERVICE AREA

Owner configures:

```text
Store Location
Delivery Radius
Minimum Order
Delivery Charge
Free Delivery Threshold
```

Example:

```text
0–2 KM = ₹20
2–5 KM = ₹40
5+ KM = Not Available
```

System calculates customer distance.

If outside service area:

```text
We currently don't deliver to this location.
```

---

# 20. DELIVERY CHARGES

Support:

### Fixed fee

```text
₹30 per order
```

### Distance-based

```text
0–2 KM = ₹20
2–5 KM = ₹40
```

### Free delivery

```text
Orders above ₹499
```

Owner can configure all values.

---

# 21. STORE HOURS

Owner configures:

```text
Opening Time
Closing Time
Working Days
```

Customer can browse when store is closed.

Checkout should show:

```text
Store currently closed.

Opens at 8:00 AM.
```

Optional:

```text
Schedule for later
```

---

# 22. DELIVERY SLOTS

Support:

```text
ASAP

Today
8–9 AM
9–10 AM
10–11 AM

Tomorrow
...
```

Owner can configure:

* Slot duration
* Maximum orders per slot
* Available days
* Delivery capacity

---

# 23. PAYMENT SYSTEM

Integrate Razorpay.

Payment methods:

```text
UPI
Credit Card
Debit Card
Net Banking
Wallets
COD
```

Payment states:

```text
PENDING
PROCESSING
PAID
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

Verify payments server-side.

Implement:

* Signature verification
* Webhook verification
* Payment reconciliation
* Failed payment handling
* Duplicate webhook protection

---

# 24. COD

COD configuration:

```text
Enable/Disable COD
Maximum COD Order Amount
Minimum COD Order Amount
```

Track:

```text
COD Pending
COD Collected
COD Failed
```

---

# 25. ORDER CREATION

Generate unique order number.

Format:

```text
KS-20260923-000001
```

Order stores:

```text
Order ID
Customer ID
Items
Quantity
Price Snapshot
Discount Snapshot
Tax Snapshot
Address Snapshot
Delivery Fee
Coupon
Payment Method
Payment Status
Order Status
Total
Created At
```

Price must be stored as a snapshot so historical orders don't change when product prices change later.

---

# 26. ORDER STATUS

Primary workflow:

```text
PLACED
↓
CONFIRMED
↓
PICKING
↓
PACKED
↓
OUT_FOR_DELIVERY
↓
DELIVERED
```

Other states:

```text
CANCELLED
REJECTED
PAYMENT_FAILED
RETURN_REQUESTED
PARTIALLY_RETURNED
RETURNED
REFUNDED
```

---

# 27. CUSTOMER ORDER TRACKING

Show:

```text
Order Placed ✓
Order Confirmed ✓
Picking ✓
Packed ✓
Out for Delivery ●
Delivered ○
```

Display:

* Order number
* Items
* Total
* Address
* Payment
* ETA
* Delivery information

---

# 28. ORDER HISTORY

Customer can:

* View all orders
* Search orders
* Filter by date/status
* Open order
* Download invoice
* Reorder
* Report issue

---

# 29. REORDER

Customer clicks:

```text
REORDER
```

System checks:

```text
Current Stock
Current Price
Product Availability
```

Unavailable items are excluded with explanation.

Example:

```text
8 products added.
2 products are currently unavailable.
```

---

# 30. CUSTOMER PROFILE

Profile:

```text
Name
Phone
Email
Profile Image
```

Sections:

```text
My Orders
Addresses
Wishlist
Coupons
Notifications
Reviews
Support
Settings
Logout
```

---

# 31. WISHLIST

Customer can:

* Add product
* Remove product
* Move to cart

If wishlist product becomes unavailable:

```text
Currently unavailable
```

---

# 32. RECENTLY VIEWED

Store recently viewed products.

Show:

```text
Recently Viewed
```

Limit storage to reasonable number of products.

---

# 33. PRODUCT REVIEWS

Customer can review purchased products.

Fields:

```text
Rating
Review
Images
Created At
```

Only verified purchasers should be allowed to review.

Owner can:

* View
* Hide
* Moderate
* Reply

---

# 34. SUPPORT

Customer support page.

Categories:

```text
Missing Item
Wrong Item
Damaged Product
Payment Issue
Delivery Issue
Refund
Other
```

Customer can create ticket.

Ticket states:

```text
OPEN
IN_PROGRESS
RESOLVED
CLOSED
```

Owner can respond.

---

# 35. OWNER DASHBOARD

Create professional desktop-first dashboard.

Sidebar:

```text
Dashboard
Orders
POS
Products
Categories
Inventory
Purchases
Suppliers
Customers
Delivery
Coupons
Offers
Payments
Expenses
Reports
Reviews
Notifications
Store Settings
Audit Logs
```

On mobile, use responsive navigation.

---

# 36. OWNER DASHBOARD — MAIN KPIs

Display:

```text
Today's Sales
Today's Orders
Today's Profit
Average Order Value

Pending Orders
Out for Delivery

Low Stock
Out of Stock
Expiring Soon

New Customers
Returning Customers
```

Every number must come from actual database records.

No random hardcoded statistics.

---

# 37. SALES ANALYTICS

Charts:

```text
Sales Today
Sales This Week
Sales This Month
Sales Custom Range
```

Compare:

```text
Current Period
Previous Period
```

Do not fake percentage changes.

---

# 38. ORDER ANALYTICS

Show:

```text
Total Orders
Completed Orders
Pending Orders
Cancelled Orders
Returned Orders
Average Order Value
```

Charts:

* Orders per day
* Orders per hour
* Status distribution

---

# 39. PRODUCT ANALYTICS

Show:

```text
Best Selling Products
Slow Moving Products
Highest Revenue Products
Highest Margin Products
Most Ordered Products
```

Filters:

```text
Today
7 Days
30 Days
Custom
```

---

# 40. CUSTOMER ANALYTICS

Show:

```text
Total Customers
New Customers
Returning Customers
Average Customer Spend
Average Orders per Customer
```

Segments:

```text
New
Active
Returning
High Value
Inactive
```

These are behavioral labels, not manually assigned statuses.

---

# 41. ORDER MANAGEMENT

Owner sees:

```text
Order ID
Customer
Items
Amount
Payment
Status
Delivery
Created At
```

Filters:

```text
Today
Date Range
Status
Payment Method
Customer
Amount
```

Search:

```text
Order ID
Customer Name
Phone
```

---

# 42. ORDER DETAIL — OWNER

Complete order page:

## Customer

```text
Name
Phone
Email
```

## Items

```text
Product
SKU
Quantity
Unit Price
Discount
Tax
Total
```

## Delivery

```text
Address
Distance
Slot
ETA
```

## Payment

```text
Payment ID
Method
Amount
Status
```

## Timeline

```text
Order Created
Payment
Confirmed
Picking
Packed
Out for Delivery
Delivered
```

---

# 43. ORDER MODIFICATION

Before packing, owner can:

* Replace unavailable item
* Remove item
* Change quantity
* Add item

Any modification must:

* Recalculate totals
* Revalidate stock
* Recalculate tax
* Recalculate discount
* Record audit log
* Handle payment difference/refund if required

After delivery, order must become immutable except through return/refund workflow.

---

# 44. ORDER CANCELLATION

Cancellation rules:

Customer can cancel only according to configured order stage.

Owner can cancel with reason.

Reasons:

```text
Out of Stock
Store Closed
Customer Request
Delivery Issue
Other
```

If prepaid:

```text
Create Refund
```

---

# 45. INVENTORY MANAGEMENT

Inventory dashboard:

```text
Product
SKU
Category
Current Stock
Reserved Stock
Available Stock
Minimum Stock
Maximum Stock
Purchase Price
Selling Price
Stock Value
Status
```

Formula:

```text
Available Stock =
Current Stock - Reserved Stock
```

---

# 46. INVENTORY STATUS

```text
IN STOCK
LOW STOCK
OUT OF STOCK
OVERSTOCK
EXPIRED
EXPIRING SOON
```

---

# 47. STOCK ADJUSTMENT

Owner can manually adjust stock.

Required:

```text
Product
Quantity
Adjustment Type
Reason
Notes
```

Reasons:

```text
Damaged
Expired
Lost
Found
Manual Correction
Opening Stock
Other
```

Every adjustment must create inventory movement.

Never silently modify stock.

---

# 48. INVENTORY LEDGER

Every stock movement:

```text
Date
Product
Type
Quantity
Previous Stock
New Stock
Reference
Reason
Created By
```

Examples:

```text
+100 Purchase
-2 Online Order
-1 POS Sale
-2 Damaged
+3 Stock Correction
```

---

# 49. PURCHASE MANAGEMENT

Owner can record purchases from suppliers.

Purchase flow:

```text
Create Purchase
↓
Select Supplier
↓
Add Products
↓
Enter Quantity
↓
Enter Purchase Price
↓
Enter Tax
↓
Enter Invoice Number
↓
Receive Stock
```

When purchase is received:

```text
Inventory increases
```

---

# 50. SUPPLIER RECORD

Supplier information:

```text
Supplier Name
Phone
Email
Address
GSTIN
Notes
```

Purchase history:

```text
Total Purchases
Pending Amount
Paid Amount
Last Purchase
```

No supplier portal required.

---

# 51. PURCHASE INVOICE

Store:

```text
Supplier Invoice Number
Invoice Date
Products
Quantity
Purchase Price
Tax
Discount
Total
Payment Status
```

Allow invoice attachment.

---

# 52. PURCHASE RETURNS

Owner can return stock to supplier.

Flow:

```text
Purchase
↓
Select Product
↓
Return Quantity
↓
Reason
↓
Stock Decrease
↓
Return Record
```

---

# 53. EXPIRY MANAGEMENT

Support product batches where applicable.

Batch:

```text
Batch Number
Manufacturing Date
Expiry Date
Quantity
Purchase Date
Purchase Price
```

Dashboard:

```text
Expired
Expiring in 7 Days
Expiring in 30 Days
```

---

# 54. FEFO

For expiry-sensitive products, use:

**First Expiry, First Out**

When fulfilling orders, system should prioritize inventory batches with earlier expiry where practical.

---

# 55. BARCODE

Product supports:

```text
SKU
Barcode
```

Owner can:

* Search barcode
* Scan barcode
* Assign barcode
* Update inventory using barcode

Prepare architecture for camera scanning and USB scanner.

---

# 56. POS / COUNTER BILLING

Integrated POS inside Owner Dashboard.

POS screen:

```text
Search / Scan Product

Cart
────────────────
Product
Qty
Price
Total
────────────────

Subtotal
Discount
Tax
Grand Total

Cash
UPI
Card
```

Actions:

```text
Hold Sale
Resume Sale
Complete Sale
Print Receipt
```

---

# 57. POS STOCK

Every completed POS sale automatically:

```text
Decrease Inventory
Create Sale Record
Create Payment Record
Create Inventory Movement
```

POS sale and online sale must use the same inventory source.

---

# 58. POS CUSTOMER

Customer is optional.

Owner can:

```text
Walk-in Customer
```

or attach existing customer.

If customer is attached:

* Sale appears in history
* Spending updates
* Loyalty can update

---

# 59. POS RETURNS

Owner can search:

```text
Receipt Number
Order Number
Customer
```

Then:

```text
Select Items
Select Return Quantity
Select Reason
Refund
Inventory Adjustment
```

---

# 60. RECEIPT

Generate printable receipt:

```text
Store Logo
Store Name
Address
Phone
GSTIN

Receipt Number
Date

Products
Quantity
Price
Discount
Tax

Total
Payment Method

Thank You
```

---

# 61. EXPENSE MANAGEMENT

Owner can record business expenses.

Categories:

```text
Rent
Electricity
Water
Internet
Packaging
Delivery
Maintenance
Salary
Marketing
Miscellaneous
```

Fields:

```text
Expense Category
Amount
Date
Payment Method
Description
Attachment
```

---

# 62. PROFIT CALCULATION

Dashboard should calculate business metrics.

Conceptually:

```text
Revenue
- Product Cost
- Discounts
- Refunds
- Delivery Costs
- Business Expenses
= Net Profit
```

Clearly distinguish:

```text
Revenue
Gross Profit
Operating Expenses
Net Profit
```

Do not present estimates as exact accounting figures.

---

# 63. PRODUCT MARGIN

Product stores:

```text
Purchase Price
Selling Price
Discount
Tax
```

Calculate:

```text
Gross Margin
Margin %
```

Owner only.

Never expose purchase cost to customers.

---

# 64. PRODUCT MANAGEMENT — OWNER

Create/edit product:

```text
Product Name
Slug
SKU
Barcode
Brand
Category
Subcategory
Description
Short Description
Images
MRP
Selling Price
Purchase Price
GST
HSN
Unit
Weight
Minimum Stock
Maximum Stock
Status
Featured
Popular
New Arrival
```

---

# 65. PRODUCT STATUS

```text
ACTIVE
INACTIVE
OUT_OF_STOCK
ARCHIVED
```

Archived products should remain in historical orders.

Do not permanently delete products referenced by orders.

---

# 66. CATEGORY MANAGEMENT

Owner can:

* Create
* Edit
* Archive
* Reorder
* Upload image

Fields:

```text
Name
Slug
Image
Description
Sort Order
Status
```

---

# 67. COUPONS

Owner can create:

```text
Coupon Code
Discount Type
Percentage
Fixed Amount
Minimum Order
Maximum Discount
Start Date
End Date
Usage Limit
Per Customer Limit
Applicable Products
Applicable Categories
```

Example:

```text
WELCOME50
10% OFF
Minimum ₹499
Maximum ₹50
```

---

# 68. OFFER ENGINE

Support:

### Product Discount

```text
₹100 → ₹80
```

### Category Discount

```text
Snacks → 10% OFF
```

### Buy One Get One

```text
Buy 1 Get 1
```

### Buy X Get Y

```text
Buy 2 Get 1
```

### Flash Sale

```text
6 PM – 9 PM
```

Offers must have:

```text
Start
End
Status
Conditions
```

---

# 69. COUPON VALIDATION

Validate server-side:

```text
Active
Date
Usage Limit
Customer Limit
Minimum Order
Applicable Products
Applicable Categories
Maximum Discount
```

Prevent coupon stacking unless explicitly configured.

---

# 70. CUSTOMER NOTIFICATIONS

Send:

```text
Order Placed
Order Confirmed
Order Packed
Out for Delivery
Delivered
Cancelled
Refund
Payment Failed
Offer
Coupon
```

Use:

* In-app
* Push
* Email
* WhatsApp-ready architecture

---

# 71. OWNER NOTIFICATIONS

Owner receives:

```text
New Order
Payment Failed
Low Stock
Out of Stock
Expiry Alert
Refund Request
Customer Complaint
```

---

# 72. NOTIFICATION CENTER

Notification states:

```text
Unread
Read
```

Each notification:

```text
Title
Message
Type
Timestamp
Reference
```

---

# 73. LOW STOCK ALERTS

Owner configures per-product:

```text
Minimum Stock
```

When:

```text
Available Stock <= Minimum Stock
```

show:

```text
LOW STOCK
```

---

# 74. OUT OF STOCK

When stock reaches zero:

```text
OUT OF STOCK
```

Customer cannot order.

Optionally:

```text
Notify Me
```

---

# 75. AUTOMATIC INVENTORY EVENTS

Online order:

```text
Stock ↓
```

POS sale:

```text
Stock ↓
```

Purchase received:

```text
Stock ↑
```

Customer return:

```text
Stock ↑
```

Supplier return:

```text
Stock ↓
```

Damage:

```text
Stock ↓
```

Expiry:

```text
Stock ↓
```

Every event creates an inventory movement.

---

# 76. CUSTOMER MANAGEMENT

Owner can view:

```text
Customer Name
Phone
Email
Registration Date
Total Orders
Total Spending
Average Order Value
Last Order
```

---

# 77. CUSTOMER PROFILE — OWNER

Complete customer history:

```text
Basic Information
Orders
Spending
Addresses
Wishlist
Reviews
Coupons Used
Returns
Refunds
Support Tickets
Activity Timeline
```

Timeline example:

```text
Account Created
First Order
Coupon Used
Order Delivered
Review Submitted
Refund Requested
```

---

# 78. CUSTOMER SEGMENTS

Automatically classify behavior:

```text
NEW
ACTIVE
RETURNING
HIGH VALUE
INACTIVE
```

Owner can filter customers by:

```text
Order Count
Total Spending
Last Order
Area
Registration Date
```

---

# 79. LOYALTY SYSTEM

Build optional loyalty infrastructure.

Support:

```text
Points Earned
Points Redeemed
Referral Bonus
Reward
```

Owner settings:

```text
₹100 spent = X points
```

Customer can view:

```text
Available Points
Earned
Redeemed
History
```

---

# 80. DELIVERY MANAGEMENT

Owner dashboard:

```text
Pending
Assigned
Out for Delivery
Delivered
Failed
```

For a single-store operation, delivery assignment can be manually handled by the owner.

Do not build a separate delivery-person portal unless required later.

---

# 81. DELIVERY RECORD

Store:

```text
Order
Customer
Address
Distance
Delivery Fee
Assigned Person/Name
Phone
Status
Started At
Delivered At
```

Delivery status:

```text
PENDING
ASSIGNED
OUT_FOR_DELIVERY
DELIVERED
FAILED
```

---

# 82. DELIVERY FAILURE

Reasons:

```text
Customer Unavailable
Wrong Address
Customer Cancelled
Unable to Reach
Other
```

Record reason.

---

# 83. RETURN / REFUND

Support:

### Full Return

Entire order.

### Partial Return

Selected items.

### Refund

```text
Original Payment Method
Store Credit
Manual Refund
```

Refund status:

```text
PENDING
PROCESSING
COMPLETED
FAILED
```

---

# 84. REFUND SAFETY

Never allow refund greater than paid amount.

Every refund must create:

```text
Refund Record
Audit Log
Payment Record
Order Timeline
```

---

# 85. GST / TAX READY

Make tax configurable.

Product fields:

```text
HSN
GST Rate
Tax Inclusive
Tax Exclusive
```

Invoice should support:

```text
CGST
SGST
IGST
```

based on configured tax rules.

Do not hardcode tax rates globally.

---

# 86. INVOICE

Generate invoice after successful order/sale.

Invoice:

```text
Store Logo
Store Name
Store Address
Phone
GSTIN

Invoice Number
Order Number
Date

Customer Details

Items
Qty
Rate
Discount
Tax
Total

Payment Method
Grand Total
```

Actions:

```text
Download PDF
Print
Share
```

---

# 87. REPORTS

Owner reports:

## Sales

```text
Daily
Weekly
Monthly
Custom
```

## Orders

```text
Completed
Cancelled
Returned
```

## Inventory

```text
Current Stock
Stock Value
Low Stock
Out of Stock
Expired
Expiring
```

## Products

```text
Best Selling
Slow Moving
High Revenue
High Margin
```

## Customers

```text
New
Returning
High Value
Inactive
```

## Payments

```text
Cash
UPI
Card
Online
COD
Refunds
```

## Expenses

```text
Category
Amount
Date
```

---

# 88. REPORT EXPORT

Allow:

```text
CSV
Excel
PDF
Print
```

Reports must respect selected date filters.

---

# 89. STORE SETTINGS

Owner can configure:

## Business

```text
Store Name
Logo
Phone
Email
Address
GSTIN
Business Description
```

## Hours

```text
Opening
Closing
Working Days
```

## Delivery

```text
Radius
Fee
Minimum Order
Free Delivery Threshold
Slots
```

## Payment

```text
Razorpay
COD
```

## Notifications

```text
Push
Email
WhatsApp
```

## Checkout

```text
Minimum Order
Maximum Order
COD Limit
```

---

# 90. STORE EMERGENCY CONTROLS

Owner can instantly:

```text
Pause Online Orders
Pause Delivery
Close Store
Disable COD
Disable Online Payment
```

Example:

```text
ONLINE ORDERS: OFF

Reason:
Temporary Store Closure
```

Customer sees clear message.

---

# 91. OWNER AUDIT LOG

Track every important owner action:

```text
Login
Product Created
Product Edited
Price Changed
Stock Adjusted
Purchase Added
Order Modified
Order Cancelled
Refund Created
Coupon Created
Offer Changed
Settings Changed
```

Example:

```text
Action:
Product Price Updated

Product:
Aashirvaad Atta

Old:
₹320

New:
₹285

Time:
23 Sep 2026 4:30 PM
```

---

# 92. DATABASE DESIGN

Create normalized PostgreSQL schema.

Core tables:

```text
profiles

products
product_variants
product_images

categories
brands

inventory
inventory_batches
inventory_movements

suppliers
purchases
purchase_items
purchase_returns
purchase_return_items

carts
cart_items

addresses

orders
order_items
order_status_history

payments
payment_transactions
refunds

coupons
coupon_usage

offers
offer_products
offer_categories

customers

wishlists
wishlist_items

reviews

deliveries
delivery_slots
delivery_zones

expenses

loyalty_accounts
loyalty_transactions

notifications

support_tickets
support_messages

invoices

store_settings

audit_logs
```

---

# 93. DATABASE RULES

Use:

* UUID primary keys
* Foreign keys
* Unique constraints
* Check constraints
* Timestamps
* Soft delete where appropriate
* Indexes

Important indexes:

```text
products.slug
products.sku
products.barcode
orders.order_number
orders.customer_id
orders.status
orders.created_at
inventory.product_id
inventory_movements.product_id
payments.order_id
```

---

# 94. ORDER DATA IMMUTABILITY

Historical order data must not change when:

* Product price changes
* Product name changes
* Product category changes
* Customer changes address

Store snapshots:

```text
product_name_snapshot
price_snapshot
tax_snapshot
discount_snapshot
address_snapshot
```

---

# 95. INVENTORY TRANSACTION SAFETY

Inventory updates must be atomic.

Example:

```text
Available = 5

Customer A → requests 4
Customer B → requests 3
```

Only one operation should succeed based on actual available stock.

Never trust:

```text
frontend_stock
```

Use database-level transactional logic.

---

# 96. API STRUCTURE

Create clean service boundaries:

```text
/api/auth
/api/products
/api/categories
/api/cart
/api/orders
/api/payments
/api/inventory
/api/purchases
/api/customers
/api/coupons
/api/offers
/api/delivery
/api/reviews
/api/notifications
/api/expenses
/api/reports
/api/pos
/api/refunds
```

Separate:

```text
Validation
Authorization
Business Logic
Database
External Integrations
```

---

# 97. SECURITY

Mandatory:

* Row Level Security
* Server-side authorization
* Input validation
* Rate limiting
* Secure cookies/session
* XSS protection
* SQL injection prevention
* CSRF protection where applicable
* Secure uploads
* Payment verification
* Webhook verification
* Secret management

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_SECRET
PRIVATE_API_KEYS
```

to browser/client code.

---

# 98. FILE UPLOAD SECURITY

Validate:

```text
File type
File size
Extension
MIME type
```

Optimize product images.

Generate thumbnails where useful.

Never allow arbitrary executable files.

---

# 99. PWA

Customer application must be installable.

Manifest:

```text
name
short_name
description
icons
theme_color
background_color
display: standalone
start_url
```

Implement:

```text
Service Worker
Caching
Offline Fallback
Install Prompt
```

When installed:

```text
Store icon
↓
Standalone App
```

---

# 100. PWA OFFLINE BEHAVIOR

Customer:

Can see cached:

* App shell
* Previously loaded categories/products

But checkout/payment/order creation must require network.

Never allow fake offline order creation.

Owner POS should also clearly indicate when backend is unavailable.

---

# 101. RESPONSIVE DESIGN

Customer:

Mobile-first.

Owner:

Desktop-first + mobile responsive.

Support:

```text
360px
390px
430px
768px
1024px
1280px
1440px+
```

No:

* horizontal overflow
* clipped buttons
* broken tables
* unreadable text
* overlapping modals

---

# 102. UI DESIGN

Design language:

Modern
Clean
Premium
Fast
Trustworthy

Use:

* Clean backgrounds
* Strong brand color
* Rounded cards
* Subtle shadows
* Clear hierarchy
* Large product images
* Consistent spacing
* Strong typography

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Unnecessary animations
* Giant empty spaces
* Generic AI dashboard layouts

---

# 103. MOBILE CUSTOMER UX

Prioritize:

```text
OPEN
↓
SEARCH
↓
ADD
↓
CHECKOUT
↓
PAY
↓
TRACK
```

Make common actions one/two taps wherever possible.

---

# 104. ADMIN UX

Owner should quickly understand:

```text
What sold?
What is pending?
What is low stock?
What needs attention?
How much revenue?
How much profit?
```

Use:

* Cards
* Charts
* Tables
* Filters
* Search
* Drawers
* Modals
* Toasts
* Confirmation dialogs

---

# 105. LOADING STATES

Every async operation needs:

* Skeleton
* Spinner where appropriate
* Disabled action
* Progress indication

Examples:

```text
Loading products...
Placing order...
Processing payment...
Updating inventory...
Generating invoice...
```

---

# 106. EMPTY STATES

Create useful empty states.

Examples:

```text
No Orders Yet
Your orders will appear here.

Cart is Empty
Add some groceries to continue.

No Products Found
Try another search.

No Low Stock Items
Everything is sufficiently stocked.
```

---

# 107. ERROR STATES

Never expose raw backend errors.

Instead:

```text
Something went wrong.
Please try again.
```

For known errors:

```text
This product is no longer available.

Only 2 items are currently available.

Payment could not be completed.

This address is outside our delivery area.
```

---

# 108. CUSTOMER SESSION

Persist:

```text
Cart
Address
Preferences
Recently Viewed
Wishlist
```

Handle:

```text
Expired Session
Logout
Login Again
```

Guest users may browse.

Require login before checkout if configured.

---

# 109. PRICE SAFETY

Never calculate final order total only on frontend.

Backend must recalculate:

```text
Subtotal
Discount
Coupon
Tax
Delivery
Grand Total
```

before order creation/payment.

---

# 110. PAYMENT SAFETY

Never trust:

```text
payment_success = true
```

from frontend.

Verify with payment gateway server-side.

Use webhooks for final payment state.

Handle:

```text
Duplicate Webhook
Payment Timeout
Payment Success but Order Failed
Order Created but Payment Failed
Refund Failed
```

---

# 111. IDEMPOTENCY

Important operations must be idempotent.

Especially:

```text
Order Creation
Payment Processing
Webhook Processing
Refund
Inventory Deduction
```

Prevent duplicate orders and duplicate stock deductions.

---

# 112. ORDER NUMBER

Use human-readable order number:

```text
KS-YYYYMMDD-XXXXXX
```

Internal database ID remains UUID.

---

# 113. INVOICE NUMBER

Use unique invoice numbering.

Never reuse invoice numbers.

---

# 114. BUSINESS DAY HANDLING

Sales reports should respect store timezone:

```text
Asia/Kolkata
```

Do not calculate "today" using server UTC blindly.

---

# 115. SEARCH PERFORMANCE

For a growing product catalog:

* Add database indexes
* Debounce search
* Paginate products
* Optimize queries
* Lazy-load images
* Cache suitable data

---

# 116. PAGINATION

Never load thousands of records at once.

Use pagination for:

```text
Orders
Products
Customers
Inventory
Purchases
Expenses
Audit Logs
Reviews
Notifications
```

---

# 117. BULK OPERATIONS

Owner should be able to:

```text
Bulk Activate
Bulk Deactivate
Bulk Archive
Bulk Category Change
Bulk Price Update
Bulk Stock Update
```

Require confirmation for destructive operations.

---

# 118. PRODUCT IMPORT / EXPORT

Owner can:

```text
Export Products CSV
Import Products CSV
Export Inventory
```

Import must validate:

```text
SKU
Name
Category
Price
Stock
GST
Barcode
```

Show row-level errors before applying import.

---

# 119. BACKUP

Architecture should support:

* Automated database backups
* Storage backups
* Recovery strategy

Never permanently delete business-critical historical data.

---

# 120. SOFT DELETE

Use soft delete for:

```text
Products
Categories
Customers where appropriate
Coupons
Offers
```

Historical orders must remain intact.

---

# 121. DATA RETENTION

Do not delete:

```text
Completed Orders
Payments
Refunds
Invoices
Inventory Movements
Audit Logs
```

unless an explicit retention policy is configured.

---

# 122. PERFORMANCE TARGETS

Optimize for:

```text
Fast first load
Fast product search
Fast cart
Fast checkout
Fast admin tables
```

Use:

* Image optimization
* Server rendering where appropriate
* Caching
* Pagination
* Code splitting
* Database indexes

---

# 123. ACCESSIBILITY

Use:

* Semantic HTML
* Keyboard navigation
* Focus states
* ARIA labels
* Proper contrast
* Accessible forms
* Screen-reader-friendly buttons

---

# 124. SEO

Customer storefront:

```text
Metadata
OpenGraph
Sitemap
Robots
Canonical URLs
Structured Data
```

Product structured data:

```text
Product
Offer
AggregateRating
```

Category pages should be indexable.

Admin pages must NOT be indexed.

---

# 125. ANALYTICS EVENTS

Track useful customer events:

```text
Product Viewed
Search
Category Viewed
Add To Cart
Remove From Cart
Checkout Started
Payment Started
Order Completed
Coupon Applied
Wishlist Added
Review Submitted
```

Use privacy-conscious analytics.

Do not collect unnecessary sensitive data.

---

# 126. MARKETING AUTOMATION READY

Architecture should support future:

```text
Abandoned Cart
Back In Stock
Price Drop
Reorder Reminder
Inactive Customer Campaign
Offer Campaign
```

Do not send promotional notifications without proper consent/configuration.

---

# 127. BACK-IN-STOCK

Customer clicks:

```text
Notify Me
```

When stock becomes available:

```text
Product is back in stock.
```

Send notification to opted-in customers.

---

# 128. ABANDONED CART

Track abandoned carts.

Owner can see:

```text
Customer
Cart Value
Last Activity
Products
```

Future-ready for automated reminders.

---

# 129. REORDER REMINDERS

For frequently purchased products:

```text
You may be running low on milk.
```

This should be optional and configurable.

---

# 130. STORE BANNER MANAGEMENT

Owner can create:

```text
Banner
Title
Subtitle
Image
CTA
Link
Start Date
End Date
Priority
Status
```

Example:

```text
Weekend Grocery Sale
Up to 25% OFF
[Shop Now]
```

---

# 131. FEATURED PRODUCTS

Owner can mark:

```text
Featured
Popular
Best Seller
New
Deal
```

Customer homepage uses these flags.

---

# 132. RECOMMENDATION LOGIC

Start simple.

Recommendations can use:

```text
Recently Viewed
Frequently Bought Together
Same Category
Popular Products
Customer Purchase History
```

Do not require an AI recommendation engine initially.

---

# 133. FRAUD / ABUSE PROTECTION

Basic protections:

* Rate limiting
* OTP abuse prevention
* Coupon abuse prevention
* Excessive failed payment protection
* COD abuse tracking
* Duplicate order detection

Flag suspicious behavior for owner review.

---

# 134. COD ABUSE

Track:

```text
COD Orders
COD Cancellations
COD Failed Deliveries
```

Owner can optionally disable COD for a customer after repeated failed deliveries.

This must be an explicit owner-configured rule.

---

# 135. CUSTOMER ACCOUNT DELETION

Customer should be able to request account deletion.

Do not delete historical financial/order records where retention is legally/business-required.

Anonymize personal data where appropriate.

---

# 136. PRIVACY

Provide pages:

```text
Privacy Policy
Terms & Conditions
Refund Policy
Shipping / Delivery Policy
Contact
```

---

# 137. STORE CONTACT

Customer should easily access:

```text
Call Store
WhatsApp Store
Get Directions
Support
```

Owner configures contact details.

---

# 138. STORE LOCATION

Display:

```text
Store Address
Google Maps
Directions
```

Use store coordinates for delivery calculations.

---

# 139. ORDER RECEIPT / INVOICE SHARING

Customer can:

```text
Download PDF
Print
Share
```

Owner can also access invoice.

---

# 140. ORDER TIMELINE

Every major event creates timeline record:

```text
Order Placed
Payment
Confirmed
Picking
Packed
Out for Delivery
Delivered
Cancelled
Refund
Return
```

---

# 141. AUDITABILITY

Never modify critical records silently.

For sensitive operations:

```text
Before
After
Reason
Timestamp
Actor
```

must be recorded.

---

# 142. ERROR MONITORING

Prepare integration with an error monitoring service.

Track:

```text
Frontend Errors
API Errors
Payment Errors
Webhook Errors
Database Errors
```

Never expose stack traces to customers.

---

# 143. ENVIRONMENT MANAGEMENT

Use:

```text
.env.local
.env.production
```

Secrets:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
GOOGLE_MAPS_KEY
FIREBASE_CONFIG
```

Never commit secrets to Git.

Provide `.env.example`.

---

# 144. CODE QUALITY

Use:

* Reusable components
* Typed models
* Service layer
* Validation schemas
* Consistent naming
* Error handling
* Modular architecture

Avoid:

* Giant components
* Duplicate logic
* Hardcoded business rules
* Magic numbers
* Client-only security

---

# 145. COMPONENT STRUCTURE

Example:

```text
components/
├── ui/
├── customer/
│   ├── ProductCard
│   ├── ProductGrid
│   ├── Cart
│   ├── Checkout
│   ├── AddressSelector
│   └── OrderTracker
│
├── admin/
│   ├── Dashboard
│   ├── OrderTable
│   ├── InventoryTable
│   ├── ProductForm
│   ├── PurchaseForm
│   └── Reports
│
└── pos/
    ├── POSCart
    ├── ProductSearch
    ├── BarcodeScanner
    └── Receipt
```

---

# 146. ROUTING

Customer:

```text
/
 /categories
 /category/[slug]
 /product/[slug]
 /search
 /cart
 /checkout
 /orders
 /orders/[id]
 /profile
 /profile/addresses
 /wishlist
 /offers
 /support
```

Owner:

```text
/admin
/admin/orders
/admin/orders/[id]
/admin/products
/admin/categories
/admin/inventory
/admin/purchases
/admin/suppliers
/admin/customers
/admin/pos
/admin/delivery
/admin/coupons
/admin/offers
/admin/payments
/admin/expenses
/admin/reports
/admin/reviews
/admin/notifications
/admin/settings
/admin/audit-logs
```

---

# 147. DATABASE RELATIONSHIP PRINCIPLES

Example:

```text
Customer
   ↓
Orders
   ↓
Order Items
   ↓
Products
   ↓
Inventory
```

Purchase:

```text
Supplier
   ↓
Purchase
   ↓
Purchase Items
   ↓
Inventory
```

Payment:

```text
Order
 ↓
Payment
 ↓
Refund
```

Reviews:

```text
Customer
 ↓
Review
 ↓
Product
```

---

# 148. SEED DATA

Create realistic development data.

At minimum:

```text
100 Products
20 Categories
30 Customers
50 Orders
20 Inventory Movements
10 Purchases
10 Coupons
10 Offers
20 Reviews
```

Data must look realistic.

Do not use:

```text
Product 1
Product 2
Test User
Lorem ipsum
```

---

# 149. DEMO ACCOUNT

Provide development-only seed account:

```text
OWNER
```

Do not hardcode production credentials.

---

# 150. TESTING

Create tests for:

## Product

* Create
* Update
* Archive
* Search

## Inventory

* Purchase increases stock
* Order decreases stock
* Return increases stock
* Supplier return decreases stock
* Reservation works
* Concurrent orders cannot oversell

## Orders

* Create
* Cancel
* Modify
* Deliver
* Return
* Refund

## Payments

* Success
* Failure
* Webhook
* Duplicate webhook

## Coupons

* Valid
* Expired
* Minimum order
* Usage limit
* Customer limit

## POS

* Sale
* Return
* Stock deduction
* Receipt

---

# 151. EDGE CASES

Handle all of these:

### Product goes out of stock during checkout

Show:

```text
Some items are no longer available.
Please review your cart.
```

### Product price changes during checkout

Show updated price before payment.

### Payment succeeds but order creation fails

Use reconciliation/retry mechanism.

### Payment fails but stock is reserved

Release reservation.

### Customer closes browser during payment

Recover order/payment state.

### Duplicate payment webhook

Ignore duplicate.

### Customer orders last item simultaneously

Only one successful stock deduction.

### Store closes while customer is checking out

Prevent order placement.

### Delivery address becomes unavailable

Block checkout with explanation.

### Coupon expires during checkout

Revalidate.

### Owner deletes product

Historical orders remain intact.

---

# 152. BUSINESS RULE ENGINE

Centralize configurable business rules:

```text
Minimum Order
Maximum Order
Delivery Fee
Free Delivery Threshold
Delivery Radius
COD Limit
Store Hours
Delivery Slots
Tax
Coupon Rules
Stock Threshold
```

Do not scatter these values across frontend components.

---

# 153. OWNER SETTINGS DASHBOARD

Create settings sections:

```text
Store Profile
Store Hours
Delivery
Payments
Taxes
Orders
Notifications
PWA
SEO
Policies
Danger Zone
```

Danger Zone:

```text
Pause Store
Disable Orders
Clear Cache
```

Never provide destructive database deletion buttons in normal UI.

---

# 154. OWNER MOBILE EXPERIENCE

Owner should be able to use dashboard from phone.

Mobile owner should quickly:

```text
Accept Order
Reject Order
Update Order
Check Stock
Change Price
Add Stock
View Sales
View Profit
Open POS
```

---

# 155. CUSTOMER MOBILE EXPERIENCE

Customer should be able to complete an order with minimal interaction:

```text
Search
↓
Add
↓
Cart
↓
Address
↓
Payment
↓
Done
```

---

# 156. PWA INSTALL EXPERIENCE

When appropriate:

```text
Install [STORE NAME]
```

Show a tasteful install prompt.

Do not repeatedly annoy the customer.

---

# 157. PUSH NOTIFICATION PERMISSION

Do not ask immediately on first page load.

Ask after meaningful interaction.

Store notification consent.

Allow customer to disable promotional notifications.

---

# 158. WHATSAPP-READY ARCHITECTURE

Prepare notification service abstraction:

```text
NotificationService

sendOrderConfirmation()
sendOrderStatus()
sendDeliveryUpdate()
sendInvoice()
sendPromotion()
```

Providers can later be:

```text
Push
Email
WhatsApp
SMS
```

---

# 159. SERVICE LAYER

Create business services:

```text
ProductService
CartService
OrderService
InventoryService
PaymentService
PurchaseService
CouponService
OfferService
CustomerService
DeliveryService
NotificationService
ReportService
InvoiceService
POSService
ExpenseService
RefundService
```

---

# 160. TRANSACTIONAL WORKFLOWS

## Online Order

```text
Validate Cart
↓
Validate Store
↓
Validate Address
↓
Validate Stock
↓
Reserve Stock
↓
Calculate Total
↓
Create Order
↓
Create Payment
↓
Payment Verification
↓
Confirm Order
↓
Commit Inventory
↓
Notify Owner
↓
Notify Customer
```

## POS Sale

```text
Scan Products
↓
Validate Stock
↓
Calculate Bill
↓
Accept Payment
↓
Create Sale
↓
Decrease Inventory
↓
Generate Receipt
```

## Purchase

```text
Create Purchase
↓
Receive Goods
↓
Validate Quantity
↓
Add Inventory
↓
Create Inventory Movement
```

---

# 161. REPORTING DEFINITIONS

Clearly define calculations.

### Revenue

Completed/paid sales according to configured accounting treatment.

### AOV

```text
Revenue / Completed Orders
```

### Gross Profit

```text
Sales Revenue - Cost of Goods Sold
```

### Net Profit

```text
Gross Profit - Operating Expenses
```

### Stock Value

Use configured inventory valuation method consistently.

Do not mix calculation methods.

---

# 162. DASHBOARD ATTENTION CENTER

At top of Owner Dashboard:

```text
Needs Attention
```

Examples:

```text
4 New Orders
8 Low Stock Products
3 Expiring Products
2 Payment Issues
1 Refund Request
```

Clicking each item navigates directly to relevant page.

---

# 163. QUICK ACTIONS

Owner dashboard:

```text
+ Add Product
+ Add Stock
+ New Purchase
+ POS Sale
+ Create Coupon
+ View Orders
```

---

# 164. QUICK SEARCH

Owner global search:

Search:

```text
Product
Order
Customer
SKU
Barcode
Phone
```

Example:

```text
Search "KS-20260923"
```

returns order.

Search:

```text
9876543210
```

returns customer.

---

# 165. CUSTOMER ORDER STATUS NOTIFICATIONS

Example:

```text
Your order #KS-20260923-000001 has been confirmed.

Your order is being packed.

Your order is out for delivery.

Your order has been delivered.
```

---

# 166. STORE CLOSED EXPERIENCE

Customer can:

```text
Browse
Search
Wishlist
Add to Cart
```

But checkout should respect store rules.

Show next available time.

---

# 167. MAINTENANCE MODE

Owner can activate:

```text
Store temporarily unavailable.

We'll be back soon.
```

Customer can see store contact details.

---

# 168. LEGAL / POLICY PAGES

Create editable pages:

```text
Privacy Policy
Terms
Refund Policy
Delivery Policy
Cancellation Policy
Contact
```

Owner can edit content from settings or content management section.

---

# 169. DESIGN SYSTEM

Create reusable tokens:

```text
Primary
Secondary
Background
Surface
Text
Muted
Success
Warning
Error
Border
```

Typography:

```text
Heading
Body
Caption
Label
```

Spacing and radius must remain consistent.

---

# 170. FINAL PRODUCT QUALITY

The application must feel:

```text
Fast
Reliable
Premium
Trustworthy
Simple
Commercial
```

It must NOT feel:

```text
Like a template
Like a college project
Like a static website
Like a basic CRUD panel
Like an AI mockup
```

---

# 171. FINAL ACCEPTANCE CHECKLIST

Before considering the application complete, verify:

## CUSTOMER

* [ ] Signup/Login
* [ ] Home
* [ ] Categories
* [ ] Search
* [ ] Product Details
* [ ] Cart
* [ ] Wishlist
* [ ] Address
* [ ] Delivery validation
* [ ] Coupon
* [ ] Checkout
* [ ] Online Payment
* [ ] COD
* [ ] Order Confirmation
* [ ] Order Tracking
* [ ] Order History
* [ ] Reorder
* [ ] Reviews
* [ ] Support
* [ ] Notifications
* [ ] Invoice
* [ ] Profile
* [ ] PWA Installation

## OWNER

* [ ] Secure Login
* [ ] Dashboard
* [ ] Orders
* [ ] Order Processing
* [ ] Products
* [ ] Categories
* [ ] Inventory
* [ ] Stock Ledger
* [ ] Purchases
* [ ] Suppliers
* [ ] Purchase Returns
* [ ] Expiry
* [ ] Barcode
* [ ] POS
* [ ] POS Returns
* [ ] Customers
* [ ] Delivery
* [ ] Coupons
* [ ] Offers
* [ ] Payments
* [ ] Refunds
* [Expenses
* [ ] Profit
* [ ] Reports
* [ ] Reviews
* [ ] Notifications
* [ ] Store Settings
* [ ] Audit Logs
* [ ] CSV Import/Export
* [ ] Invoice Generation

## SYSTEM

* [ ] PostgreSQL
* [ ] Supabase
* [ ] RLS
* [ ] Server-side validation
* [ ] Payment verification
* [ ] Webhooks
* [ ] Idempotency
* [ ] Inventory transactions
* [ ] Error handling
* [ ] Loading states
* [ ] Empty states
* [ ] Responsive UI
* [ ] PWA
* [ ] SEO
* [ ] Accessibility
* [ ] Performance
* [ ] Backup strategy
* [ ] Environment variables
* [ ] Security
* [ ] Audit trail
* [ ] Tests

---

# 172. MOST IMPORTANT RULE

Build this as **one complete integrated business system**.

Do NOT build isolated fake pages.

All modules must actually connect.

For example:

```text
CUSTOMER ORDER
      ↓
ORDER DATABASE
      ↓
PAYMENT
      ↓
INVENTORY
      ↓
OWNER DASHBOARD
      ↓
PICKING
      ↓
PACKING
      ↓
DELIVERY
      ↓
DELIVERED
      ↓
INVOICE
      ↓
REPORTING
      ↓
PROFIT
```

And:

```text
OWNER PURCHASE
      ↓
INVENTORY INCREASE
      ↓
CUSTOMER / POS SALE
      ↓
INVENTORY DECREASE
      ↓
INVENTORY LEDGER
      ↓
COGS
      ↓
PROFIT REPORT
```

Every important business action must have a corresponding database record.

---

# 173. DEVELOPMENT PRIORITY

Build in this order:

## PHASE 1 — FOUNDATION

```text
Database
Authentication
Store Settings
Products
Categories
Inventory
Customer Accounts
```

## PHASE 2 — CUSTOMER COMMERCE

```text
Home
Search
Product
Cart
Address
Checkout
Orders
```

## PHASE 3 — PAYMENTS

```text
Razorpay
COD
Webhooks
Refunds
Invoices
```

## PHASE 4 — OWNER OPERATIONS

```text
Order Management
Inventory
Purchases
Suppliers
Expiry
POS
```

## PHASE 5 — BUSINESS MANAGEMENT

```text
Customers
Coupons
Offers
Delivery
Expenses
Profit
Reports
```

## PHASE 6 — POLISH

```text
PWA
Notifications
SEO
Performance
Accessibility
Audit
Testing
Error Monitoring
```

---

# 174. FINAL INSTRUCTION TO AI DEVELOPMENT AGENT

Do not start by generating random UI screens.

First understand the complete business workflow.

Then:

1. Design database schema.
2. Define relationships.
3. Define business rules.
4. Define API/service architecture.
5. Build authentication.
6. Build Owner Dashboard foundation.
7. Build inventory.
8. Build customer storefront.
9. Build cart and checkout.
10. Integrate payments.
11. Build order lifecycle.
12. Connect inventory with orders.
13. Build POS.
14. Build purchases and expiry.
15. Build reports.
16. Add notifications.
17. Add PWA.
18. Add security.
19. Add testing.
20. Perform complete end-to-end validation.

Do not mark a feature as complete if it is only visually implemented.

Every button must perform its intended action.

Every form must validate.

Every important mutation must update the database.

Every inventory change must create an inventory movement.

Every payment must be verified.

Every order must have a complete lifecycle.

Every historical transaction must remain auditable.

The final result must be a **real, production-ready single-store Kirana Store platform** that can be deployed and used by an actual store owner and real customers.
