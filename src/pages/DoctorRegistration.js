import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/DoctorRegistration.css';

const DoctorRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    // Professional Information
    medicalDegree: '',
    specialty: '',
    licenseNumber: '',
    licenseExpiry: '',
    yearsOfExperience: '',
    hospitalAffiliation: '',
    bio: '',
    // Additional Details
    languages: [],
    consultationFee: '',
    availableDays: [],
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 
    'Neurology', 'Obstetrics & Gynecology', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology', 'Radiology',
    'Urology', 'General Practice', 'Other'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Other'
  ];

  const weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'acceptTerms') {
        setFormData({
          ...formData,
          [name]: checked
        });
      } else if (name.startsWith('language-')) {
        const language = name.replace('language-', '');
        setFormData({
          ...formData,
          languages: checked 
            ? [...formData.languages, language]
            : formData.languages.filter(lang => lang !== language)
        });
      } else if (name.startsWith('day-')) {
        const day = name.replace('day-', '');
        setFormData({
          ...formData,
          availableDays: checked 
            ? [...formData.availableDays, day]
            : formData.availableDays.filter(d => d !== day)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate current step data
  const validateCurrentStep = () => {
    setError('');
    
    if (step === 1) {
      // Validate personal information
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return false;
      }
      
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      return true;
    } 
    else if (step === 2) {
      // Validate professional information
      if (!formData.medicalDegree || !formData.specialty || !formData.licenseNumber) {
        setError('Please fill in all required fields');
        return false;
      }
      
      return true;
    }
    else if (step === 3) {
      // Validate additional details
      if (formData.languages.length === 0 || !formData.consultationFee || formData.availableDays.length === 0) {
        setError('Please fill in all required fields');
        return false;
      }
      
      if (!formData.acceptTerms) {
        setError('You must accept the terms and conditions to continue');
        return false;
      }
      
      return true;
    }
    
    return true;
  };

  // Handle navigation between steps
  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      console.log('Doctor registration data:', formData);
      // Navigate to success page or login
      window.location.href = '/doctor/login?registered=true';
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="branding">
          <h1>TreatLine</h1>
        </div>
        
        <h2>Doctor Registration</h2>
        <p>Create your professional account to start practicing telemedicine</p>
        
        {/* Progress steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>Personal</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>Professional</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>Details</div>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div>
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <div className="form-row">
                <div>
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="input-hint">Must be at least 8 characters long</div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          )}
          
          {/* Step 2: Professional Information */}
          {step === 2 && (
            <div>
              <h3>Professional Information</h3>
              
              <div className="form-row">
                <div>
                  <label htmlFor="medicalDegree">Medical Degree *</label>
                  <input
                    type="text"
                    name="medicalDegree"
                    id="medicalDegree"
                    value={formData.medicalDegree}
                    onChange={handleChange}
                    required
                    placeholder="e.g., MD, MBBS, DO"
                  />
                </div>
                
                <div>
                  <label htmlFor="specialty">Specialty *</label>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Specialty</option>
                    {specialties.map((specialty, index) => (
                      <option key={index} value={specialty.toLowerCase()}>{specialty}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div>
                  <label htmlFor="licenseNumber">License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="licenseExpiry">License Expiry Date</label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    id="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div>
                  <label htmlFor="yearsOfExperience">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    id="yearsOfExperience"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="hospitalAffiliation">Hospital Affiliation</label>
                  <input
                    type="text"
                    name="hospitalAffiliation"
                    id="hospitalAffiliation"
                    value={formData.hospitalAffiliation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <label htmlFor="bio">Professional Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your professional background, expertise, and approach to patient care"
              ></textarea>
            </div>
          )}
          
          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div>
              <h3>Additional Details</h3>
              
              <label>Languages Spoken *</label>
              <div className="form-row">
                {languageOptions.map((language, index) => (
                  <div key={index}>
                    <input
                      id={`language-${language}`}
                      name={`language-${language}`}
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`language-${language}`}>{language}</label>
                  </div>
                ))}
              </div>
              
              <label htmlFor="consultationFee">Consultation Fee (USD) *</label>
              <input
                type="number"
                name="consultationFee"
                id="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
              
              <label>Available Days *</label>
              <div className="form-row">
                {weekdays.map((day, index) => (
                  <div key={index}>
                    <input
                      id={`day-${day}`}
                      name={`day-${day}`}
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`day-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
              
              <div className="terms-checkbox">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <label htmlFor="acceptTerms">
                  I agree to the <a href="#" className="text-link">Terms of Service</a> and <a href="#" className="text-link">Privacy Policy</a> *
                  <p className="input-hint">By creating an account, you agree to our terms and conditions and confirm that all provided information is accurate and can be verified.</p>
                </label>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="form-buttons">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="back-button"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="next-button"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`submit-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
        
        <div className="login-link">
          Already have an account?{' '}
          <Link to="/doctor/login" className="text-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
