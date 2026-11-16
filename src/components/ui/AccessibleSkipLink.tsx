/**
 * @file clients/portfolio/src/components/ui/AccessibleSkipLink.tsx
 * @description WCAG 2.1 Level AA Skip to Main Content link for keyboard & screen reader users.
 */

import React from 'react';

export const AccessibleSkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-2.5 focus:bg-[#101722] focus:text-[#45D6E6] focus:border focus:border-[#45D6E6] focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#45D6E6] text-sm font-body font-medium transition-colors"
    >
      Skip to Main Content (Press Enter)
    </a>
  );
};

