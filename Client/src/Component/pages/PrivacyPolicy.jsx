// client/src/pages/PrivacyPolicy.jsx
import PolicyLayout, { PolicySection } from "../common/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="August 2026">
      <PolicySection title="1. Introduction">
        <p>
          This Privacy Policy explains how Naari collects, uses, and protects
          your personal information when you use our website. We are committed
          to handling your data responsibly and transparently.
        </p>
      </PolicySection>

      <PolicySection title="2. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>
            Account information: name, email address, phone number, password
            (stored securely, never in plain text)
          </li>
          <li>Shipping information: delivery address, city, state, pincode</li>
          <li>
            Order information: items purchased, order history, payment status
          </li>
          <li>
            Communications: messages you send us via our Contact form or
            testimonials
          </li>
          <li>
            Technical information: IP address, browser type, and basic usage
            data for security and site improvement
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="3. How We Use Your Information">
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>To process and deliver your orders</li>
          <li>
            To communicate order updates, shipping status, and account
            notifications
          </li>
          <li>To respond to your enquiries and support requests</li>
          <li>To improve our website, products, and customer experience</li>
          <li>To prevent fraud and maintain the security of our platform</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </PolicySection>

      <PolicySection title="4. Payment Information">
        <p>
          All payments are processed securely through Razorpay. Naari does not
          collect or store your card, UPI, or net banking credentials on its own
          servers — this information is handled entirely by our payment gateway
          partner in compliance with applicable security standards.
        </p>
      </PolicySection>

      <PolicySection title="5. Data Sharing">
        <p>
          We share your information only where necessary to operate our
          business, specifically with:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Payment processors (Razorpay), to complete transactions</li>
          <li>Courier and logistics partners, to deliver your orders</li>
          <li>
            Cloud service providers (such as our hosting and image storage
            providers), who process data on our behalf under confidentiality
            obligations
          </li>
        </ul>
        <p>
          We do not share your data with third parties for their own marketing
          purposes.
        </p>
      </PolicySection>

      <PolicySection title="6. Data Retention">
        <p>
          We retain your account and order information for as long as your
          account remains active, or as needed to comply with legal, tax, and
          accounting obligations.
        </p>
      </PolicySection>

      <PolicySection title="7. Your Rights">
        <p>
          You can access and update your account details at any time from your
          Account page. You may request deletion of your account and associated
          personal data by contacting us, subject to any records we are legally
          required to retain.
        </p>
      </PolicySection>

      <PolicySection title="8. Cookies">
        <p>
          We use essential cookies to keep you securely logged in and to
          remember items in your cart. We do not currently use third-party
          advertising or tracking cookies.
        </p>
      </PolicySection>

      <PolicySection title="9. Data Security">
        <p>
          We use industry-standard measures — including encrypted password
          storage and secure HTTPS connections — to protect your information.
          However, no method of transmission over the internet is completely
          secure, and we cannot guarantee absolute security.
        </p>
      </PolicySection>

      <PolicySection title="10. Children's Privacy">
        <p>
          Our services are not directed at children under 18. We do not
          knowingly collect personal information from children.
        </p>
      </PolicySection>

      <PolicySection title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. Significant changes
          will be reflected by updating the "Last updated" date at the top of
          this page.
        </p>
      </PolicySection>

      <PolicySection title="12. Contact Us">
        <p>
          For questions about this Privacy Policy or your personal data, reach
          us through our{" "}
          <a href="/contact" className="text-[#D4A34E] underline">
            Contact page
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="4. Marketing Communications">
        <p>
          By creating an account or making a purchase on Naari, you consent to
          receive promotional and marketing communications from us via email and
          WhatsApp, including but not limited to new collection launches,
          festive offers, styling guides, and personalised recommendations.
        </p>
        <p>
          You can withdraw this consent at any time by clicking the
          "Unsubscribe" link included in any marketing email, or by messaging
          "STOP" to our WhatsApp number, or by contacting us directly through
          our{" "}
          <a href="/contact" className="text-[#D4A34E] underline">
            Contact page
          </a>
          . Opting out of marketing communications does not affect order
          confirmations, shipping updates, or other essential transactional
          messages related to your purchases, which we will continue to send as
          part of fulfilling your order.
        </p>
      </PolicySection>

      <PolicySection title="8. Marketing Communications">
        <p>
          By registering an account or placing an order, you agree to receive
          promotional messages from Naari via email and WhatsApp regarding new
          arrivals, offers, and updates. You may opt out at any time as
          described in our{" "}
          <a href="/privacy" className="text-[#D4A34E] underline">
            Privacy Policy
          </a>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
