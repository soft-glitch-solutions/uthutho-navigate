import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MediaPage: React.FC = () => {
  const colors = [
    { name: 'Primary', hex: '#1ea2b1', className: 'bg-primary', usage: 'Buttons, links, key UI elements' },
    { name: 'Secondary', hex: '#ed67b1', className: 'bg-secondary', usage: 'Highlights, accents, icons' },
    { name: 'Accent', hex: '#f8c325', className: 'bg-accent', usage: 'Warnings, notifications, energy' },
    { name: 'Highlight', hex: '#fd602d', className: 'bg-highlight', usage: 'Calls-to-action, important alerts' },
  ];

  const downloadPdf = async () => {
    const input = document.getElementById('media-page');
    if (!input) return;

    try {
      // Show loading state (you can add a loading spinner UI)
      const canvas = await html2canvas(input, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        allowTaint: false,
        useCORS: true,
        windowWidth: 1200, // Fixed width for consistency
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width * 0.75, canvas.height * 0.75]
      });
      
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save('uthutho-brand-guide.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div 
      id="media-page" 
      className="min-h-screen bg-black text-white"
    >
      {/* Simple Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light tracking-tight mb-2">
                Uthutho Brand Kit
              </h1>
              <p className="text-gray-400 text-sm">
                Everything you need for consistent brand representation
              </p>
            </div>
            <button
              onClick={downloadPdf}
              className="bg-primary text-black px-6 py-3 rounded text-sm font-medium hover:bg-opacity-90 transition-colors inline-flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <span>↓</span>
              Download Brand Guide (PDF)
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Logo Section - Simple and Clean */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Logo</h2>
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="bg-gray-800 p-8 rounded-lg flex items-center justify-center w-full md:w-auto">
                <img 
                  src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                  alt="Uthutho Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                  Our logo represents connection and movement. Always maintain clear space around it equal to the height of the 'U'.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-primary text-sm hover:underline">Download PNG →</a>
                  <a href="#" className="text-gray-400 text-sm hover:underline">Download SVG →</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colors - Simple Grid */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className={`h-24 ${color.className}`} />
                <div className="p-4">
                  <p className="font-medium text-sm">{color.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{color.hex}</p>
                  <p className="text-gray-500 text-xs mt-2">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography - Clean Examples */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Typography</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-2">HEADING — QUAPIO</p>
                <p className="text-3xl font-bold">Uthutho Commute</p>
                <p className="text-3xl font-bold mt-1">Making travel simpler</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">SUBHEADING — PLAYFAIR</p>
                <p className="text-xl font-serif">Smart commuting for everyone</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">BODY — INTER</p>
                <p className="text-sm text-gray-300 max-w-2xl">
                  Uthutho provides real-time public transport information to help communities navigate their daily commute with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Signature - Practical Example */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Email Signature</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <p className="text-xs text-gray-500 mb-4">Copy this template for your email signature:</p>
            
            {/* Email Signature Example */}
            <div className="border-l-4 border-primary pl-4 py-2 bg-gray-800 rounded-r-lg">
              <div className="flex items-start gap-4">
                <img 
                  src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                  alt="Uthutho" 
                  className="h-8 w-auto"
                />
                <div className="text-sm">
                  <p className="font-bold">Your Name</p>
                  <p className="text-primary text-xs">Job Title</p>
                  <p className="text-gray-400 text-xs mt-2">✉︎ your.name@uthutho.com</p>
                  <p className="text-gray-400 text-xs">✆ +27 123 456 789</p>
                  <p className="text-gray-500 text-xs mt-2">www.uthutho.com • Cape Town</p>
                </div>
              </div>
            </div>

            {/* HTML Code */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">HTML template:</p>
              <pre className="bg-gray-800 p-4 rounded text-xs text-gray-300 overflow-x-auto">
{`<table style="font-family: Inter, sans-serif;">
  <tr>
    <td><img src="logo-url.png" height="32"></td>
    <td style="padding-left: 16px;">
      <strong>Your Name</strong><br>
      <span style="color: #1ea2b1;">Job Title</span><br>
      <span style="color: #666;">your.name@uthutho.com</span>
    </td>
  </tr>
</table>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Brand Voice - Simple Guidelines */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Brand Voice</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-3">DO</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Be clear and straightforward</li>
                <li>✓ Use inclusive language</li>
                <li>✓ Focus on solutions</li>
                <li>✓ Keep it professional but warm</li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-3">DON'T</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✗ Use jargon or technical terms</li>
                <li>✗ Be overly casual</li>
                <li>✗ Make promises we can't keep</li>
                <li>✗ Ignore accessibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Assets */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Social Assets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Profile Picture</p>
              <div className="bg-gray-800 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
                <img src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" alt="Logo" className="h-8 w-auto" />
              </div>
              <a href="#" className="text-primary text-xs block text-center">Download →</a>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Cover Photo</p>
              <div className="bg-gray-800 w-full h-16 rounded mb-3 flex items-center justify-center text-gray-600 text-xs">
                1500 x 500px
              </div>
              <a href="#" className="text-primary text-xs block text-center">Download →</a>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Favicon</p>
              <div className="bg-gray-800 w-12 h-12 rounded mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold">U</span>
              </div>
              <a href="#" className="text-primary text-xs block text-center">Download →</a>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
            <div>
              <p className="text-gray-400">Questions? Contact our brand team:</p>
              <p className="text-primary mt-1">brand@uthutho.com</p>
            </div>
            <p className="text-gray-600 text-xs mt-4 md:mt-0">© 2024 Uthutho • Version 1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;