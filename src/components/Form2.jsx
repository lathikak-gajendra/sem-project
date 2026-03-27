import React, { useState, useEffect } from 'react';
import './styles.css';

const Form2 = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    dob: '',
    address: '',
    profilePhoto: null,
    gpa: '',
    emergencyContact: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [formStarted, setFormStarted] = useState(false);
  const [showScholar, setShowScholar] = useState(true);

  // Load previously submitted data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('currentStudentRegistration');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        if (parsed.photoPreview) {
          setPhotoPreview(parsed.photoPreview);
        }
        if (parsed.formData && Object.values(parsed.formData).some(val => val)) {
          setShowScholar(false);
          setTimeout(() => {
            setFormStarted(true);
          }, 100);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleStartForm = () => {
    setShowScholar(false);
    setTimeout(() => {
      setFormStarted(true);
    }, 600);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
    // Auto-save to localStorage
    localStorage.setItem('currentStudentRegistration', JSON.stringify({
      formData: updatedFormData,
      photoPreview: photoPreview
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFormData = {
        ...formData,
        profilePhoto: file,
      };
      setFormData(updatedFormData);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        // Auto-save to localStorage with photo
        localStorage.setItem('currentStudentRegistration', JSON.stringify({
          formData: updatedFormData,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:', formData);
      
      // Store form data in localStorage
      const dataToStore = {
        ...formData,
        profilePhoto: photoPreview, // Store base64 preview instead of file object
        submittedAt: new Date().toISOString(),
      };
      
      // Get existing registrations and add new one
      let allRegistrations = [];
      const existingData = localStorage.getItem('allStudentRegistrations');
      if (existingData) {
        try {
          allRegistrations = JSON.parse(existingData);
        } catch (error) {
          console.error('Error parsing existing registrations:', error);
          allRegistrations = [];
        }
      }
      allRegistrations.push(dataToStore);
      localStorage.setItem('allStudentRegistrations', JSON.stringify(allRegistrations));
      
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          studentId: '',
          department: '',
          dob: '',
          address: '',
          profilePhoto: null,
          gpa: '',
          emergencyContact: '',
        });
        setPhotoPreview(null);
        setErrors({});
        localStorage.removeItem('currentStudentRegistration'); // Clear draft data
        // Navigate to Form1 after submission
        if (onNext) {
          onNext();
        }
      }, 3000);
    }
  };

  return (
    <div className="form-container">
      <div className="circle-bg">
        <div className="circle-content">
          <div className="circle-icon">🎓</div>
          <div className="circle-text">Register Now</div>
        </div>
      </div>

      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>Welcome to our community, {formData.fullName}!</p>
        </div>
      ) : !formStarted ? (
        <div className={`scholar-button-container ${!showScholar ? 'exit' : ''}`}>
          <button 
            className="scholar-button"
            onClick={handleStartForm}
          >
            <div className="scholar-icon">🎓</div>
            <h2>Ready to Join?</h2>
            <p>Click here to fill your registration form</p>
            <div className="button-arrow">↓</div>
          </button>
        </div>
      ) : (
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1>Student Registration Portal</h1>
            <p>Join our academic community</p>
          </div>

          {/* Profile Photo Section */}
          <div className="photo-section">
            <div className="photo-upload">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <span>📷</span>
                </div>
              )}
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
              />
              <label htmlFor="profilePhoto" className="photo-label">
                Upload Photo
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name *
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId" className="form-label">
                Student ID *
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('studentId')}
                  onBlur={() => setFocusedField(null)}
                  className={`form-input ${errors.studentId ? 'error' : ''}`}
                  placeholder="STU-2026-001"
                />
                {errors.studentId && <span className="error-text">{errors.studentId}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                Date of Birth *
              </label>
              <div className="input-wrapper">
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('dob')}
                  onBlur={() => setFocusedField(null)}
                  className={`form-input ${errors.dob ? 'error' : ''}`}
                />
                {errors.dob && <span className="error-text">{errors.dob}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department *
              </label>
              <div className="input-wrapper">
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('department')}
                  onBlur={() => setFocusedField(null)}
                  className={`form-input ${errors.department ? 'error' : ''}`}
                >
                  <option value="">Select a department</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="business">Business Administration</option>
                  <option value="arts">Liberal Arts</option>
                  <option value="sciences">Natural Sciences</option>
                  <option value="medicine">Pre-Medicine</option>
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gpa" className="form-label">
                Expected GPA
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="gpa"
                  name="gpa"
                  min="0"
                  max="4"
                  step="0.1"
                  value={formData.gpa}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="3.5"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address *
            </label>
            <div className="input-wrapper">
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
                className={`form-input textarea ${errors.address ? 'error' : ''}`}
                placeholder="Enter your complete address"
                rows="3"
              ></textarea>
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContact" className="form-label">
              Emergency Contact
            </label>
            <div className="input-wrapper">
              <input
                type="tel"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="form-input"
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button type="button" className="submit-btn" onClick={() => {
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                studentId: '',
                department: '',
                dob: '',
                address: '',
                profilePhoto: null,
                gpa: '',
                emergencyContact: '',
              });
              setPhotoPreview(null);
              setErrors({});
            }} style={{ backgroundColor: '#6b7280' }}>
              <span className="btn-text">↻ Reset</span>
            </button>
            <button type="submit" className="submit-btn">
              <span className="btn-text">Register Now</span>
              <span className="btn-icon">→</span>
            </button>
          </div>

          <p className="form-note">* All marked fields are required</p>
        </form>
      )}
    </div>
  );
};

export default Form2;
