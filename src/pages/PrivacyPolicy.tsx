
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="text-primary hover:underline mb-8 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Effective Date: January 01, 2024</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Uthutho ("we," "our," or "us"). Your privacy is important to us, and we are committed to 
                protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your 
                data when you use our app.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> When you create an account, we may collect your name, email, and phone number.
                </li>
                <li>
                  <strong>Location Data:</strong> To provide transport routes and nearby pickup spots, we may collect your real-time 
                  location with your permission.
                </li>
                <li>
                  <strong>Device Information:</strong> We may collect device type, operating system, and app usage data for analytics 
                  and performance improvements.
                </li>
                <li>
                  <strong>User Contributions:</strong> Messages in pickup spot chats and commuter updates may be stored to enhance 
                  community engagement.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our transport navigation services.</li>
                <li>Show relevant routes, transport hubs, and commuter updates.</li>
                <li>Enhance user safety by enabling real-time alerts and location-based features.</li>
                <li>Comply with legal obligations and prevent fraudulent activities.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing & Third Parties</h2>
              <p className="mb-4">
                We do not sell your personal data. However, we may share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> For app functionality, hosting, and analytics.</li>
                <li><strong>Legal Authorities:</strong> If required by law or to protect user safety.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p>
                We use encryption and industry-standard security practices to protect your data. However, no online service is 100% secure.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Choices & Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Location Access:</strong> You can enable or disable location permissions in your device settings.</li>
                <li><strong>Account Deletion:</strong> You may request account deletion by contacting us.</li>
                <li><strong>Privacy Settings:</strong> You can manage preferences in the app settings.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
              <p>
                Uthutho is not intended for children under 13. We do not knowingly collect data from minors.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this policy periodically. Any changes will be posted here with a revised effective date.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p>If you have any questions, please contact us at:</p>
              <p className="mt-2">📧 Email: info@uthutho.com</p>
              <p>🌐 Website: www.uthutho.com</p>
            </section>
            
            <section className="border-t pt-8 mt-12">
              <h2 className="text-2xl font-semibold mb-4">Data Deletion</h2>
              <p className="mb-6">
                As per our privacy commitment, you have the right to request deletion of your personal data from our services.
                If you would like to delete your account and all associated data, please click the button below.
              </p>
              <Link to="/delete-account">
                <Button variant="destructive" className="mt-2">
                  Request Data Deletion
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
