
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="text-primary hover:underline mb-8 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-6">Effective Date: January 01, 2024</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Uthutho Maps application ("App"), you agree to be bound by these Terms and 
                Conditions ("Terms"). If you do not agree to these Terms, please do not use the App.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
                posting on the App. Your continued use of the App after any such changes constitutes acceptance of the 
                new Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="mb-4">
                To use certain features of the App, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Use of the App</h2>
              <p className="mb-4">
                You agree to use the App only for lawful purposes and in a way that does not infringe upon the rights 
                of others or restrict their use of the App. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting false or misleading transport information</li>
                <li>Using the App for any illegal activity</li>
                <li>Attempting to gain unauthorized access to systems or data</li>
                <li>Harassing or threatening other users</li>
                <li>Uploading malicious code or interfering with the App's functionality</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Transport Information</h2>
              <p>
                While we strive to provide accurate transportation information, we cannot guarantee the accuracy, 
                completeness, or timeliness of routes, schedules, or other transport data. The App should be used 
                as a guide only, and users should verify critical information through official transport providers.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. User Content</h2>
              <p className="mb-4">
                When you post content to the App (such as comments, reports, or ratings), you grant us a non-exclusive, 
                worldwide, royalty-free license to use, modify, publicly display, reproduce, and distribute that content 
                on the App. You affirm that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You own or have the necessary rights to the content you post</li>
                <li>Your content does not violate the privacy, publicity, copyright, or other rights of any person</li>
                <li>Your content is not defamatory, obscene, or otherwise unlawful</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p>
                The App and its content, features, and functionality are owned by Uthutho Maps and are protected by 
                international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not 
                copy, modify, distribute, or create derivative works based on our App without express written permission.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
              <p>
                The App is provided "as is" without warranties of any kind, whether express or implied. We do not warrant 
                that the App will be error-free, secure, or uninterrupted. You use the App at your own risk.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Uthutho Maps shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use or inability to use the App, including 
                but not limited to loss of profits, data, or goodwill.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account and access to the App without prior notice 
                for violation of these Terms or for any other reason at our sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of South Africa, without 
                regard to its conflict of law provisions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p>
                For questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">📧 Email: legal@uthuthomaps.com</p>
              <p>🌐 Website: www.uthuthomaps.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
