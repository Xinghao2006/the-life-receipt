import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import ReceiptGenerator from './components/ReceiptGenerator';

type ViewMode = 'blog' | 'tool';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('blog');

  useEffect(() => {
    // Basic routing based on Hash
    // If user comes with a shared receipt link (contains 'config='), open tool immediately
    const checkHash = () => {
        const hash = window.location.hash;
        if (hash.includes('config=')) {
            setView('tool');
        }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenTool = () => {
      // Clear hash when entering tool from blog fresh
      if (!window.location.hash.includes('config=')) {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch (e) {
            console.warn('Navigation history update failed:', e);
          }
      }
      setView('tool');
  };

  const handleBackToBlog = () => {
      // Clear hash to return to "clean" blog state
      try {
          // Attempt to remove the hash from the URL visually
          window.history.pushState(null, '', window.location.pathname);
      } catch (e) {
          console.warn('Navigation history update failed:', e);
          // Fallback: simple hash clearing if history API is restricted
          try {
            if (window.location.hash) {
                window.location.hash = '';
            }
          } catch(e2) {
             console.warn('Hash update failed:', e2);
          }
      }
      setView('blog');
  };

  return (
    <>
      {view === 'blog' ? (
        <Blog onOpenTool={handleOpenTool} />
      ) : (
        <ReceiptGenerator onBack={handleBackToBlog} />
      )}
    </>
  );
};

export default App;