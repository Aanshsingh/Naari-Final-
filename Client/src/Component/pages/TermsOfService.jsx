// client/src/pages/TermsOfService.jsx
import PolicyLayout, { PolicySection } from "../common/PolicyLayout";

export default function TermsOfService() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated="August 2026">
      <PolicySection title="1. Introduction">
        <p>
          These Terms of Service ("Terms") govern your use of the Naari website and any purchases
          made through it. By accessing or using our site, you agree to be bound by these Terms.
          If you do not agree, please do not use our services.
        </p>
      </PolicySection>

      <PolicySection title="2. Eligibility">
        <p>
          You must be at least 18 years old, or using the site under the supervision of a parent
          or guardian, to make a purchase. By placing an order, you confirm that the information
          you provide is accurate and complete.
        </p>
      </PolicySection>

      <PolicySection title="3. Products and Pricing">
        <p>
          All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless
          stated otherwise. We reserve the right to modify prices, discontinue products, or limit
          quantities at any time without prior notice. Product colours may vary slightly from
          images shown due to photography, lighting, and screen display differences — this is
          especially true of handwoven and hand-dyed fabrics.
        </p>
      </PolicySection>

      <PolicySection title="4. Orders and Payment">
        <p>
          Orders are confirmed only upon successful payment or, where offered, upon confirmation
          of a Cash on Delivery (COD) order. We use Razorpay to process online payments; we do not
          store your card or payment details on our servers. We reserve the right to cancel any
          order due to stock unavailability, pricing errors, or suspected fraudulent activity, in
          which case a full refund will be issued for any amount already paid.
        </p>
      </PolicySection>

      <PolicySection title="5. Shipping and Delivery">
        <p>
          Estimated delivery timelines are provided at checkout and on our Shipping &amp; Returns
          page. Delays may occur due to courier disruptions, weather, or circumstances beyond our
          control. Risk of loss and title for products pass to you upon delivery to the shipping
          address provided.
        </p>
      </PolicySection>

      <PolicySection title="6. Returns, Refunds, and Cancellations">
        <p>
          Please refer to our Returns &amp; Refunds Policy for detailed timelines and conditions.
          Customised, altered, or clearance-sale items may not be eligible for return.
        </p>
      </PolicySection>

      <PolicySection title="7. Account Responsibility">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activity that occurs under your account. Notify us immediately if you suspect
          unauthorised use of your account.
        </p>
      </PolicySection>

      <PolicySection title="8. Intellectual Property">
        <p>
          All content on this site — including the Naari name, logo, product photography, and
          written content — is the property of Naari and may not be reproduced, distributed, or
          used commercially without prior written permission.
        </p>
      </PolicySection>

      <PolicySection title="9. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Naari shall not be liable for any indirect,
          incidental, or consequential damages arising from your use of this site or products
          purchased through it. Our total liability for any claim shall not exceed the amount you
          paid for the relevant order.
        </p>
      </PolicySection>

      <PolicySection title="10. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of the courts of Faridabad, Haryana.
        </p>
      </PolicySection>

      <PolicySection title="11. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the site after changes are
          posted constitutes acceptance of the revised Terms.
        </p>
      </PolicySection>

      <PolicySection title="12. Contact Us">
        <p>
          For any questions about these Terms, reach us through our{" "}
          <a href="/contact" className="text-[#D4A34E] underline">Contact page</a>.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}