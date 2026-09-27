# APNI KIRANA STORE

# PRODUCTION-LEVEL ADMIN / OWNER PORTAL — MASTER PROMPT

You are a senior SaaS product designer, UX architect, frontend engineer, backend engineer and operations-system architect.

We already have a customer-facing grocery PWA and an Owner/Admin portal.

The attached screenshot shows the current Admin dashboard.

The current design is a good starting point, but it is NOT production-ready.

Your task is to transform the entire Admin/Owner portal into a **complete production-level Kirana Store Operations System**.

This is not just a dashboard.

The admin portal must allow the store owner to actually operate the entire business from one place:

**Orders + POS + Products + Inventory + Customers + Delivery + Payments + Offers + Analytics + Store Settings + Notifications + Support + Audit**

The owner should be able to run the store from:

* Desktop
* Laptop
* Tablet
* Mobile phone

The mobile experience is extremely important.

Do NOT simply shrink the desktop sidebar onto mobile.

Create a proper responsive operational interface.

---

# 1. CORE OBJECTIVE

The Admin portal should answer these questions immediately:

### What is happening right now?

* New orders
* Pending orders
* Orders being prepared
* Orders ready
* Out for delivery
* Delivered
* Cancelled
* Failed payments

### What needs attention?

* New orders
* Low stock
* Out of stock
* Payment failures
* Delivery issues
* Customer complaints
* Refunds
* Expiring offers

### How is the store performing?

* Sales
* Orders
* Average order value
* Profit/margin where data is available
* Top products
* Low-performing products
* Repeat customers
* Cancellation rate
* Payment breakdown

### What can the owner do immediately?

* Update order status
* Update stock
* Add/edit product
* Create offer
* Process POS sale
* Contact customer
* Cancel/refund order
* Change store status

The interface must be operational, not decorative.

---

# 2. ADMIN DESIGN PRINCIPLE

The admin UI should follow:

**See → Decide → Act**

Every important piece of information should have an action.

For example:

LOW STOCK

"Amul Paneer"

Qty: 2

[Update Stock]

Do not create information-only widgets without useful actions.

---

# 3. CURRENT DASHBOARD REDESIGN

Keep the current dark admin visual identity, but make it more premium and operational.

Current screenshot has too much unused empty space.

Fix this.

Desktop:

* Proper max-width content area
* Better use of available horizontal space
* Responsive grid
* More useful operational sections
* No giant empty areas

Tablet:

* 2-column responsive layout where appropriate

Mobile:

* Single-column layout
* Compact cards
* Horizontal KPI scrolling where useful
* Sticky actions
* Bottom navigation
* Floating action button where useful

---

# 4. ADMIN MOBILE-FIRST REQUIREMENT

The owner must be able to run the store from a phone.

The following actions MUST be easy from mobile:

* See new order
* Open order
* Accept order
* Change order status
* Call customer
* View delivery address
* Update stock
* Mark product out of stock
* Add product
* Search product
* Check today's sales
* Open POS
* Close store
* View customer
* Issue refund/cancellation where permitted

No action should require opening desktop-only tables.

---

# 5. MOBILE ADMIN NAVIGATION

Do NOT show the full desktop sidebar permanently on mobile.

Use a mobile navigation system.

Recommended:

Bottom navigation:

### Home

Dashboard

### Orders

Order management

### Inventory

Products + stock

### More

All other modules

And a prominent:

### POS

button/action.

Alternatively use:

Dashboard

Orders

Inventory

POS

More

Keep it simple.

---

# 6. MOBILE QUICK ACTION BUTTON

Add a floating or sticky quick action system.

Possible actions:

* New POS Sale

* Add Product

* Update Stock

* Create Offer

But do not clutter the screen.

---

# 7. DESKTOP SIDEBAR

Desktop sidebar should contain:

### STORE

Overview

Orders

Counter POS

Inventory

Products

Categories

Customers

Coupons & Deals

Delivery

Payments

Analytics

Notifications

Support

Store Settings

Audit Logs

---

# 8. SIDEBAR BADGES

Use real-time badges.

Examples:

Orders
`5`

Low Stock
`3`

Support
`2`

Payments
`1`

Do not show badges when count is zero.

---

# 9. ADMIN TOP BAR

Desktop top bar:

Store status

Search

Notifications

Quick actions

Owner profile

Store switcher only if multi-store architecture is later supported

Mobile top bar:

Store name

Store status

Notifications

Profile/menu

---

# 10. GLOBAL ADMIN SEARCH

Create a powerful global search.

Search:

* Order ID
* Customer name
* Phone
* Product name
* SKU
* Barcode
* Category

Example:

Search:

`#1025`

→ order

Search:

`Rahul`

→ customer + orders

Search:

`Aashirvaad`

→ products

Search:

`890103`

→ SKU/barcode

---

# 11. DASHBOARD

Dashboard should be operational.

Top section:

### Store Status

OPEN

or

CLOSED

with toggle.

Example:

🟢 Store Open

[Close Store]

If closed:

🔴 Store Closed

[Open Store]

---

# 12. KPI CARDS

Show:

### Today's Sales

₹8,830

Compare:

+12.4% vs yesterday

### Orders

42

### Pending

6

### Delivered

31

### Cancelled

2

### Average Order Value

₹210

### Low Stock

3

### Out of Stock

5

Cards should be clickable.

Clicking Orders → Orders filtered to today.

Clicking Low Stock → Inventory filtered to low stock.

---

# 13. REAL-TIME OPERATIONS PANEL

Add:

## LIVE OPERATIONS

New Orders

Preparing

Ready

Out for Delivery

Delivery Delayed

Use status counts.

Example:

NEW
4

PREPARING
3

READY
2

OUT
5

Click any status to open filtered orders.

---

# 14. NEW ORDER ALERT

When new online order arrives:

Show prominent notification.

Example:

🔔 New Order #1026

Rahul Sharma

4 items

₹582

UPI

[View Order]

Do not rely only on a tiny notification badge.

---

# 15. ORDER MANAGEMENT — CORE MODULE

This is one of the most important modules.

Route:

`/admin/orders`

Create a production-grade order management system.

---

# 16. ORDER FILTERS

Filters:

* All
* New
* Confirmed
* Preparing
* Ready
* Out for Delivery
* Delivered
* Cancelled
* Payment Failed
* Refund Pending

Additional filters:

* Today
* Yesterday
* Date range
* Payment method
* Delivery type
* Customer
* Amount range

---

# 17. ORDER SEARCH

Search by:

Order number

Customer

Phone

Product

Address

---

# 18. ORDER LIST

Desktop table:

Order ID

Customer

Items

Amount

Payment

Order Status

Payment Status

Delivery

Created

Actions

Mobile:

Use order cards instead of table.

Example:

#1025

Rahul Sharma

3 items

₹420

COD

🟡 Preparing

10:42 AM

[Open Order]

---

# 19. ORDER DETAIL PAGE

This must be extremely detailed.

Header:

#1025

Rahul Sharma

₹420

Status:

PREPARING

Actions:

[Update Status]

[Call Customer]

[Cancel Order]

[More]

---

# 20. ORDER STATUS UPDATE

THIS IS MANDATORY.

Owner must be able to change status directly.

Create a clear status control.

Statuses:

### NEW / PLACED

Order received.

### CONFIRMED

Store accepted.

### PREPARING

Packing started.

### READY

Order packed.

### OUT FOR DELIVERY

Order dispatched.

### DELIVERED

Customer received.

### CANCELLED

Order cancelled.

### REFUND PENDING

Refund initiated.

### REFUNDED

Refund completed.

---

# 21. STATUS UPDATE UX

On desktop:

Status dropdown / action buttons.

On mobile:

Open bottom sheet:

## Update Order Status

Current:

PREPARING

Available actions:

✓ Mark Ready

→ Out for Delivery

✕ Cancel Order

After selecting:

Ask confirmation.

Example:

"Mark order #1025 as Ready?"

[Cancel]

[Confirm]

---

# 22. STATUS TRANSITION VALIDATION

Do not allow random status changes.

Example:

PLACED
→ CONFIRMED
→ PREPARING
→ READY
→ OUT_FOR_DELIVERY
→ DELIVERED

Cancellation should only be allowed according to configured rules.

Prevent:

DELIVERED → PREPARING

unless an explicit admin override exists.

---

# 23. ORDER TIMELINE

Every order must show timeline.

Example:

10:32
Order placed

10:34
Payment confirmed

10:36
Order accepted

10:42
Preparing

10:51
Ready

11:02
Out for delivery

11:18
Delivered

Show actor where useful:

Customer

System

Owner

Staff

---

# 24. ORDER ITEMS

Show:

Product

Image

SKU

Quantity

MRP

Selling price

Discount

Tax

Subtotal

Allow owner to inspect each item.

---

# 25. ORDER PRICE BREAKDOWN

Show:

Subtotal

Product discount

Coupon discount

Delivery fee

Tax

Total

Payment received

Refund amount

Never calculate final totals only in frontend.

---

# 26. CUSTOMER INFORMATION

Order detail should show:

Customer name

Phone

Email if available

Delivery address

Map/location if supported

Delivery instructions

Previous order count

Customer lifetime value if implemented

Quick action:

[Call]

---

# 27. CUSTOMER ORDER HISTORY

From an order:

Click customer.

Show:

Total orders

Total spend

Last order

Average order value

Cancelled orders

Customer's complete order history.

---

# 28. ORDER NOTES

Owner can add internal notes.

Example:

"Customer requested no plastic bag."

Separate:

Customer note

Internal admin note

Do not expose internal notes to customer.

---

# 29. ORDER CANCELLATION

When cancelling:

Ask reason.

Reasons:

Customer requested cancellation

Out of stock

Payment issue

Store issue

Delivery issue

Other

Optional note.

If payment was successful:

Start refund workflow where applicable.

---

# 30. REFUND MANAGEMENT

Create:

`/admin/payments`

Show:

Refund pending

Refund processing

Refunded

Refund failed

Admin can inspect refund details.

Do not fake refund success.

---

# 31. INVENTORY MODULE

Route:

`/admin/inventory`

This must be a serious inventory management system.

Dashboard:

Total Products

In Stock

Low Stock

Out of Stock

Inventory Value

---

# 32. INVENTORY FILTERS

Filters:

All

In Stock

Low Stock

Out of Stock

Recently Updated

Fast Moving

Slow Moving

Category

Brand

---

# 33. INVENTORY SEARCH

Search:

Product name

SKU

Barcode

Brand

Category

---

# 34. STOCK UPDATE

Every product needs:

Current Stock

Reserved Stock

Available Stock

Low Stock Threshold

Reorder Level

Owner action:

[Update Stock]

---

# 35. STOCK ADJUSTMENT

Stock adjustment should support:

Stock In

Stock Out

Damaged

Expired

Manual Correction

POS Sale

Online Order

Return

Adjustment

Require quantity and optional reason.

---

# 36. INVENTORY HISTORY

Every stock change must be logged.

Example:

Amul Paneer

Stock:

20 → 15

Reason:

Online Order #1025

Time:

10:42 AM

Actor:

System

---

# 37. LOW STOCK ALERTS

Dashboard:

LOW STOCK

Amul Paneer
Qty 2

[Update]

OUT OF STOCK

Tata Salt
Qty 0

[Restock]

---

# 38. PRODUCT MANAGEMENT

Route:

`/admin/products`

Features:

* Product list
* Search
* Filter
* Add
* Edit
* Archive
* Activate/deactivate
* Duplicate
* Bulk operations

---

# 39. ADD PRODUCT

Fields:

Product name

Brand

SKU

Barcode

Category

Subcategory

Description

Images

Unit

Weight

MRP

Selling price

Tax

Stock

Low-stock threshold

Reorder level

Product status

Featured

Popular

---

# 40. PRODUCT IMAGE MANAGEMENT

Support:

* Upload image
* Multiple images
* Primary image
* Reorder images
* Remove image

Show preview.

---

# 41. PRODUCT PRICING

Support:

MRP

Selling price

Discount

Tax

Unit price where useful

Calculate discount automatically.

Never trust discount values from client.

---

# 42. BULK PRODUCT OPERATIONS

Allow:

Bulk activate

Bulk deactivate

Bulk delete/archive

Bulk category assignment

Bulk stock update

Bulk price update

Do not perform destructive actions without confirmation.

---

# 43. CATEGORIES

Route:

`/admin/categories`

Owner can:

Create

Edit

Delete/archive

Reorder

Enable/disable

Assign products

Create subcategories

Upload category icon/image

---

# 44. CUSTOMERS MODULE

Route:

`/admin/customers`

Customer list:

Name

Phone

Orders

Total Spend

Last Order

Status

Joined Date

---

# 45. CUSTOMER DETAIL

Show:

Profile

Addresses

Orders

Total Spend

Average Order Value

Last Order

Favorite products if available

Cancelled orders

Support issues

Notification preferences

---

# 46. CUSTOMER ACTIONS

Admin can:

View customer

View orders

Call customer

Disable account if required

Add internal note

View support issues

Do not expose sensitive authentication information.

---

# 47. POS MODULE

Route:

`/admin/pos`

The POS must be extremely fast.

Layout:

Search / barcode

Product results

Cart

Customer optional

Discount

Payment

Complete Sale

---

# 48. POS SEARCH

Support:

Product name

SKU

Barcode

Barcode scanner where browser/device supports it

---

# 49. POS CART

Show:

Product

Quantity

Price

Discount

Subtotal

Total

Allow:

Quantity change

Remove

Clear cart

---

# 50. POS CUSTOMER

Customer can be:

Walk-in customer

Existing customer

New customer

Do not force customer account for normal walk-in sales.

---

# 51. POS PAYMENT

Methods:

Cash

UPI

Card

Other configured methods

After successful sale:

Generate receipt.

Automatically update inventory.

Automatically record sale in analytics.

---

# 52. RECEIPT

Create printable/shareable receipt.

Include:

Store name

Store address

Phone

Invoice/order number

Date/time

Items

Quantity

Price

Discount

Tax

Total

Payment method

Thank-you message

---

# 53. COUPONS & DEALS

Route:

`/admin/coupons`

Features:

Create coupon

Edit

Activate/deactivate

Expire

Usage count

Usage limit

Minimum order

Discount type

Discount amount

Maximum discount

Eligible customers

Start/end date

---

# 54. PROMOTIONS

Support:

Product discounts

Category offers

Buy X Get Y

Flat discount

Percentage discount

Free delivery

First-order offer

Festive promotions

---

# 55. DELIVERY MANAGEMENT

Route:

`/admin/delivery`

Show:

Active deliveries

Pending dispatch

Out for delivery

Delivered

Delayed

Failed

---

# 56. DELIVERY DETAILS

For every delivery:

Order

Customer

Phone

Address

Delivery instructions

Order value

Assigned person if applicable

Status

Estimated delivery time

---

# 57. DELIVERY SETTINGS

Configure:

Delivery radius

Delivery fee

Free delivery threshold

Minimum order

Delivery slots

Estimated delivery time

Store delivery hours

---

# 58. PAYMENT MANAGEMENT

Route:

`/admin/payments`

Dashboard:

Total online payments

COD

UPI

Card

Failed payments

Refunds

Pending refunds

---

# 59. PAYMENT TRANSACTION DETAIL

Show:

Transaction ID

Order ID

Customer

Amount

Payment method

Payment status

Created time

Updated time

Refund status

Gateway reference if applicable

---

# 60. ANALYTICS

Route:

`/admin/analytics`

Time filters:

Today

7 days

30 days

Custom

---

# 61. SALES ANALYTICS

Show:

Revenue

Orders

Average order value

Discounts

Delivery revenue

Taxes

Refunds

Net sales

Where actual cost data exists:

Gross margin

---

# 62. PRODUCT ANALYTICS

Show:

Top selling products

Most viewed products if tracked

Fast moving products

Slow moving products

Out-of-stock impact

Revenue by product

Units sold

---

# 63. CATEGORY ANALYTICS

Show:

Sales by category

Units by category

Revenue contribution

---

# 64. CUSTOMER ANALYTICS

Show:

New customers

Returning customers

Repeat order rate

Average customer spend

Top customers

---

# 65. ORDER ANALYTICS

Show:

Completed

Cancelled

Failed

Average preparation time

Average delivery time

Order status distribution

---

# 66. STORE PERFORMANCE

Dashboard summary:

Sales

Orders

Customers

AOV

Repeat customers

Cancellation rate

Refund rate

---

# 67. NOTIFICATIONS

Route:

`/admin/notifications`

Admin should see:

New order

Payment failure

Low stock

Out of stock

Refund

Customer issue

Delivery delay

System alerts

---

# 68. PUSH NOTIFICATION ARCHITECTURE

Prepare for push notifications.

Admin can receive:

"New order #1026"

"5 products are low in stock"

"Payment failed for order #1025"

---

# 69. CUSTOMER NOTIFICATION CONTROL

Owner can send configured notifications/promotions.

But provide safeguards against accidental spam.

---

# 70. SUPPORT / CUSTOMER ISSUES

Route:

`/admin/support`

Show:

Open

In Progress

Resolved

Closed

Issues:

Missing item

Wrong item

Damaged item

Late delivery

Payment problem

Refund problem

Other

---

# 71. SUPPORT DETAIL

Show:

Customer

Order

Issue

Description

Images if customer submitted

Created time

Status

Internal notes

Resolution

---

# 72. STORE SETTINGS

Route:

`/admin/settings`

Sections:

Store Profile

Business Information

Store Hours

Delivery

Payments

Orders

Notifications

Tax

POS

Security

---

# 73. STORE PROFILE

Editable:

Store name

Logo

Cover image

Phone

Email

Address

Description

---

# 74. STORE HOURS

Configure:

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

Opening time

Closing time

Break if applicable

Holiday/closed dates

---

# 75. STORE STATUS

Quick toggle:

OPEN

CLOSED

BUSY

BUSY mode can optionally increase estimated preparation time.

---

# 76. ORDER SETTINGS

Configure:

Minimum order

Maximum order

Cancellation window

Auto-confirm orders

Preparation time

Delivery estimate

---

# 77. PAYMENT SETTINGS

Enable/disable:

UPI

Card

COD

Other supported methods

Do not put secret payment credentials in client-side settings.

---

# 78. TAX SETTINGS

Configure tax rules where applicable.

Do not hardcode tax calculations.

---

# 79. ADMIN PROFILE

Owner profile:

Name

Email

Phone

Profile image

Last login

Security settings

Logout

---

# 80. STAFF / ROLE-READY ARCHITECTURE

Even if initially there is only one owner, architect permissions properly.

Roles:

OWNER

MANAGER

ORDER_MANAGER

INVENTORY_MANAGER

POS_OPERATOR

SUPPORT

Permissions should control access.

Example:

POS operator cannot change payment gateway settings.

Inventory manager cannot access financial settings.

---

# 81. AUDIT LOGS

Route:

`/admin/audit`

Log:

Who

Action

Entity

Old value

New value

Time

Reason where applicable

Examples:

Stock changed

Price changed

Order status changed

Product archived

Coupon created

Refund initiated

Settings changed

---

# 82. ADMIN SECURITY

Protect every admin route.

Implement:

Authentication

Authorization

Role permissions

Session handling

Session expiry

Secure logout

Server-side authorization

Never rely only on hiding frontend buttons.

---

# 83. CRITICAL OPERATION CONFIRMATIONS

Confirmation required for:

Delete product

Archive product

Cancel order

Refund

Clear POS cart

Close store

Disable product

Bulk stock adjustment

Bulk delete

Example:

"Are you sure you want to cancel order #1025?"

---

# 84. MOBILE ORDER STATUS EXPERIENCE

This is extremely important.

On mobile when owner opens order:

Show immediately:

#1025

₹420

Rahul Sharma

3 items

COD

PREPARING

Then large action:

### UPDATE STATUS

Tap → bottom sheet:

Mark Ready

Mark Out for Delivery

Mark Delivered

Cancel Order

The owner should NOT need to navigate through multiple pages.

---

# 85. MOBILE INVENTORY EXPERIENCE

Mobile inventory card:

Amul Paneer

Stock: 3

Threshold: 5

🟡 LOW STOCK

[Update Stock]

Tap update:

+5

+10

Custom quantity

Stock Out

Adjustment reason

Save

---

# 86. MOBILE POS

POS must work extremely well on phone/tablet.

Top:

Search product

Barcode scan

Product list

Bottom:

Cart summary

"3 Items • ₹450"

[Checkout]

Checkout should use large touch-friendly controls.

---

# 87. MOBILE DASHBOARD

Recommended layout:

Store status

Today's Sales

Pending Orders

Low Stock

Live Orders

Quick Actions

Recent Orders

Alerts

Do not display 20 tiny cards.

Prioritize actions.

---

# 88. RESPONSIVE BREAKPOINTS

Test:

320px

360px

375px

390px

414px

430px

768px

820px

1024px

1280px

1440px+

No horizontal scrolling.

---

# 89. TABLE RESPONSIVENESS

Never force wide desktop tables onto phones.

Desktop:

Tables.

Tablet:

Compact tables/cards.

Mobile:

Cards + filters + bottom sheets.

---

# 90. MOBILE FILTERS

Filters should open as bottom sheet.

Example:

FILTER ORDERS

Status

Payment

Date

Amount

[Clear]

[Apply]

---

# 91. MOBILE FORMS

Forms should be:

One-column

Large inputs

Clear labels

Large buttons

Sticky Save button where appropriate.

Avoid multi-column desktop forms on mobile.

---

# 92. MOBILE HEADER

Mobile header should remain compact.

Do not use a giant desktop navigation header.

---

# 93. RESPONSIVE SIDEBAR

Desktop:

Persistent sidebar.

Tablet:

Collapsible sidebar.

Mobile:

Hidden sidebar.

Open via menu / More.

---

# 94. BOTTOM ACTIONS

Critical mobile actions should use sticky bottom action areas.

Examples:

Order:

[Update Status]

Product:

[Save Product]

Inventory:

[Save Stock]

POS:

[Checkout]

---

# 95. LOADING STATES

Every admin screen must have:

Skeleton

Loading button state

Table loading state

Card loading state

Chart loading state

Never freeze the UI.

---

# 96. EMPTY STATES

Examples:

No orders today

"No orders yet today."

[View Previous Orders]

No products:

"No products found."

[Add Product]

No low stock:

"Inventory looks healthy."

---

# 97. ERROR STATES

Every API operation needs:

Success

Loading

Error

Retry

Example:

"Unable to update order status."

[Try Again]

Do not expose raw technical errors.

---

# 98. TOASTS

Centralized toast system.

Examples:

"Order marked as Ready"

"Stock updated successfully"

"Product created"

"Coupon activated"

"Store is now closed"

---

# 99. REAL-TIME DATA

Admin should be prepared for real-time updates.

When new order arrives:

Dashboard updates.

Order badge updates.

Order list updates.

Notification appears.

When order status changes:

Customer side updates.

Inventory updates when order is finalized according to inventory rules.

---

# 100. INVENTORY CONSISTENCY

Critical rule:

Customer orders + POS sales must use the same inventory system.

Prevent:

Overselling

Negative stock unless explicitly allowed

Duplicate stock deduction

Duplicate order processing

---

# 101. ORDER IDEMPOTENCY

Critical order operations must be idempotent.

If user/admin taps:

"Place Order"

twice,

do not create two orders.

If status update is repeated:

do not create duplicate events.

---

# 102. DATA VALIDATION

Never trust frontend values.

Validate server-side:

Prices

Stock

Order totals

Coupons

Permissions

Payment state

Order state

Inventory

---

# 103. ADMIN DASHBOARD QUICK ACTIONS

Add:

* Add Product

* Update Stock

* New POS Sale

* Create Coupon

View Orders

View Low Stock

These should be accessible within one or two taps.

---

# 104. COMMAND / QUICK SEARCH

Optional but recommended.

Keyboard shortcut:

/

opens global search.

Useful desktop shortcuts:

N → New POS sale

O → Orders

I → Inventory

P → Products

Do not force shortcuts on mobile.

---

# 105. PERFORMANCE

Admin should feel fast.

Requirements:

* Pagination
* Server-side filtering
* Debounced search
* Lazy loading
* Optimized images
* Cached queries
* Avoid unnecessary API calls
* Optimistic UI only where safe

---

# 106. LARGE DATA SUPPORT

Architecture should work when store has:

100 products

500 products

5,000 orders

10,000 customers

Do not load entire database into browser.

---

# 107. DATE / TIME

Use store timezone.

Display dates consistently.

Example:

26 Sep 2026

10:42 AM

Do not rely blindly on browser timezone for business operations.

---

# 108. CURRENCY

Use INR formatting.

Examples:

₹420

₹1,299

₹12,450

Use Indian number formatting.

---

# 109. SEARCH UX

Search should support:

Typing

Clear button

Recent searches

Loading state

No results

Keyboard navigation desktop

Touch-friendly mobile results

---

# 110. ACCESSIBILITY

Admin must support:

Keyboard navigation

Focus states

ARIA labels

Semantic HTML

Readable contrast

Touch targets

Screen reader-friendly controls

---

# 111. DESIGN SYSTEM

Create reusable admin design tokens.

Colors:

Primary dark navy/charcoal

Brand green

Success

Warning

Danger

Info

Typography

Spacing

Radius

Shadow

Borders

Buttons

Inputs

Cards

Badges

Tables

Bottom sheets

Modals

---

# 112. STATUS COLORS

Keep status meaning consistent.

Success:

Delivered

Paid

In Stock

Active

Warning:

Pending

Preparing

Low Stock

Danger:

Cancelled

Failed

Out of Stock

Info:

Confirmed

Ready

Out for Delivery

Do not randomly change status colors between pages.

---

# 113. PRODUCT STATUS

Product states:

ACTIVE

INACTIVE

OUT_OF_STOCK

ARCHIVED

---

# 114. ORDER STATUS

Centralize status definitions:

PLACED

CONFIRMED

PREPARING

READY

OUT_FOR_DELIVERY

DELIVERED

CANCELLED

REFUND_PENDING

REFUNDED

PAYMENT_FAILED

Do not duplicate status strings across components.

---

# 115. DASHBOARD ALERT CENTER

Create an "Action Required" section.

Examples:

🔴 2 payment failures

🟡 3 low-stock products

🔴 1 order waiting for confirmation

🟡 2 delayed deliveries

Click alert → directly open relevant screen.

---

# 116. STORE HEALTH

Optional dashboard section:

Store open

Payment gateway operational

Online ordering active

Inventory sync healthy

Notifications connected

No critical errors

This should be simple and useful.

---

# 117. DEMO DATA

Create realistic seed data.

At least:

50 products

15 categories

10 customers

10+ orders

Different order statuses

Low-stock products

Out-of-stock products

Coupons

POS sales

Analytics data

Support tickets

Notifications

This should make the admin dashboard look alive during tomorrow's trial.

---

# 118. DEMO ORDER STATUSES

Seed examples:

2 NEW

2 CONFIRMED

3 PREPARING

2 READY

3 OUT_FOR_DELIVERY

10 DELIVERED

1 CANCELLED

1 PAYMENT_FAILED

This allows every flow to be demonstrated.

---

# 119. ADMIN TRIAL DEMO FLOW

Tomorrow's demo should be able to demonstrate:

### DEMO 1

Open Dashboard

→ See new order

→ Open order

→ View customer

→ View items

→ Update status

→ Mark Preparing

→ Mark Ready

→ Mark Out for Delivery

→ Mark Delivered

---

### DEMO 2

Open Inventory

→ Find low-stock product

→ Update stock

→ View inventory history

---

### DEMO 3

Open Products

→ Add product

→ Upload image

→ Set price

→ Set stock

→ Publish

---

### DEMO 4

Open POS

→ Search product

→ Add to cart

→ Select Cash

→ Complete sale

→ Inventory updates

→ Receipt generated

---

### DEMO 5

Open Analytics

→ View today's sales

→ Top products

→ Orders

→ AOV

---

# 120. IMPORTANT — CURRENT SCREENSHOT IMPROVEMENT

The current dashboard screenshot has:

* Very large unused dark area
* Small content region
* Desktop-centric sidebar
* Too much information compressed into small cards
* Limited operational actions
* No obvious order-status workflow
* No mobile interaction model

Fix all of these.

The final desktop dashboard should feel balanced.

The final mobile dashboard should feel like a purpose-built mobile operations app.

---

# 121. DO NOT SIMPLY MAKE EVERYTHING BIGGER

Responsive design does NOT mean:

desktop UI × smaller.

Instead:

Desktop:

Sidebar + dense information + tables.

Tablet:

Collapsible navigation + adaptive cards.

Mobile:

Bottom navigation + cards + bottom sheets + sticky actions + simplified information hierarchy.

---

# 122. PRODUCTION ROUTES

Create/organize routes such as:

/admin

/admin/orders

/admin/orders/[id]

/admin/pos

/admin/inventory

/admin/products

/admin/products/new

/admin/products/[id]

/admin/categories

/admin/customers

/admin/customers/[id]

/admin/coupons

/admin/delivery

/admin/payments

/admin/analytics

/admin/notifications

/admin/support

/admin/settings

/admin/audit

/admin/profile

---

# 123. COMPONENT ARCHITECTURE

Create reusable components:

AdminShell

AdminSidebar

MobileAdminNav

AdminHeader

StoreStatus

KpiCard

OrderCard

OrderTable

OrderTimeline

OrderStatusControl

OrderStatusSheet

CustomerCard

ProductTable

ProductCard

InventoryCard

StockAdjustmentSheet

QuickAction

AlertCard

PaymentCard

AnalyticsChart

FilterSheet

SearchCommand

ConfirmDialog

EmptyState

ErrorState

Skeleton

Toast

---

# 124. DO NOT CREATE DUPLICATE UI LOGIC

Centralize:

Order statuses

Permissions

Currency formatting

Date formatting

Inventory calculations

Pricing calculations

Notification types

Validation

Business rules

---

# 125. FINAL PRODUCTION AUDIT

Before saying the Admin portal is complete, test the complete system.

### ORDERS

Can owner see order?

Can owner search order?

Can owner filter order?

Can owner open order?

Can owner update status?

Can owner cancel?

Can owner see timeline?

Can owner see payment?

Can owner see customer?

Can owner call customer?

Can owner update status from mobile?

---

### INVENTORY

Can owner see stock?

Can owner update stock?

Can owner see low stock?

Can owner see out of stock?

Does order affect inventory correctly?

Does POS affect inventory correctly?

Is stock history recorded?

---

### PRODUCTS

Can owner add?

Edit?

Archive?

Activate?

Update price?

Update stock?

Upload image?

Assign category?

---

### POS

Can owner search?

Add?

Remove?

Change quantity?

Take payment?

Generate receipt?

Update inventory?

---

### CUSTOMERS

Can owner search?

View profile?

View orders?

View total spend?

View support issues?

---

### PAYMENTS

Can owner see payment status?

Failed payment?

Refund?

Refund status?

---

### DELIVERY

Can owner see active deliveries?

Can owner update delivery status?

Can owner configure delivery rules?

---

### ANALYTICS

Are sales correct?

Are orders correct?

Are AOV calculations correct?

Are cancelled orders handled correctly?

---

### SECURITY

Can customer access admin?

Can staff access restricted settings?

Are APIs protected?

Are prices validated server-side?

Are stock values validated server-side?

---

# 126. FINAL UX TEST

Test the Admin portal using only a phone.

Pretend you are the store owner standing inside the shop.

You should be able to:

1. Open app
2. See today's sales
3. See new order
4. Open order
5. Call customer
6. Check items
7. Accept order
8. Mark preparing
9. Mark ready
10. Mark out for delivery
11. Mark delivered
12. Check stock
13. Update stock
14. Make POS sale
15. Check analytics

WITHOUT needing a desktop.

If any of these requires awkward zooming, horizontal scrolling, tiny buttons, desktop tables or multiple unnecessary pages, redesign it.

---

# 127. FINAL PRODUCT STANDARD

This must NOT look like:

"An admin template."

It should look like:

**"A real Kirana Store Operating System."**

The customer app handles:

SHOPPING.

The Admin app handles:

**OPERATIONS.**

The owner should be able to run the entire store from this portal.

Prioritize:

**Orders → Inventory → POS → Products → Customers → Payments → Delivery → Analytics → Settings**

The most important action in the entire system is:

## ORDER STATUS MANAGEMENT

Make it extremely obvious and extremely easy.

A new order should never be hidden.

A pending order should never be difficult to find.

A status update should never require multiple unnecessary screens.

The owner should always know:

**What order came in → What needs to be packed → What is ready → What is going out → What is delivered → What needs attention.**

Finally, perform a complete production-readiness audit across:

UX

Responsive design

Mobile usability

Orders

Order status transitions

Inventory

POS

Payments

Customers

Delivery

Analytics

Notifications

Security

Permissions

Performance

Accessibility

PWA compatibility

Error handling

Loading states

Empty states

Data consistency

Audit logging

and fix every issue you find before considering the Admin portal complete.
