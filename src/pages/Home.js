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
        document.querySelectorAll('.feature-card, .testimonial-card, .faq-item, .step, .stat, .ad-card').forEach(
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

                <section className="ads-section">
                    <h2 className="section-title">Featured Medicines</h2>
                    <div className="ads-carousel">
                        {[
                            {
                                title: "Paracetamol Tablets",
                                price: 5.99,
                                originalPrice: 7.99,
                                image: "https://5.imimg.com/data5/GE/SV/CY/SELLER-2086004/paracetamol-650mg-1000x1000.jpg",
                                description: "Fever and pain relief medicine.",
                                discount: "-25%",
                                shopLink: "https://amzn.in/d/9K5f48d"
                            },
                            {
                                title: "Ibuprofen 200mg",
                                price: 6.99,
                                originalPrice: 8.99,
                                image: "https://images.heb.com/is/image/HEBGrocery/001011791?fit=constrain,1&wid=800&hei=800&fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0",
                                description: "Anti-inflammatory pain reliever.",
                                discount: "-20%",
                                shopLink: "https://www.heb.com/product-detail/h-e-b-ibuprofen-200-mg-coated-tablets-value-pack/1011791"
                            },
                            {
                                title: "Cough Syrup",
                                price: 4.99,
                                originalPrice: 6.99,
                                image: "https://cdn01.pharmeasy.in/dam/products/022615/benadryl-cough-formula-bottle-of-150ml-syrup-front-2-1626077003.jpg",
                                description: "Relieves cough and throat irritation.",
                                discount: "-30%",
                                shopLink: "Checkout Benadryl Cough Formula Bottle ... at 24% discount  on Pharmeasy - https://pharmeasy.in/online-medicine-order/benadryl-cough-formula-bottle-of-150ml-syrup-37060?utm_source=pharmeasy&utm_medium=desktop&utm_campaign=pdp_share"
                            },
                            {
                                title: "Vitamin C Tablets",
                                price: 9.99,
                                originalPrice: 12.99,
                                image: "https://www.naturesaid.co.uk/images/natures-aid-vitamin-c-500mg-chewable-p244-1115_medium.jpg",
                                description: "Boosts immunity and overall health.",
                                discount: "-20%",
                                shopLink: "https://www.naturesaid.co.uk/vitamins-supplements-c10/vitamins-c18/vitamin-c-500mg-chewable-p244"
                            },
                            {
                                title: "Antacid Gel",
                                price: 7.99,
                                originalPrice: 9.99,
                                image: "https://cdn01.pharmeasy.in/dam/products_otc/I02813/polycrol-xpress-relief-antacid-gel-sugar-free-mint-flavour-200ml-2-1610016946.jpg",
                                description: "For quick relief from acidity and heartburn.",
                                discount: "-15%",
                                shopLink: "Checkout Polycrol Xpress Relief From Ac... at 20% discount  on Pharmeasy - https://pharmeasy.in/health-care/products/polycrol-xpress-relief-antacid-gel-sugar-free---mint-flavour---200ml-169220?utm_source=pharmeasy&utm_medium=desktop&utm_campaign=pdp_share"
                            },
                            {
                                title: "Omron BP Monitor",
                                price: 89.99,
                                originalPrice: 99.99,
                                image: "https://cdn11.bigcommerce.com/s-g87097e/images/stencil/2560w/products/77/2078/omron-m6-comfort-hem-7360-e-min__46912.1599851749.png?c=2",
                                description: "Digital Blood Pressure Monitor",
                                discount: "-10%",
                                shopLink: "https://www.foursquare-healthcare.co.uk/omron-m7-intelli-it-afib-blood-pressure-monitor-hem-7380t1-ebk/"
                            },
                            {
                                title: "Pulse Oximeter",
                                price: 29.99,
                                originalPrice: 34.99,
                                image: "https://images-na.ssl-images-amazon.com/images/G/01/aplusautomation/vendorimages/806fd110-2270-43bd-924b-9a35dab5c167.jpg._CB282523961_.jpg",
                                description: "Digital Fingertip Pulse Oximeter",
                                discount: "-15%",
                                shopLink: "https://a.co/d/4pDF50o"
                            },
                            {
                                title: "First Aid Kit",
                                price: 39.99,
                                originalPrice: 44.99,
                                image: "https://i5.walmartimages.com/asr/0d193d70-8f4d-4c2a-af9a-3083727cea86.1f3ddff1341fc7c7e7b57214a38a3e01.jpeg",
                                description: "300-Piece First Aid Emergency Kit",
                                discount: "New",
                                shopLink: "https://www.walmart.com/ip/Johnson-Johnson-First-Aid-To-Go-Portable-Mini-Travel-Kit-12-pieces/10801432"
                            },
                            {
                                title: "Digital Thermometer",
                                price: 19.99,
                                originalPrice: 24.99,
                                image: "https://www.alphascales.in/wp-content/uploads/2022/03/digiral-thermometer-6-scaled.jpg",
                                description: "Infrared Digital Thermometer",
                                discount: "-20%",
                                shopLink: "https://www.alphascales.in/product/digital-thermometer-srs720/"
                            },
                            {
                                title: "Nebulizer Machine",
                                price: 59.99,
                                originalPrice: 69.99,
                                image: "https://m.media-amazon.com/images/S/aplus-media/vc/0d0c9df5-d55c-4609-a1d3-d4e3612dcb29.jpg",
                                description: "Portable Nebulizer Machine",
                                discount: "-15%",
                                shopLink: "https://amzn.eu/d/2UXcPXq"
                            }
                        ].map((product, index) => (
                            <div key={index} className="ad-card slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="ad-image">
                                    <img src={product.image} alt={product.title} />
                                    <div className="discount-badge">{product.discount}</div>
                                </div>
                                <div className="ad-content">
                                    <h3>{product.title}</h3>
                                    <p className="price">
                                        Rs {product.price}
                                        <span className="original-price">${product.originalPrice}</span>
                                    </p>
                                    <p className="description">{product.description}</p>
                                    <a href={product.shopLink} target="_blank" rel="noopener noreferrer" className="shop-now-btn">
                                        Shop Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="scroll-buttons">
                        <button className="scroll-btn prev" onClick={() => document.querySelector('.ads-carousel').scrollBy(-300, 0)}>❮</button>
                        <button className="scroll-btn next" onClick={() => document.querySelector('.ads-carousel').scrollBy(300, 0)}>❯</button>
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
