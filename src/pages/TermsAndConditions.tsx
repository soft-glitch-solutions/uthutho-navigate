
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
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
          <h1 className="text-3xl font-bold mb-8 text-foreground">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-6">Effective Date: {currentDate}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-foreground">
                By accessing or using Uthutho Maps, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
              <p className="text-foreground">
                Uthutho Maps provides information about public transportation routes, schedules, and related services in South Africa. The service is intended to help users navigate public transport options efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
              <p className="text-foreground mb-4">By creating an account with Uthutho Maps:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to provide accurate and complete information when registering.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">4. User Conduct</h2>
              <p className="text-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Use our service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                <li>Harass, abuse, or harm another person through our service.</li>
                <li>Share inaccurate, misleading, or false information about transportation services.</li>
                <li>Interfere with or disrupt the service or servers or networks connected to the service.</li>
                <li>Attempt to gain unauthorized access to any portion of the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">5. Intellectual Property</h2>
              <p className="text-foreground">
                The Uthutho Maps service, including its content, features, and functionality, is owned by Uthutho Maps and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">6. Disclaimer of Warranties</h2>
              <p className="text-foreground">
                Uthutho Maps is provided "as is" and "as available" without any warranties of any kind. We do not guarantee the accuracy, timeliness, or reliability of any transportation information provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">7. Limitation of Liability</h2>
              <p className="text-foreground">
                In no event shall Uthutho Maps be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">8. Changes to Terms</h2>
              <p className="text-foreground">
                We reserve the right to modify these Terms and Conditions at any time. We will provide notice of significant changes by updating the effective date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">9. Governing Law</h2>
              <p className="text-foreground">
                These Terms shall be governed by the laws of South Africa without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">10. Contact Information</h2>
              <p className="text-foreground">If you have any questions about these Terms, please contact us at:</p>
              <p className="text-foreground">📧 Email: info@uthuthomaps.com</p>
              <p className="text-foreground">🌐 Website: www.uthuthomaps.com/terms</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
