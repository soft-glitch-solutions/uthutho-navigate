
import React from 'react';

interface QuoteSectionProps {
  quote: string;
  translation: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ quote, translation }) => {
  return (
    <section className="py-12 md:py-20 bg-muted-darker border-t border-b border-glass">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-primary italic">
          "{quote}"
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/90">
          {translation}
        </p>
      </div>
    </section>
  );
};

export default QuoteSection;
