
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center mb-8 text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Effective Date: {currentDate}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p className="text-foreground">
                Welcome to Uthutho Maps ("we," "our," or "us"). Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our app.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              <p className="text-foreground mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Personal Information:</strong> When you create an account, we may collect your name, email, and phone number.</li>
                <li><strong>Location Data:</strong> To provide transport routes and nearby pickup spots, we may collect your real-time location with your permission.</li>
                <li><strong>Device Information:</strong> We may collect device type, operating system, and app usage data for analytics and performance improvements.</li>
                <li><strong>User Contributions:</strong> Messages in pickup spot chats and commuter updates may be stored to enhance community engagement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-foreground mb-4">We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Provide and improve our transport navigation services.</li>
                <li>Show relevant routes, transport hubs, and commuter updates.</li>
                <li>Enhance user safety by enabling real-time alerts and location-based features.</li>
                <li>Comply with legal obligations and prevent fraudulent activities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">4. Data Sharing & Third Parties</h2>
              <p className="text-foreground mb-4">
                We do not sell your personal data. However, we may share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Service Providers:</strong> For app functionality, hosting, and analytics.</li>
                <li><strong>Legal Authorities:</strong> If required by law or to protect user safety.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">5. Data Security</h2>
              <p className="text-foreground">
                We use encryption and industry-standard security practices to protect your data. However, no online service is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">6. Your Choices & Rights</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Location Access:</strong> You can enable or disable location permissions in your device settings.</li>
                <li><strong>Account Deletion:</strong> You may request account deletion by contacting us.</li>
                <li><strong>Privacy Settings:</strong> You can manage preferences in the app settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">7. Children's Privacy</h2>
              <p className="text-foreground">
                Uthutho Maps is not intended for children under 13. We do not knowingly collect data from minors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">8. Changes to This Policy</h2>
              <p className="text-foreground">
                We may update this policy periodically. Any changes will be posted here with a revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">9. Contact Us</h2>
              <p className="text-foreground">If you have any questions, please contact us at:</p>
              <p className="text-foreground">📧 Email: info@uthuthomaps.com</p>
              <p className="text-foreground">🌐 Website: www.uthuthomaps.com/privacy</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
