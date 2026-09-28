'use client';

import { LegalPage } from '@/components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="29 September 2026"
      sections={[
        {
          heading: 'What we collect',
          body: () => (
            <p>Your name, mobile number, optional email, delivery addresses, and the orders you place. We do not collect card or
              bank details.</p>
          ),
        },
        {
          heading: 'Why we use it',
          body: () => (
            <p>Only to deliver your orders, contact you about them, resolve support requests, and keep accounting records as
              required by law.</p>
          ),
        },
        {
          heading: 'Who we share it with',
          body: (s) => (
            <p>
              Your name, phone and address are shared with the {s.store_name} rider delivering your order. We do not sell your
              data or share it for advertising.
            </p>
          ),
        },
        {
          heading: 'Your choices',
          body: () => (
            <p>You can edit your profile and delete saved addresses at any time from your account. To delete your account and
              order history, contact the store.</p>
          ),
        },
      ]}
    />
  );
}
