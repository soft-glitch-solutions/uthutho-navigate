
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MediaPage: React.FC = () => {
  const colors = [
    { name: 'Primary', hex: '#1ea2b1', className: 'bg-primary' },
    { name: 'Secondary', hex: '#ed67b1', className: 'bg-secondary' },
    { name: 'Accent', hex: '#f8c325', className: 'bg-accent' },
    { name: 'Highlight', hex: '#fd602d', className: 'bg-highlight' },
  ];

  const fonts = {
    heading: 'Quiapo, sans-serif',
    subheading: 'Playfair Display, serif',
    body: 'Inter, sans-serif',
  };

  const downloadPdf = () => {
    const input = document.getElementById('media-page');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('uthutho-branding.pdf');
      });
    }
  };

  return (
    <div id="media-page" className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-2 font-quiapo">Media & Branding</h2>
        <p className="text-muted-foreground font-inter">Download our brand assets and view our style guide.</p>
        <button
          onClick={downloadPdf}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors text-center"
        >
          Download as PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo Section */}
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 font-playfair">Logo</h3>
          <div className="flex items-center justify-center mb-4">
            <img src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" alt="Uthutho Commute Logo" className="h-24" />
          </div>
          <a
            href="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png"
            download
            className="w-full bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors text-center block"
          >
            Download Logo
          </a>
        </div>

        {/* Colors Section */}
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 font-playfair">Color Palette</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="text-center">
                <div className={`w-full h-24 rounded-md ${color.className}`} />
                <p className="font-semibold mt-2 font-inter">{color.name}</p>
                <p className="text-sm text-muted-foreground font-inter">{color.hex}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Section */}
        <div className="bg-black p-6 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-xl font-bold mb-4 font-playfair">Typography</h3>
          <div>
            <h4 className="font-semibold mb-2 font-inter">Heading Font: {fonts.heading}</h4>
            <p className="text-4xl font-bold mb-4" style={{ fontFamily: fonts.heading }}>Aa Bb Cc</p>
            <p className="text-muted-foreground font-inter">Used for main titles and headings.</p>
          </div>
          <hr className="my-6" />
          <div>
            <h4 className="font-semibold mb-2 font-inter">Subheading Font: {fonts.subheading}</h4>
            <p className="text-4xl font-bold mb-4" style={{ fontFamily: fonts.subheading }}>Aa Bb Cc</p>
            <p className="text-muted-foreground font-inter">Used for section titles.</p>
          </div>
          <hr className="my-6" />
          <div>
            <h4 className="font-semibold mb-2 font-inter">Body Font: {fonts.body}</h4>
            <p className="text-lg" style={{ fontFamily: fonts.body }}>
              The quick brown fox jumps over the lazy dog. Used for paragraphs and general text content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
