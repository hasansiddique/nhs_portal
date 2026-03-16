import React from 'react';
import { Link } from 'react-router-dom';

const howItWorksSteps = [
  {
    title: 'Book Your Appointment',
    description: 'Choose a date, time and GP or clinic that suits you. View available slots and book in seconds.',
    icon: '📅',
    bgColor: '#5B48FF',
  },
  {
    title: 'Manage Your Appointments',
    description: 'View, reschedule or cancel your appointments online. Get reminders and stay in control.',
    icon: '👥',
    bgColor: '#4CAF50',
  },
  {
    title: 'Choose Your Service',
    description: 'Book for a routine check-up, follow-up, or specific concern. Select the right type of appointment for you.',
    icon: '🏷️',
    bgColor: '#9C27B0',
  },
  {
    title: 'Attend Your Appointment',
    description: 'Turn up at your surgery or clinic at the booked time. Bring your NHS number and any relevant details.',
    icon: '📦',
    bgColor: '#F44336',
  },
];

export const NHSHomepage = () => {
  return (
    <div className="featured-props-section home-5">
      {/* Hero Section - match screenshot layout and font sizes */}
      <section className="flat-title-page home5 slider-height">
        <div className="overlay" />
        <div className="themesflat-container slider-height">
          <div className="wrap-heading flat-slider d-flex align-items-center slider-height">
            <div className="content sm:mr-20">
              <h1 className="heading font-bold text-white xl:text-[56px] lg:text-[50px] md:text-[44px] text-[36px] leading-[1.15] max-w-[90%] mb-4">
                Manage your healthcare appointments in one place
              </h1>
              <p className="sub-heading text-white text-[20px] md:text-[22px] leading-[1.4] opacity-90 mb-10">
                Book, view and manage your GP and clinic appointments online with YourNHS.
              </p>

              <div className="flex flex-wrap gap-4 pt-20">
                <Link
                  to="/appointments/book"
                  className="sc-button fl-button pri-3 inline-flex items-center justify-center h-[56px] px-[32px] rounded-[10px] bg-[#EF6A3B] border border-[#EF6A3B] text-white text-[18px] font-semibold hover:opacity-90 transition"
                >
                  Book an appointment
                </Link>
                <Link
                  to="/appointments"
                  className="sc-button loadmore fl-button pri-3 inline-flex items-center justify-center h-[56px] px-[32px] rounded-[10px] border-2 border-white bg-transparent text-white text-[18px] font-semibold hover:bg-white hover:text-[#14141F] transition ml-0 md:ml-5"
                >
                  My appointments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - match second screenshot */}
      <section className="tf-section how-it-works-section pt-[60px] pb-[80px]">
        <div className="themesflat-container">
          <h2 className="text-[36px] md:text-[42px] font-bold text-white mb-12">
            How it Works
          </h2>
          <div className="row g-4">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="col-lg-3 col-md-6 col-12">
                <div className="d-flex flex-column h-100">
                  <div
                    className="rounded-[12px] w-[80px] h-[80px] flex items-center justify-center text-[36px] mb-4"
                    style={{ backgroundColor: step.bgColor }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[15px] md:text-[16px] leading-[1.6] text-[#CCCCCC]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
