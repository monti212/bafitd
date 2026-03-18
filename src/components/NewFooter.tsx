import React from 'react';

const NewFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} BaFitD — Batswana and Friends in the Diaspora
        </p>
        <p className="text-white/30 text-xs mt-2">
          A civic initiative. Built with care for Botswana.
        </p>
      </div>
    </footer>
  );
};

export default NewFooter;
