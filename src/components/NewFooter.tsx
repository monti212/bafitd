import React from 'react';

const NewFooter: React.FC = () => {
  return (
    <footer className="border-t border-teal/10 bg-sand-100 py-10 px-4 mt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-8 h-[2px] bg-teal mx-auto mb-5 rounded-full" />
        <p className="text-deep-navy/50 text-sm font-medium">
          © {new Date().getFullYear()} BaFitD — Batswana and Friends in the Diaspora
        </p>
        <p className="text-deep-navy/40 text-xs mt-2 tracking-wide">
          A civic initiative. Built with care for Botswana.
        </p>
      </div>
    </footer>
  );
};

export default NewFooter;
