'use client';

import { LegalPage } from '@/components/LegalPage';

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Cancellation & refunds"
      updated="29 September 2026"
      sections={[
        {
          heading: 'Cancelling an order',
          body: () => (
            <p>You can cancel from the order page until the store packs your order. After that, call the store — we’ll do our
              best to help. There is no charge for cancelling.</p>
          ),
        },
        {
          heading: 'Damaged, expired, missing or wrong items',
          body: () => (
            <p>Check your items when they arrive. If something is wrong, tell the rider or raise a request from Help within 24
              hours with your order number. We will replace the item or adjust the amount.</p>
          ),
        },
        {
          heading: 'Refunds',
          body: () => (
            <p>As orders are paid on delivery, most issues are settled at the door. If you have already paid, approved refunds
              are returned by UPI or cash within 3 working days.</p>
          ),
        },
        {
          heading: 'Non-returnable items',
          body: () => <p>Opened food items and personal-care products cannot be returned unless they were damaged or expired.</p>,
        },
      ]}
    />
  );
}
