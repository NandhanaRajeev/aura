import React from 'react';

const TermsOfUse = () => {
  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif', lineHeight: '1.7', color: '#333' }}>
      <h1 style={{ textAlign: 'center', color: '#2b2b2b', marginBottom: '2rem' }}>Terms of Use</h1>

      <p><strong>Effective Date:</strong> April 30, 2025</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the Aura website, you agree to comply with and be bound by these Terms of Use and our Privacy Policy.</p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>You must be at least 13 years of age to access our services. Users under the age of 18 must obtain parental or guardian consent.</p>
      </section>

      <section>
        <h2>3. Permitted Use</h2>
        <p>You agree to use this website for lawful purposes only and not engage in any activity that violates the rights of others.</p>
      </section>

      <section>
        <h2>4. Account Responsibility</h2>
        <p>If you register an account, you are responsible for keeping your login credentials secure and for all activities under your account.</p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>All content on Aura—including text, graphics, logos, and software—is protected and owned by Aura or its content suppliers.</p>
      </section>

      <section>
        <h2>6. Prohibited Activities</h2>
        <ul>
          <li>Using the website for fraudulent or illegal purposes</li>
          <li>Accessing data without permission</li>
          <li>Replicating or reselling our content or services</li>
        </ul>
      </section>

      <section>
        <h2>7. Suspension & Termination</h2>
        <p>We reserve the right to suspend or terminate your access if we believe you have violated any of these Terms.</p>
      </section>

      <section>
        <h2>8. Disclaimer</h2>
        <p>The site is provided “as is.” Aura makes no guarantees regarding uptime, reliability, or accuracy of information.</p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>Aura shall not be liable for any direct, indirect, or incidental damages resulting from the use or inability to use the site.</p>
      </section>

      <section>
        <h2>10. Changes to Terms</h2>
        <p>We may update these Terms from time to time. Any changes will be effective once posted on this page.</p>
      </section>

      <section>
        <h2>11. Governing Law</h2>
        <p>These Terms shall be governed in accordance with the laws of India, without regard to its conflict of law principles.</p>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Contact Us</h2>
        <p>If you have any questions about these Terms, feel free to reach out to us:</p>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li><strong>Phone:</strong> +91 - 8032142621</li>
          <li><strong>Email:</strong> <a href="mailto:aura@gmail.com" style={{ color: '#007BFF', textDecoration: 'none' }}>Aura@gmail.com</a></li>
        </ul>
      </section>
    </div>
  );
};

export default TermsOfUse;
