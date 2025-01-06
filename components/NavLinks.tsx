'use client';

import React from 'react';

type Props = {
  showNavLinks: boolean;
};

const NavLinks = ({ showNavLinks }: Props) => {
  if (!showNavLinks) {
    return null; // Do not render anything if not on the home page
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="absolute left-1/2 transform -translate-x-1/2 max-sm:hidden">
        {/* Horizontally stacked nav links */}
        <div className="flex space-x-3 md:space-x-8">
          <div
            onClick={() => scrollToSection('home-section')}
            className="cursor-pointer hover:text-blue-500"
          >
            Home
          </div>
          <div
            onClick={() => scrollToSection('pricing-section')}
            className="cursor-pointer hover:text-blue-500"
          >
            Pricing
          </div>
          <div
            onClick={() => scrollToSection('faq-section')}
            className="cursor-pointer hover:text-blue-500"
          >
            FAQ
          </div>
          <div
            onClick={() => scrollToSection('contact-section')}
            className="cursor-pointer hover:text-blue-500"
          >
            Contact
          </div>
        </div>
      </div>
    </>
  );
};

export default NavLinks;
