'use client'
import '@/styles/styles.css'
import { useEffect, useRef } from 'react';
import { PricingSection } from '@/components/PricingSection';
import { HomeSection } from '@/components/HomeSection';
import { FAQSection } from '@/components/FAQSection';
import { ContactSection } from '@/components/ContactSection';

const LandingPage = () => {
  const sectionsRef = useRef<HTMLElement[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0'); // Remove hidden styles
          entry.target.classList.add('fade-in'); // Trigger the fade-in-up animation
          observer.unobserve(entry.target); // Stop observing once it has become visible
        }
      });
    }, {
      threshold: 0.1,
    });

    // Make a copy of the ref value to use in cleanup
    const currentSections = sectionsRef.current;

    currentSections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      // Use the copy of the ref value here
      currentSections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []); // Only run once on mount and cleanup

  return (
    <div className='flex flex-col w-full h-full items-center justify-center bg-gradient-to-r from-amber-100 to-fuchsia-100'>
      <div className='scroll-container'>
        <div
          ref={addToRefs}
          id="home-section"
          className="section opacity-0 transition-all duration-1000 ease-out flex flex-col items-center justify-center min-h-screen"
        >
          <HomeSection />
        </div>
        <div
          ref={addToRefs}
          id="pricing-section"
          className="section opacity-0 transition-all duration-1000 ease-out flex flex-col items-center justify-center min-h-screen"
        >
          <PricingSection />
        </div>
        <div
          ref={addToRefs}
          id="faq-section"
          className="section opacity-0 transition-all duration-1000 ease-out flex flex-col items-center justify-center min-h-screen"
        >
          <FAQSection />
        </div>
        <div
          ref={addToRefs}
          id="contact-section"
          className="section opacity-0 transition-all duration-1000 ease-out flex flex-col items-center justify-center min-h-screen"
        >
          <ContactSection />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
