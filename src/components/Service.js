import React, { useEffect, useRef } from 'react';
import '../styles/Service.css';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';

const Service = () => {
  // References for each section that needs to be observed
  const serviceCardsRef = useRef([]);
  const workflowStepsRef = useRef([]);
  const testimonialCardsRef = useRef([]);
  const pricingCardsRef = useRef([]);
  const faqItemsRef = useRef([]);

  useEffect(() => {
    // Intersection Observer to handle animations when elements come into view
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      observer.observe(card);
      serviceCardsRef.current.push(card);
    });

    // Observe all workflow steps
    const workflowSteps = document.querySelectorAll('.workflow-step');
    workflowSteps.forEach(step => {
      observer.observe(step);
      workflowStepsRef.current.push(step);
    });

    // Observe all testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
      observer.observe(card);
      testimonialCardsRef.current.push(card);
    });

    // Observe all pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      observer.observe(card);
      pricingCardsRef.current.push(card);
    });

    // Observe all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      observer.observe(item);
      faqItemsRef.current.push(item);
    });

    // Add visibility to all section titles for better appearance
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
      observer.observe(title);
    });

    // Cleanup observer on component unmount
    return () => {
      serviceCardsRef.current.forEach(card => observer.unobserve(card));
      workflowStepsRef.current.forEach(step => observer.unobserve(step));
      testimonialCardsRef.current.forEach(card => observer.unobserve(card));
      pricingCardsRef.current.forEach(card => observer.unobserve(card));
      faqItemsRef.current.forEach(item => observer.unobserve(item));
      sectionTitles.forEach(title => observer.unobserve(title));
    };
  }, []);

  return (
    <div className="service-page">
      
      {/* Hero Section */}
      <section className="service-hero">
        <div className="service-hero-content">
          <h1>Doctor Services & Solutions</h1>
          <p>
            Advanced tools and features designed specifically for healthcare professionals 
            to streamline your practice and enhance patient care.
          </p>
          <button className="service-cta-button">Get Started</button>
        </div>
        <div className="service-hero-image">
          <img src="https://www.mida.gov.my/wp-content/uploads/2021/02/shutterstock_1751122349-scaled.jpg" alt="Doctor Dashboard" />
        </div>
      </section>
      
      {/* Core Services Section */}
      <section className="core-services" id="services">
        <div className="service-container">
          <h2 className="section-title fade-in-up">Our Core Services for Doctors</h2>
          <p className="section-subtitle fade-in-up">
            Comprehensive solutions to optimize your practice workflow and improve patient outcomes
          </p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                📅
              </div>
              <h3>Appointment Management</h3>
              <p>
                Efficient scheduling system with automated reminders to reduce no-shows 
                and manage your calendar effectively.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                👨‍⚕️
              </div>
              <h3>Telemedicine Platform</h3>
              <p>
                Secure video consultations with integrated notes and prescription capabilities 
                for remote patient care.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                💻
              </div>
              <h3>Electronic Health Records</h3>
              <p>
                Intuitive EHR system designed for quick documentation and comprehensive 
                patient history tracking.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                📈
              </div>
              <h3>Practice Analytics</h3>
              <p>
                Data-driven insights about your practice performance, patient demographics, 
                and financial metrics.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                ❤️
              </div>
              <h3>Remote Monitoring</h3>
              <p>
                Tools to track patient vitals and health metrics remotely for continuous care 
                between appointments.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                🤲
              </div>
              <h3>Clinical Decision Support</h3>
              <p>
                Evidence-based recommendations and alerts to assist in diagnosis and 
                treatment planning.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="service-container">
          <h2 className="section-title fade-in-up">How Our Platform Works for Doctors</h2>
          
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h3>Create Your Profile</h3>
              <p>
                Set up your professional profile with your specialties, education, 
                experience and practice details.
              </p>
            </div>
            
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h3>Customize Your Dashboard</h3>
              <p>
                Tailor your workspace to show the metrics and features you use most frequently.
              </p>
            </div>
            
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h3>Manage Appointments</h3>
              <p>
                Use the scheduling system to organize patient visits, both in-person and virtual.
              </p>
            </div>
            
            <div className="workflow-step">
              <div className="step-number">4</div>
              <h3>Provide Care & Document</h3>
              <p>
                Conduct consultations and document patient encounters with our streamlined EHR.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Highlight */}
      <section className="features-highlight">
        <div className="service-container">
          <div className="feature-content">
            <h2>Advanced Clinical Tools</h2>
            <p>
              Our platform provides specialty-specific tools designed to enhance your 
              diagnostic capabilities and treatment planning.
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-icon">🩺</span>
                <span>Specialty-specific templates and workflows</span>
              </li>
              <li>
                <span className="feature-icon">📚</span>
                <span>Medical reference library and drug interaction checker</span>
              </li>
              <li>
                <span className="feature-icon">📊</span>
                <span>Outcome tracking and treatment efficacy tools</span>
              </li>
              <li>
                <span className="feature-icon">💓</span>
                <span>Integrated medical device data capture</span>
              </li>
            </ul>
            <button className="feature-cta">Explore Clinical Tools</button>
          </div>
          <div className="feature-image">
            <img src="https://www.medicaltranscriptionservicecompany.com/wp-content/uploads/2021/03/how-clinical-decision-support-tools-improve-clinician-efficiency-and-patient-outcomes.jpg" alt="Clinical Tools Interface" />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="doctor-testimonials" id="testimonials">
        <div className="service-container">
          <h2 className="section-title fade-in-up">What Doctors Say About Us</h2>
          
          <div className="testimonial-slider">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "This platform has transformed my practice. The integrated telemedicine 
                  and EHR features save me hours each day, and the clinical decision support 
                  has improved my diagnostic accuracy."
                </p>
              </div>
              <div className="testimonial-author">
                <img src="https://img.freepik.com/premium-photo/beautiful-smiling-female-doctor-stand-office_151013-12509.jpg?w=2000" alt="Dr. Sarah Johnson" />
                <div>
                  <h4>Dr. Sarah Johnson</h4>
                  <p>Cardiologist, Boston Medical Center</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "As a busy pediatrician, efficiency is crucial. This system's appointment 
                  management and remote monitoring capabilities have helped me provide better 
                  care while maintaining work-life balance."
                </p>
              </div>
              <div className="testimonial-author">
                <img src="http://www.pngall.com/wp-content/uploads/2018/05/Doctor-PNG-File-Download-Free.png" alt="Dr. Michael Chen" />
                <div>
                  <h4>Dr. Michael Chen</h4>
                  <p>Pediatrician, Children's Health Clinic</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "The analytics provide invaluable insights into my practice patterns and patient 
                  outcomes. I've been able to identify opportunities for improvement that would have 
                  been impossible to see otherwise."
                </p>
              </div>
              <div className="testimonial-author">
                <img src="https://leman-clinic.ch/wp-content/uploads/2018/11/02.jpg" alt="Dr. Lisa Rodriguez" />
                <div>
                  <h4>Dr. Lisa Rodriguez</h4>
                  <p>Family Medicine, Community Health Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="service-container">
          <h2 className="section-title fade-in-up">Subscription Plans for Healthcare Providers</h2>
          <p className="section-subtitle fade-in-up">
            Choose the plan that fits your practice size and requirements
          </p>
          
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Basic</h3>
                <div className="price">
                  <span className="amount">$199</span>
                  <span className="period">/month</span>
                </div>
                <p>For individual practitioners or small practices</p>
              </div>
              <ul className="pricing-features">
                <li>Appointment scheduling</li>
                <li>Basic EHR functionality</li>
                <li>Telemedicine (10 hours/month)</li>
                <li>Patient portal</li>
                <li>Standard reports</li>
              </ul>
              <button className="pricing-cta">Get Started</button>
            </div>
            
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <div className="price">
                  <span className="amount">$349</span>
                  <span className="period">/month</span>
                </div>
                <p>For established practices with multiple providers</p>
              </div>
              <ul className="pricing-features">
                <li>All Basic features</li>
                <li>Advanced EHR with specialty templates</li>
                <li>Telemedicine (unlimited)</li>
                <li>Clinical decision support</li>
                <li>Advanced analytics</li>
                <li>Custom forms and workflows</li>
              </ul>
              <button className="pricing-cta">Get Started</button>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">
                  <span className="amount">Custom</span>
                </div>
                <p>For large medical groups and hospitals</p>
              </div>
              <ul className="pricing-features">
                <li>All Professional features</li>
                <li>Custom integrations</li>
                <li>Dedicated account manager</li>
                <li>Priority support</li>
                <li>Staff training</li>
                <li>HIPAA compliance assistance</li>
                <li>Custom reporting</li>
              </ul>
              <button className="pricing-cta">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="faq-section" id="faq">
        <div className="service-container">
          <h2 className="section-title fade-in-up">Frequently Asked Questions</h2>
          
          <div className="faq-container">
            <div className="faq-item">
              <h3 className="faq-question">How secure is patient data on your platform?</h3>
              <div className="faq-answer">
                <p>
                  Our platform is built with HIPAA compliance as a cornerstone. We use end-to-end 
                  encryption, secure data centers, and regular security audits to ensure the highest 
                  level of data protection for both providers and patients.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Can I integrate existing EHR systems with your platform?</h3>
              <div className="faq-answer">
                <p>
                  Yes, we offer integration capabilities with most major EHR systems. Our team will 
                  work with you to ensure a smooth transition and proper data migration from your 
                  existing systems.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What kind of training and support do you provide?</h3>
              <div className="faq-answer">
                <p>
                  All plans include initial training sessions, comprehensive documentation, and access 
                  to our support team. Professional and Enterprise plans include additional training 
                  options and dedicated support channels.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Is the telemedicine feature compliant with regulations?</h3>
              <div className="faq-answer">
                <p>
                  Yes, our telemedicine platform complies with all relevant healthcare regulations and 
                  standards. It provides secure, high-quality video connections that meet clinical requirements 
                  while being easy for patients to use.
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">How do you handle billing and insurance claims?</h3>
              <div class="faq-answer">
                <p>
                  Our platform includes integrated billing features that support insurance verification, 
                  claim submission, and payment processing. We regularly update our system to comply with 
                  the latest billing codes and requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="service-cta-section">
        <div className="service-container">
          <h2>Ready to Transform Your Medical Practice?</h2>
          <p>
            Join thousands of healthcare professionals who have enhanced their practice 
            efficiency and patient care with our comprehensive platform.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">Schedule a Demo</button>
            <button className="cta-secondary">Contact Sales</button>
          </div>
        </div>
      </section>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Service;