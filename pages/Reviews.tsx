import React from 'react';
import PublishedFeedbacks from '../components/PublishedFeedbacks';
import FeedbackSection from '../components/FeedbackSection';

const Reviews: React.FC = () => {
  return (
    <div className="py-12 md:py-20 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Recensioni
        </h1>
        <div className="w-24 h-1 bg-gradient-brand mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto italic">
          Le testimonianze e le opinioni dei clienti che mi hanno affidato il loro brand.
        </p>
      </div>

      <PublishedFeedbacks />

      <section id="feedback" className="py-20 bg-white border-t border-gray-100 mt-12">
        <FeedbackSection />
      </section>
    </div>
  );
};

export default Reviews;
