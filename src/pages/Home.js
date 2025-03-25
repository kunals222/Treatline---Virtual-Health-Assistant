import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Home.css';
import doctorImage from '../assets/doctors-1.jpg';
import { Users, Calendar, Globe, ShieldCheck, Star, Clock, Activity } from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
    const { user, token, role } = useSelector((state) => state.auth);

    // Add intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe all animated elements
        document.querySelectorAll('.feature-card, .testimonial-card, .faq-item, .step, .stat').forEach(
            element => observer.observe(element)
        );

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <main className="home-container">
                <section className="hero-wrapper">
                    <div className="hero-section">
                        <div className="content-container">
                            <div className="hero-content">
                                <h1>Welcome to <span className="highlight">TreatLine</span></h1>
                                <p className="hero-assistant-text">Your Virtual Health Assistant</p>
                                <p className="hero-description">
                                    Connect with doctors, schedule appointments, and receive
                                    personalized healthcare from the comfort of your home.
                                </p>
                                <div className="cta-buttons">
                                    {!token && (
                                        <>
                                            <Link to="/register/doctor" className="cta-button primary">
                                                Join as Doctor
                                            </Link>
                                            <Link to="/register/patient" className="cta-button secondary">
                                                Join as Patient
                                            </Link>
                                        </>
                                    )}
                                    {token && (
                                        <Link to="/dashboard" className="cta-button primary">
                                            Go to Dashboard
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="hero-image">
                                <img src={doctorImage} alt="Doctor with patient" />
                                <div className="floating-card">
                                    <div className="floating-icon">
                                        <Activity size={24} />
                                    </div>
                                    <p>Advanced Healthcare Services</p>
                                </div>
                                <div className="floating-card delay-1">
                                    <div className="floating-icon">
                                        <Clock size={24} />
                                    </div>
                                    <p>24/7 Availability</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="features-section">
                    <h2 className="section-title">Why Choose TreatLine?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Users size={42} color="#003366" />
                            </div>
                            <h3>Virtual Consultations</h3>
                            <p>Connect with healthcare professionals from anywhere, anytime through our secure video platform.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Calendar size={48} color="#003366" />
                            </div>
                            <h3>Smart Scheduling</h3>
                            <p>AI-powered appointment scheduling based on urgency, doctor availability, and your preferences.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Globe size={48} color="#003366" />
                            </div>
                            <h3>Multiple Languages</h3>
                            <p>Find doctors who speak your preferred language for better communication and care.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <ShieldCheck size={48} color="#003366" />
                            </div>
                            <h3>Secure Platform</h3>
                            <p>Your health information is protected with end-to-end encryption and advanced security measures.</p>
                        </div>
                    </div>
                </div>

                <div className="testimonial-section">
                    <h2 className="section-title">What Our Users Say</h2>
                    <div className="testimonial-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="#FFC107" color="#FFC107" />
                                ))}
                            </div>
                            <p>"TreatLine has transformed how I manage my practice. The scheduling system is intuitive, and connecting with patients has never been easier."</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">DR</div>
                                <div>
                                    <h4>Dr. Richard Lee</h4>
                                    <p>Cardiologist</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FFC107" color="#FFC107" />
                                ))}
                            </div>
                            <p>"As a busy mom, finding time for doctor appointments was always challenging. TreatLine lets me consult with specialists without leaving home!"</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">SJ</div>
                                <div>
                                    <h4>Sarah Johnson</h4>
                                    <p>Patient</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FFC107" color="#FFC107" />
                                ))}
                            </div>
                            <p>"The language matching feature helped me find a doctor who speaks my native language. It made explaining my symptoms so much easier."</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">MR</div>
                                <div>
                                    <h4>Miguel Rodriguez</h4>
                                    <p>Patient</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stat">
                        <h2>1000+</h2>
                        <p>Registered Doctors</p>
                    </div>
                    <div className="stat">
                        <h2>50,000+</h2>
                        <p>Patient Consultations</p>
                    </div>
                    <div className="stat">
                        <h2>4.8/5</h2>
                        <p>User Satisfaction</p>
                    </div>
                </div>

                <div className="how-it-works">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Register</h3>
                            <p>Create an account as a doctor or patient in just a few clicks</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Connect</h3>
                            <p>Find the right healthcare professional for your specific needs</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Consult</h3>
                            <p>Have a virtual consultation and receive personalized care</p>
                        </div>
                    </div>
                </div>

                <div className="faq-section">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>How secure is my medical information?</h3>
                            <p>TreatLine uses end-to-end encryption and follows all HIPAA guidelines to ensure your medical information remains private and secure.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I use insurance for virtual consultations?</h3>
                            <p>Yes, many insurance providers cover telemedicine services. You can verify coverage with your provider before booking an appointment.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What specialties are available on TreatLine?</h3>
                            <p>TreatLine offers a wide range of specialties including primary care, psychiatry, dermatology, pediatrics, and many more.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How do I become a doctor on TreatLine?</h3>
                            <p>Register using our doctor registration form, upload your credentials for verification, and once approved, you can start using the platform.</p>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Ready to experience better healthcare?</h2>
                    <p>Join TreatLine today and transform the way you receive or provide healthcare services.</p>
                    {!token && (
                        <div className="cta-buttons">
                            <Link to="/login" className="cta-button primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Home;
