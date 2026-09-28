'use client';

import { LegalPage } from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="29 September 2026"
      sections={[
        {
          heading: 'About this service',
          body: (s) => (
            <p>
              This website/app is operated by {s.store_name}, a retail store in {s.city}. By placing an order you agree to these
              terms.
            </p>
          ),
        },
        {
          heading: 'Orders and availability',
          body: () => (
            <>
              <p>All orders are subject to stock availability. If an item runs out after you order, we will inform you and
                refund or remove it from the bill.</p>
              <p>Prices shown include applicable taxes. Product images are for reference; packaging may vary.</p>
            </>
          ),
        },
        {
          heading: 'Delivery',
          body: (s) => (
            <p>
              We deliver within about {s.delivery_radius_km} km of the store during store hours. Delivery times shown are
              estimates and may vary due to weather, traffic or order volume. A delivery fee of ₹{s.delivery_charge} applies to
              orders below ₹{s.free_delivery_above}. Minimum order value is ₹{s.min_order_amount}.
            </p>
          ),
        },
        {
          heading: 'Payment',
          body: () => <p>You pay the rider on delivery by cash or UPI. Please check your items before paying.</p>,
        },
        {
          heading: 'Your account',
          body: () => (
            <p>You are responsible for keeping your phone number and account secure. We may suspend accounts that misuse
              coupons, place fake orders or abuse delivery staff.</p>
          ),
        },
      ]}
    />
  );
}
