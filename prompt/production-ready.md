# MASTER PROMPT — PRODUCTION-LEVEL KIRANA QUICK-COMMERCE PWA

You are a senior product designer, UX architect, frontend engineer and backend engineer.

We are building a **production-ready single-store Kirana Grocery PWA**.

The current UI is visible in the attached reference screenshot. Keep the existing visual direction, but completely upgrade the application into a **real-world quick-commerce experience inspired by the interaction quality of modern grocery apps such as Blinkit/Zepto**, without copying their branding, assets, exact layouts, or proprietary UI.

This is NOT a simple demo website.

Build it like a product that will be shown in a client trial tomorrow and can later be deployed to real customers.

---

# 1. CORE PRODUCT MODEL

This is a:

**Single Store → One Owner → Customers order groceries from phone → Owner manages everything from admin/POS.**

There are two major experiences:

### CUSTOMER PWA

Customers can:

* Sign up / Login
* Browse store
* Search products
* Browse categories
* View product details
* Add products to cart
* Manage quantities
* Save addresses
* Checkout
* Pay
* Track orders
* View order history
* Reorder
* Manage profile
* Receive notifications
* Install PWA

### OWNER / ADMIN

Owner can:

* Manage products
* Manage categories
* Manage inventory
* Manage prices
* Manage offers
* Manage orders
* Accept/reject orders
* Update order status
* Manage customers
* Manage delivery settings
* Manage store timings
* Manage coupons
* Manage payments
* Manage POS
* View sales
* View analytics
* Manage notifications
* Configure store settings

Do not mix customer and owner experiences.

---

# 2. IMPORTANT UX PRINCIPLE

The customer should feel:

**Open → Choose → Add → Pay → Track**

with minimum friction.

Do NOT make users go through unnecessary pages.

The entire experience should feel fast, clean and mobile-first.

---

# 3. FIRST-TIME USER FLOW

When a new user opens the PWA:

## STEP 1 — Splash

Show:

* Store logo
* Store name
* Small loading animation
* Short brand message

Example:

"Fresh groceries. Right from your neighbourhood."

Do not keep splash screen unnecessarily long.

After initialization:

Check:

* Is user authenticated?
* Does user have saved address?
* Is store open?
* Is onboarding completed?

Then route accordingly.

---

# 4. AUTHENTICATION FLOW

Create a proper production authentication system.

Initial screen:

## "Welcome to Apni Kirana Store"

Options:

### Continue with Mobile

User enters:

+91 Mobile Number

Then:

**Send OTP**

OTP screen:

* 6 digit OTP
* Auto focus
* Auto advance
* Paste OTP support
* Countdown timer
* Resend OTP
* Change number
* Loading state
* Invalid OTP state
* Expired OTP state
* Too many attempts state

After successful OTP:

If new user:

→ Profile setup

If existing user:

→ Home

---

# 5. GOOGLE LOGIN

Also provide:

**Continue with Google**

Flow:

Google authentication

→ account verification

→ check existing user

→ if new user, profile setup

→ if existing user, home

Do not show Google login as a fake button.

Structure authentication so it can be connected to a real authentication provider.

---

# 6. AUTHENTICATION EDGE CASES

Handle:

* Invalid phone number
* Empty phone number
* OTP expired
* Wrong OTP
* Too many OTP attempts
* Network failure
* Authentication timeout
* User closes OTP screen
* User changes phone number
* Google authentication cancelled
* Existing account
* New account
* Session expired
* Logout
* Re-login
* Multiple devices

Never leave the UI stuck on a spinner.

Every async action must have:

Loading → Success → Error → Retry

states.

---

# 7. PROFILE SETUP

For a new customer collect:

* Full Name
* Mobile Number
* Email (optional)
* Profile photo (optional)

Then:

**Add Delivery Address**

Do not force users to fill unnecessary information.

---

# 8. LOCATION / ADDRESS FLOW

After login, request location intelligently.

Show:

"Where should we deliver your order?"

Options:

### Use Current Location

and

### Enter Address Manually

If location permission is denied:

Do NOT break the application.

Show manual address entry.

---

# 9. ADDRESS MANAGEMENT

Create proper address system.

Address fields:

* House / Flat / Shop Number
* Building / Society
* Street / Area
* Landmark
* City
* State
* Pincode
* Delivery instructions

Address labels:

* Home
* Work
* Other

Allow:

* Add address
* Edit address
* Delete address
* Set default address
* Select address during checkout

---

# 10. DELIVERY SERVICEABILITY

Before allowing checkout, validate whether selected address is serviceable.

If outside delivery area:

Show:

"Sorry, we currently don't deliver to this location."

Provide:

* Change address
* Select another saved address

Do NOT allow an order to proceed if delivery is unavailable.

---

# 11. HOME SCREEN

Upgrade the current screenshot into a real quick-commerce home experience.

Header:

* Store logo
* Store name
* Delivery location
* Change location
* Profile
* Cart

Example:

"Apni Kirana Store"

"Deliver to Home • Ghaziabad"

Then prominent search.

---

# 12. SEARCH

Search should be one of the most important elements.

Search placeholder:

"Search atta, dal, oil, biscuits..."

Support:

* Product name
* Brand
* Category
* Keywords
* Hindi/English variations where possible

Example:

"atta"

should find:

* Aashirvaad Atta
* Fortune Atta
* Chakki Atta

Search results should support:

* Product image
* Product name
* Weight
* Price
* Discount
* Add button

---

# 13. SEARCH EXPERIENCE

When user taps search:

Open dedicated search experience.

Include:

* Search input
* Back button
* Recent searches
* Popular searches
* Suggested products
* Search results
* Category suggestions

When typing:

Show live suggestions.

Example:

User types:

"bis"

Suggestions:

* Biscuits
* Biscuit packs
* Parle-G
* Britannia
* Cookies

---

# 14. CATEGORIES

Create proper category navigation.

Example:

* All Items
* Atta & Flour
* Rice & Grains
* Pulses & Dal
* Oil & Ghee
* Spices & Masala
* Salt & Sugar
* Dairy & Bread
* Biscuits & Snacks
* Tea & Coffee
* Beverages
* Instant Food
* Dry Fruits
* Personal Care
* Cleaning
* Household
* Baby Care
* Pet Care
* Other

Category page:

* Category header
* Subcategories
* Sorting
* Filters
* Product grid/list
* Sticky cart summary

---

# 15. PRODUCT CARD

Every product card should feel production-ready.

Display:

* Product image
* Product name
* Brand
* Weight/quantity
* MRP
* Selling price
* Discount
* Add button

After adding:

Replace:

ADD

with quantity control:

[-] 1 [+]

Do not navigate away from the product listing when quantity changes.

---

# 16. PRODUCT DETAIL PAGE

When clicking a product:

Show:

* Large product image
* Product name
* Brand
* Weight
* MRP
* Selling price
* Discount percentage
* Product description
* Ingredients if applicable
* Nutrition information if applicable
* Availability
* Delivery estimate
* Quantity selector
* Add to cart
* Similar products
* Frequently bought together

Bottom CTA:

"Add to Cart"

---

# 17. INVENTORY AWARENESS

Never allow customers to purchase unavailable products.

Product states:

### In Stock

Show ADD.

### Low Stock

Show:

"Only 3 left"

### Out of Stock

Disable add button.

Show:

"Out of Stock"

Optional:

"Notify me when available"

---

# 18. CART

Cart should be a dedicated production-level experience.

Header:

"Your Cart"

Show:

* Products
* Product image
* Product name
* Quantity
* Unit price
* Quantity controls
* Remove
* Save for later if implemented

Pricing section:

Subtotal

Discount

Delivery Fee

Platform Fee if applicable

Tax

Grand Total

Savings:

"You saved ₹XX"

---

# 19. CART INTELLIGENCE

Show useful messages:

Example:

"Add ₹99 more for FREE delivery"

Progress bar:

₹401 / ₹500

FREE DELIVERY

Also:

"Free delivery unlocked 🎉"

Cross-sell:

"You may also need"

Examples:

* Bread
* Milk
* Eggs
* Biscuits

But do not make the UI cluttered.

---

# 20. EMPTY CART

Create a proper empty state.

Show:

* Grocery illustration
* "Your cart is empty"
* "Add your daily essentials"
* Browse Products CTA

---

# 21. CHECKOUT FLOW

Checkout should be extremely clear.

Step structure:

### 1. Delivery Address

Selected address

Change button

### 2. Delivery Slot

Examples:

ASAP

25–35 mins

or available slots:

7:00–8:00 AM

8:00–9:00 AM

etc.

### 3. Payment Method

Options:

* UPI
* Card
* Net Banking
* Cash on Delivery
* Wallet if implemented

### 4. Order Summary

Final pricing.

### 5. Place Order

Large CTA:

"Place Order • ₹XXX"

---

# 22. DELIVERY SLOT LOGIC

Store configuration should control:

* Store opening time
* Store closing time
* Delivery hours
* Delivery slots
* Maximum orders per slot
* Same-day delivery
* ASAP delivery

If store is closed:

Show:

"Store is currently closed"

"Opens at 7:00 AM"

Allow browsing but prevent checkout if necessary.

---

# 23. PAYMENT FLOW

Payment architecture should support real payment gateway integration.

Do not fake payment success.

Payment states:

* Initiating
* Processing
* Success
* Failed
* Cancelled
* Timeout

If payment fails:

Show:

"Payment failed"

Buttons:

"Try Again"

"Change Payment Method"

If payment succeeds:

Create confirmed order.

Prevent duplicate order creation if user taps payment multiple times.

---

# 24. CASH ON DELIVERY

If enabled by owner:

Show:

"Cash on Delivery"

If disabled:

Do not display it.

Admin controls payment methods.

---

# 25. ORDER SUCCESS

After successful order:

Create beautiful confirmation screen.

Example:

🎉

"Order Confirmed!"

"Order #AKS1024"

"Arriving in 25–35 minutes"

Show:

* Delivery address
* Payment method
* Total
* Order summary

CTA:

"Track Order"

Secondary:

"Continue Shopping"

---

# 26. ORDER TRACKING

Create a proper order tracking page.

Timeline:

✓ Order Placed

✓ Order Confirmed

✓ Preparing

✓ Ready for Delivery

✓ Out for Delivery

✓ Delivered

Use timestamps.

Example:

10:32 PM
Order placed

10:34 PM
Store accepted your order

10:42 PM
Order is being packed

10:51 PM
Out for delivery

11:10 PM
Delivered

---

# 27. ORDER STATUS SYSTEM

Backend statuses:

PENDING_PAYMENT

PAYMENT_FAILED

PLACED

CONFIRMED

PREPARING

READY_FOR_PICKUP

OUT_FOR_DELIVERY

DELIVERED

CANCELLED

REFUNDED

RETURN_REQUESTED

RETURNED

Do not hardcode status logic inside UI.

Create centralized order-status mapping.

---

# 28. ORDER HISTORY

Profile → My Orders

Show:

* Order ID
* Date
* Number of items
* Total
* Status
* Delivery address
* Payment method

Actions:

"View Details"

"Track Order"

"Reorder"

---

# 29. REORDER

User can reorder a previous order.

If all products available:

Add all to cart.

If some products unavailable:

Show:

"3 products are unavailable."

Allow:

"Add Available Items"

Never silently add unavailable products.

---

# 30. PROFILE

Customer profile should contain:

* Name
* Mobile
* Email
* Profile image

Sections:

### My Account

* My Orders
* Saved Addresses
* Payment Methods
* Favorites
* Notifications

### Support

* Help Center
* Contact Store
* Report an Issue

### App

* Install App
* Notifications
* Terms
* Privacy Policy
* About Store

### Account

* Logout
* Delete Account

---

# 31. FAVORITES / WISHLIST

Allow users to save frequently purchased products.

Heart icon on product cards.

Profile:

"Saved Items"

If product becomes unavailable:

Show unavailable state.

---

# 32. NOTIFICATIONS

Create notification architecture.

Customer notifications:

* Order confirmed
* Order preparing
* Out for delivery
* Delivered
* Payment failed
* Promotional offers
* Back in stock
* Important store announcements

Allow notification preferences.

Do not spam users.

---

# 33. PWA REQUIREMENTS

This MUST be a real PWA.

Implement:

* Web App Manifest
* App icons
* Splash configuration
* Install prompt
* Service worker
* Offline fallback
* Cache strategy
* Network detection
* Update handling
* Standalone display
* Mobile browser compatibility

When user visits repeatedly:

Show a subtle:

"Install Apni Kirana Store"

prompt.

Do not show it repeatedly after dismissal.

---

# 34. OFFLINE EXPERIENCE

If internet disappears:

Do not show a broken application.

Show:

"You're offline"

Allow cached browsing where possible.

Cart should persist locally.

When connection returns:

Synchronize safely.

Never create duplicate orders due to reconnect.

---

# 35. MOBILE UX

Primary target:

Mobile phones.

Support:

* 320px
* 360px
* 375px
* 390px
* 414px
* 430px

No horizontal scrolling.

Buttons must be touch-friendly.

Minimum touch target around 44px.

Use bottom navigation.

---

# 36. TABLET UX

The application should adapt beautifully to tablets.

Do NOT simply stretch the mobile UI.

Use:

* Responsive content width
* Proper grid columns
* Larger product cards
* Optimized spacing
* Adaptive navigation

---

# 37. DESKTOP UX

Desktop should not look like an enlarged mobile screen.

Use:

* Centered content container
* Multi-column product grid
* Proper navigation
* Larger search
* Better whitespace
* Responsive cart experience

---

# 38. BOTTOM NAVIGATION

Customer mobile navigation:

Home

Categories

Search

Orders

Profile

Cart should remain highly visible as a floating/sticky element or header action.

Do not overload bottom navigation.

---

# 39. MICRO INTERACTIONS

Add subtle production-level animations:

* Add-to-cart animation
* Quantity transition
* Skeleton loading
* Button press feedback
* Page transitions
* Toast notifications
* Cart count animation
* Order status animation

Animations must be fast and subtle.

Avoid excessive animation.

---

# 40. LOADING STATES

Every page must have skeleton loading.

Do NOT show blank white screens.

Examples:

Product skeleton

Category skeleton

Order skeleton

Profile skeleton

Cart skeleton

---

# 41. ERROR STATES

Every major screen needs:

### Loading

Skeleton

### Empty

Helpful empty state

### Error

Clear message

### Retry

Retry button

Example:

"Something went wrong while loading products."

"Try Again"

---

# 42. TOAST SYSTEM

Create centralized toast notifications.

Examples:

"Added to cart"

"Removed from cart"

"Address saved"

"Order placed successfully"

"Payment failed"

"Product is out of stock"

Do not create random alert() dialogs.

---

# 43. PRODUCT DATA MODEL

Product should support:

id

name

slug

description

brand

categoryId

subcategoryId

images

thumbnail

unit

quantity

mrp

sellingPrice

discount

tax

stockQuantity

lowStockThreshold

isAvailable

isFeatured

isPopular

isActive

createdAt

updatedAt

---

# 44. CATEGORY DATA MODEL

Category:

id

name

slug

image

icon

description

sortOrder

isActive

createdAt

updatedAt

---

# 45. CUSTOMER DATA MODEL

Customer:

id

name

phone

email

avatar

addresses

defaultAddressId

favorites

notificationPreferences

createdAt

updatedAt

lastLoginAt

---

# 46. ORDER DATA MODEL

Order:

id

orderNumber

customerId

items

address

subtotal

discount

deliveryFee

tax

total

paymentMethod

paymentStatus

orderStatus

deliverySlot

estimatedDeliveryTime

notes

createdAt

updatedAt

cancelledAt

deliveredAt

---

# 47. CART DATA MODEL

Cart:

customerId

items

subtotal

discount

deliveryFee

total

updatedAt

Cart must persist for authenticated users.

For guests, local cart can be maintained and merged after login.

---

# 48. GUEST CART

Important:

Do NOT force authentication immediately when user opens the store.

Allow:

Browse → Search → Add to Cart

Then when they try checkout:

"Login to continue"

After login:

Merge guest cart into customer cart.

This creates a much smoother experience.

---

# 49. CART PERSISTENCE

If user:

* refreshes page
* closes browser
* reopens PWA
* navigates between pages

cart should remain.

Do not lose cart items.

---

# 50. OWNER / ADMIN PORTAL

Create a completely separate owner experience.

Owner login:

Secure authentication.

Dashboard:

### Today's Overview

* Orders
* Revenue
* Pending Orders
* Preparing Orders
* Delivered
* Cancelled
* Low Stock Products
* New Customers

---

# 51. ADMIN ORDER MANAGEMENT

Orders table:

Order ID

Customer

Items

Amount

Payment

Status

Date

Actions

Click order:

Show complete order detail.

Owner actions:

Confirm

Start Preparing

Mark Ready

Mark Out for Delivery

Mark Delivered

Cancel

Refund where applicable

Every status change should be logged.

---

# 52. ORDER DETAIL ADMIN

Show:

Customer information

Phone

Delivery address

Items

Quantity

Price

Subtotal

Discount

Delivery fee

Tax

Total

Payment information

Order timeline

Internal notes

Customer notes

Status history

---

# 53. INVENTORY MANAGEMENT

Admin can:

* Add product
* Edit product
* Delete/archive product
* Update price
* Update stock
* Set low-stock threshold
* Mark out of stock
* Upload product images
* Assign category
* Assign brand
* Set offer
* Set featured
* Set popular

Bulk inventory update should be supported if practical.

---

# 54. INVENTORY ALERTS

Dashboard should show:

Low Stock

Out of Stock

Fast Moving Products

Dead Stock

Admin should quickly understand what requires action.

---

# 55. CATEGORY MANAGEMENT

Owner can:

* Create category
* Edit category
* Reorder category
* Enable/disable category
* Upload category image
* Create subcategory

---

# 56. OFFERS / COUPONS

Admin can create:

* Percentage discount
* Flat discount
* Product discount
* Category discount
* Minimum order discount
* First-order discount
* Coupon code
* Free delivery coupon

Configuration:

* Start date
* End date
* Usage limit
* Minimum cart value
* Maximum discount
* User eligibility

---

# 57. STORE SETTINGS

Owner can configure:

Store name

Logo

Phone

Address

Opening hours

Closing hours

Delivery radius

Minimum order

Delivery fee

Free delivery threshold

COD availability

Online payment availability

Delivery slots

Store status

Holiday mode

---

# 58. STORE OPEN/CLOSED

When store is closed:

Customer can still browse.

But checkout behavior should respect store settings.

Display:

"Store closed"

"Opens tomorrow at 7:00 AM"

If pre-orders are supported:

Allow scheduling.

Otherwise disable checkout.

---

# 59. POS

Owner should have a simple POS screen.

POS flow:

Search product

Add product

Change quantity

Customer optional

Payment method

Discount

Total

Complete sale

Generate receipt/order.

POS sales should reduce inventory automatically.

---

# 60. INVENTORY SYNCHRONIZATION

Critical:

Customer order and POS sale must use the same inventory source.

If:

Stock = 1

Customer buys it

Stock becomes 0.

If POS sells it first:

Customer should see out-of-stock.

Prevent overselling using server-side validation.

---

# 61. AUDIT LOG

For important admin operations store:

* Who performed action
* What changed
* Previous value
* New value
* Timestamp
* IP/device where appropriate

Examples:

Price changed

Stock changed

Order status changed

Product deleted

Coupon created

---

# 62. SECURITY

Never trust frontend pricing.

Backend must calculate:

* Product price
* Discount
* Tax
* Delivery fee
* Final total

Never accept final total blindly from client.

Validate:

* Authentication
* Authorization
* Order ownership
* Product availability
* Stock
* Coupon validity
* Payment status

Owner-only routes must be protected.

Customer must never access admin APIs.

---

# 63. ROUTING

Use clean routes.

Customer:

/

/login

/verify-otp

/profile/setup

/location

/home

/search

/categories

/category/[slug]

/product/[slug]

/cart

/checkout

/checkout/address

/checkout/payment

/order/success/[id]

/orders

/orders/[id]

/profile

/profile/addresses

/profile/favorites

/help

Admin:

/admin

/admin/login

/admin/orders

/admin/orders/[id]

/admin/products

/admin/products/new

/admin/products/[id]

/admin/categories

/admin/inventory

/admin/customers

/admin/coupons

/admin/pos

/admin/analytics

/admin/settings

---

# 64. DEEP LINKING

Important:

If a user opens:

/product/aashirvaad-atta

directly,

the page must work.

If user opens:

/orders/123

directly,

authentication should be checked and then appropriate access granted.

Do not depend on navigating from home.

---

# 65. URL / STATE MANAGEMENT

Search filters, category selection, sorting and pagination should be URL/state aware where appropriate.

Browser back button must work correctly.

Do not destroy user's navigation history.

---

# 66. RESPONSIVE DESIGN REQUIREMENT

The entire application must be tested conceptually for:

Mobile portrait

Mobile landscape

Tablet portrait

Tablet landscape

Laptop

Desktop

Large desktop

There must be no:

* overflow
* clipped text
* broken cards
* overlapping buttons
* unusable modals
* hidden checkout CTA
* broken bottom navigation

---

# 67. VISUAL DESIGN DIRECTION

Use the current green grocery-store identity as the base.

Design should feel:

Fresh

Premium

Trustworthy

Local

Fast

Clean

Modern

Friendly

Avoid making it look like a generic dashboard template.

Use:

* Strong typography hierarchy
* Bold section headings
* Premium cards
* Consistent border radius
* Soft shadows
* Clean spacing
* Strong CTA hierarchy
* High-quality grocery imagery/icons
* Green as primary brand color
* White/light neutral surfaces

Yellow can be used selectively for offers/promotions.

Do not overuse gradients.

---

# 68. FIX CURRENT HOME SCREEN

The screenshot currently has excessive empty space around the mobile viewport when viewed in desktop development mode.

Do not optimize only for the device simulator.

The actual application should have a responsive centered max-width on desktop and a full-width layout on mobile.

On mobile:

Full viewport width.

On tablet:

Comfortable content width.

On desktop:

Centered app shell or full responsive storefront depending on route.

---

# 69. HERO SECTION

Keep the current promotional hero concept but improve it.

Hero should include:

Store offer

Headline

Supporting text

CTA

Secondary CTA if useful

Visual grocery decoration

But do not make hero consume excessive screen space.

The product catalog should appear quickly.

---

# 70. HOME PAGE INFORMATION HIERARCHY

Recommended order:

Header

Location

Search

Promotional banner

Quick categories

Popular products

Deals

Frequently bought

Recommended products

Recently purchased

Store information

Footer

The exact sections should be data-driven.

---

# 71. QUICK ADD UX

Customer should be able to add products without opening product details.

Example:

Product

₹149

[-] 1 [+]

This is critical for grocery shopping speed.

---

# 72. STICKY CART

When cart contains products:

Show sticky cart CTA.

Example:

"3 items • ₹487"

"View Cart →"

Do not cover important content.

Animate it when cart changes.

---

# 73. CHECKOUT CTA

Checkout CTA must remain visible.

On mobile use sticky bottom CTA where appropriate.

Respect safe-area padding for modern phones.

---

# 74. ACCESSIBILITY

Implement:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Proper labels
* Alt text
* ARIA where needed
* Sufficient contrast
* Screen-reader-friendly buttons

Do not use icons without accessible labels.

---

# 75. PERFORMANCE

Optimize for low-end/mobile devices.

Requirements:

* Lazy-load images
* Responsive images
* Avoid huge JavaScript bundles
* Code split heavy routes
* Optimize fonts
* Cache static assets
* Avoid unnecessary re-renders
* Debounce search
* Paginate large product lists

The home page should feel fast even on average mobile internet.

---

# 76. IMAGE HANDLING

Product images should:

* Maintain aspect ratio
* Have proper placeholders
* Lazy load
* Show skeleton while loading
* Handle broken images gracefully

Never allow broken image icons to ruin the UI.

---

# 77. DATABASE

Use a proper database structure.

Do not store the entire application in one giant JSON object.

Create logical entities:

users

addresses

products

categories

carts

orders

orderItems

payments

coupons

inventory

notifications

settings

auditLogs

favorites

deliverySlots

---

# 78. API ARCHITECTURE

Separate:

Customer APIs

Admin APIs

Authentication APIs

Payment APIs

Order APIs

Inventory APIs

Notification APIs

Never expose admin-only operations to public client code.

---

# 79. API ERROR STANDARD

Use consistent response structure.

Example:

success

data

message

error

code

Do not return random formats from different endpoints.

---

# 80. FORM VALIDATION

All forms require validation.

Examples:

Phone

OTP

Name

Email

Address

Pincode

Coupon

Product

Price

Stock

Do validation on both:

Frontend

Backend

---

# 81. SECURITY AGAINST COMMON ISSUES

Handle:

* Unauthorized API access
* IDOR
* Invalid order IDs
* Price manipulation
* Coupon manipulation
* Quantity manipulation
* Stock manipulation
* Duplicate payment
* Duplicate order
* Session expiration
* Admin privilege escalation

Never trust client-side values.

---

# 82. ANALYTICS

Admin analytics should show:

Today's sales

Weekly sales

Monthly sales

Orders

Average order value

Top products

Top categories

Repeat customers

Cancelled orders

Payment breakdown

Inventory movement

---

# 83. CUSTOMER EXPERIENCE ANALYTICS

Track useful events:

App opened

Search performed

Product viewed

Product added

Product removed

Cart opened

Checkout started

Payment started

Order completed

Order cancelled

Reorder clicked

Do not collect unnecessary personal data.

---

# 84. SEO / PWA

Public storefront pages should have:

* Proper title
* Meta description
* Open Graph
* Canonical URLs
* Structured product metadata where appropriate
* Semantic headings

---

# 85. PWA INSTALL EXPERIENCE

Detect:

Android Chrome install capability

iOS Safari install instructions

Desktop install capability

Show contextual install UI.

Do not aggressively interrupt shopping.

---

# 86. NETWORK HANDLING

Display a small offline indicator when internet is lost.

When network returns:

"Back online"

Then synchronize safe local state.

---

# 87. REAL-TIME ORDER UPDATES

If backend supports real-time updates:

Customer order tracking should update without refresh.

Admin order dashboard should receive new orders without manually refreshing.

Use appropriate real-time mechanism.

Do not poll aggressively.

---

# 88. ORDER CANCELLATION

Customer can cancel only when allowed by store/order state.

Example:

PLACED → Can cancel

CONFIRMED → Maybe cancel

PREPARING → Usually cannot cancel

OUT_FOR_DELIVERY → Cannot cancel

The exact rule should be configurable.

If cancellation allowed:

Ask confirmation.

Show cancellation reason.

Update order.

Trigger refund flow where applicable.

---

# 89. REFUND

Payment/refund state must be separate from order state.

Examples:

Refund pending

Refund processed

Refund failed

Do not mark a refund successful just because order was cancelled.

---

# 90. CUSTOMER SUPPORT

Create support entry points.

Examples:

"Need help with this order?"

Options:

* Order not received
* Missing item
* Wrong item
* Damaged item
* Payment issue
* Other

Allow customer to submit issue against specific order.

Admin should see support issues.

---

# 91. PRODUCT SUBSTITUTION

Optional but production-ready grocery feature.

If product becomes unavailable:

Customer preference:

* Replace with similar product
* Remove unavailable item
* Contact me

Owner can handle substitutions.

---

# 92. COUPON UX

Checkout coupon section:

"Have a coupon?"

Tap:

Enter code

Apply

Show:

Coupon applied

Discount amount

Remove coupon

Invalid coupon must show a clear reason.

---

# 93. DELIVERY FEE LOGIC

Example:

Order below ₹499:

Delivery ₹30

Order ₹499+:

FREE DELIVERY

But this must come from store settings.

Never hardcode business rules inside components.

---

# 94. STORE CONFIGURATION

All business rules should be configurable from admin.

Examples:

Minimum order

Free delivery threshold

Delivery fee

Tax

Store timing

Delivery radius

COD

Coupons

Offers

Order cancellation

Delivery slots

---

# 95. DATABASE / STATE PRINCIPLE

Separate:

Server state

Local UI state

Persistent customer state

Do not put everything into one global state store.

Use proper caching and invalidation.

---

# 96. COMPONENT ARCHITECTURE

Create reusable components.

Examples:

Header

SearchBar

CategoryCard

ProductCard

QuantitySelector

CartBar

ProductGrid

PriceBreakdown

AddressCard

PaymentMethod

OrderTimeline

StatusBadge

EmptyState

ErrorState

Skeleton

Toast

Modal

BottomSheet

---

# 97. DESIGN SYSTEM

Create centralized design tokens.

Define:

Colors

Typography

Spacing

Radius

Shadows

Buttons

Inputs

Cards

Badges

Modals

Bottom sheets

Do not manually create random styles on every page.

---

# 98. DARK MODE

Do not make dark mode mandatory for the first version unless already implemented.

If implemented, every component must support it properly.

Never leave white cards with unreadable text in dark mode.

---

# 99. RESPONSIVE MODALS

On mobile:

Use bottom sheets where appropriate.

On desktop:

Use centered modal.

Do not show tiny desktop-style modal on a phone.

---

# 100. MOBILE BOTTOM SHEETS

Use for:

* Address selection
* Filters
* Sort
* Payment selection
* Coupon selection

Bottom sheets should:

* Close with swipe where practical
* Have clear close button
* Respect safe area
* Not trap user unexpectedly

---

# 101. FIRST-TIME CUSTOMER JOURNEY

The final flow should look like:

OPEN PWA

↓

Splash

↓

Check authentication

↓

If new:

Login

↓

OTP / Google

↓

Profile

↓

Location

↓

Address

↓

HOME

↓

Search / Categories

↓

Product

↓

Add to Cart

↓

Cart

↓

Checkout

↓

Address

↓

Delivery

↓

Payment

↓

Order Confirmation

↓

Live Tracking

↓

Delivered

↓

Order History

↓

Reorder

This complete journey must work.

---

# 102. RETURNING CUSTOMER JOURNEY

Returning user:

Open PWA

↓

Session restored

↓

Home

↓

Current delivery location automatically selected

↓

Search / Browse

↓

Add

↓

Cart

↓

Checkout

↓

Pay

↓

Track

Do NOT ask returning users to login again unless session expired.

---

# 103. GUEST JOURNEY

Guest:

Open

↓

Browse

↓

Search

↓

Add to cart

↓

Cart

↓

Checkout

↓

Login required

↓

OTP / Google

↓

Cart restored

↓

Address

↓

Payment

↓

Order

Never lose guest cart during login.

---

# 104. ADMIN JOURNEY

Owner:

Login

↓

Dashboard

↓

New order notification

↓

Order details

↓

Confirm

↓

Prepare

↓

Ready

↓

Out for delivery

↓

Delivered

↓

Inventory updated

↓

Analytics updated

Everything should remain synchronized.

---

# 105. DEMO / TRIAL REQUIREMENT

Because this will be shown in a trial/demo tomorrow:

Create a realistic seeded/demo dataset.

Include:

At least 30–50 grocery products.

Categories.

Product images.

Different prices.

Discounted products.

Low-stock products.

Out-of-stock products.

Sample orders.

Sample customer.

Sample offers.

This should make the application feel alive immediately.

---

# 106. DEMO DATA QUALITY

Use realistic Indian grocery data.

Examples:

Aashirvaad Atta

Fortune Oil

Tata Salt

Tata Tea

Parle-G

Britannia

Amul Milk

India Gate Rice

MDH Masala

Maggi

etc.

Do not use "Product 1", "Product 2" placeholders in the final demo.

---

# 107. EMPTY DATABASE HANDLING

If database has no products:

Admin should be able to add them.

Customer should see:

"Store is getting ready"

rather than broken UI.

---

# 108. TEST ACCOUNT / DEMO MODE

Provide a safe development/demo configuration where appropriate.

For local development, make it easy to test:

Customer

Admin

Orders

Payments

Inventory

Do NOT put real production secrets in frontend code.

---

# 109. ENVIRONMENT VARIABLES

Sensitive configuration must use environment variables.

Examples:

DATABASE_URL

AUTH_SECRET

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

PAYMENT_KEY

PAYMENT_SECRET

PUBLIC_STORE_NAME

PUBLIC_STORE_PHONE

Never hardcode secrets.

---

# 110. PRODUCTION ERROR HANDLING

No raw errors should be shown to users.

Instead of:

"Cannot read properties of undefined"

show:

"Something went wrong. Please try again."

Log technical error details separately.

---

# 111. OBSERVABILITY

Prepare architecture for:

* Error logging
* API logging
* Order audit logs
* Payment logs
* Authentication logs

Never log passwords, OTPs, payment secrets or sensitive personal data.

---

# 112. FINAL UI QUALITY CHECK

Before considering any page complete, check:

Spacing

Typography

Alignment

Responsive behavior

Loading

Empty state

Error state

Hover state

Active state

Disabled state

Mobile behavior

Tablet behavior

Desktop behavior

Accessibility

Keyboard navigation

Touch interaction

Safe-area handling

---

# 113. DO NOT DO THESE THINGS

Do NOT:

* Create fake buttons
* Create dead links
* Use placeholder lorem ipsum
* Use random fake data in UI after seed setup
* Hardcode prices
* Hardcode delivery fee
* Hardcode stock
* Hardcode order totals
* Store secrets in frontend
* Use alert()
* Lose cart on refresh
* Lose cart after login
* Allow checkout with out-of-stock products
* Allow duplicate orders
* Allow frontend price manipulation
* Break browser back navigation
* Create desktop-only UI
* Create mobile-only UI
* Overuse animations
* Copy Blinkit/Zepto branding

---

# 114. DEVELOPMENT APPROACH

Do not rebuild everything blindly.

First inspect the existing project.

Understand:

* Existing framework
* Existing components
* Existing routes
* Existing database
* Existing authentication
* Existing styling
* Existing state management
* Existing PWA configuration

Then improve the architecture.

Reuse good existing components where appropriate.

Refactor duplicated code.

Do not create unnecessary dependencies.

---

# 115. IMPLEMENTATION PRIORITY

Build in this order:

### PHASE 1 — Foundation

Authentication

PWA

Responsive shell

Navigation

Database models

API structure

Design system

### PHASE 2 — Customer

Home

Search

Categories

Products

Product details

Cart

Address

Checkout

Payment architecture

### PHASE 3 — Orders

Order creation

Order tracking

Order history

Reorder

Notifications

### PHASE 4 — Admin

Dashboard

Orders

Inventory

Products

Categories

Coupons

Customers

POS

Settings

### PHASE 5 — Production Polish

Loading

Error handling

Animations

Accessibility

Performance

PWA install

Offline handling

Responsive QA

Security

Audit logs

Analytics

---

# 116. FINAL ACCEPTANCE CRITERIA

The project is NOT complete merely because pages exist.

It is complete only when a user can realistically perform:

NEW USER:

Open app

→ Login with OTP

→ Complete profile

→ Select address

→ Browse store

→ Search product

→ Add products

→ Open cart

→ Checkout

→ Select address

→ Select delivery

→ Select payment

→ Place order

→ See confirmation

→ Track order

→ See delivered order

→ Reorder later

---

RETURNING USER:

Open app

→ Session restored

→ Browse

→ Add products

→ Checkout

→ Order

No unnecessary login.

---

OWNER:

Login

→ Dashboard

→ Receive order

→ Confirm

→ Prepare

→ Mark ready

→ Out for delivery

→ Delivered

→ Inventory automatically updated

→ Sales reflected in analytics.

---

# 117. MOST IMPORTANT REQUIREMENT

Do NOT build this like a college project or simple CRUD application.

Build it like a **real local quick-commerce grocery product**.

The user should feel:

"Ye actual Kirana delivery app hai."

The owner should feel:

"Isse main apni dukaan operate kar sakta hoon."

The application should feel:

**Fast + Premium + Local + Trustworthy + Production Ready.**

Every interaction must have a clear purpose.

Every important action must have loading, success and error states.

Every business rule must be configurable.

Every critical operation must be validated server-side.

Every screen must be responsive.

Every customer flow must be complete.

Do not stop after creating the UI.

**Implement the complete end-to-end experience and then perform a final production-readiness audit across customer, admin, PWA, responsive design, security, performance, data integrity, payments, orders and inventory.**
