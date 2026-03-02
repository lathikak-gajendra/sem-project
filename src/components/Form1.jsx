import React, { useState, useEffect } from 'react';
import './styles.css';

const availableCourses = [
  { code: 'CS101', name: 'Introduction to Programming', credits: 3 },
  { code: 'CS102', name: 'Data Structures', credits: 4 },
  { code: 'MA101', name: 'Calculus I', credits: 4 },
  { code: 'PH101', name: 'Physics I', credits: 3 },
  { code: 'EN101', name: 'English Composition', credits: 2 },
  { code: 'HS101', name: 'History of Civilizations', credits: 2 },
  { code: 'EC101', name: 'Microeconomics', credits: 3 },
  { code: 'BI101', name: 'Biology Basics', credits: 3 },
  { code: 'CH101', name: 'Chemistry I', credits: 3 },
  { code: 'CS201', name: 'Algorithms', credits: 4 },
  { code: 'MA201', name: 'Calculus II', credits: 4 },
  { code: 'PH102', name: 'Physics II', credits: 3 },
  { code: 'EN102', name: 'Literature Analysis', credits: 2 },
  { code: 'CS301', name: 'Database Systems', credits: 4 },
  { code: 'BI102', name: 'Advanced Biology', credits: 4 },
  { code: 'CH102', name: 'Chemistry II', credits: 3 },
  { code: 'EC102', name: 'Macroeconomics', credits: 3 },
  { code: 'MA102', name: 'Linear Algebra', credits: 4 },
  { code: 'CS103', name: 'Web Development', credits: 3 },
  { code: 'PS101', name: 'Psychology Basics', credits: 2 },
];

const initialSelections = ['', '', '', '', ''];

export default function Form1({ onNext }) {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [semester, setSemester] = useState('Fall 2026');
  const [selections, setSelections] = useState(initialSelections);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [animPlay, setAnimPlay] = useState(false);

  useEffect(() => {
    // Load previously submitted data from localStorage on mount
    const savedData = localStorage.getItem('currentCourseRegistration');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.studentId) setStudentId(parsed.studentId);
        if (parsed.semester) setSemester(parsed.semester);
        if (parsed.selections) setSelections(parsed.selections);
      } catch (error) {
        console.error('Error loading saved course data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // slight delay to trigger entrance animations
    const t = setTimeout(() => setAnimPlay(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (index, value) => {
    const next = [...selections];
    next[index] = value;
    setSelections(next);
    // Auto-save to localStorage
    localStorage.setItem('currentCourseRegistration', JSON.stringify({
      studentName,
      studentId,
      semester,
      selections: next
    }));
  };

  const totalCredits = selections.reduce((sum, sel) => {
    const course = availableCourses.find((c) => c.code === sel);
    return sum + (course ? course.credits : 0);
  }, 0);

  const validate = () => {
    const e = {};
    if (!studentName.trim()) e.studentName = 'Enter full name';
    if (!studentId.trim()) e.studentId = 'Enter student ID';
    const filled = selections.filter(Boolean);
    if (filled.length < 1) e.courses = 'Choose at least one course';
    const dupCheck = new Set(filled);
    if (dupCheck.size !== filled.length) e.courses = 'Duplicate courses selected';
    if (totalCredits > 22) e.credits = 'Total credits exceed 22';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit clicked - Current state:', { studentName, studentId, selections, totalCredits });
    
    if (!validate()) {
      console.log('Validation failed:', errors);
      return;
    }
    
    // Store form data in localStorage
    const formData = {
      studentName,
      studentId,
      semester,
      courses: selections.filter(Boolean),
      totalCredits,
      submittedAt: new Date().toISOString(),
    };
    
    console.log('Form data being saved:', formData);
    
    // Get existing course registrations and add new one
    let allCourseRegistrations = [];
    const existingCourseData = localStorage.getItem('allCourseRegistrations');
    if (existingCourseData) {
      try {
        allCourseRegistrations = JSON.parse(existingCourseData);
      } catch (error) {
        console.error('Error parsing existing course registrations:', error);
        allCourseRegistrations = [];
      }
    }
    allCourseRegistrations.push(formData);
    localStorage.setItem('allCourseRegistrations', JSON.stringify(allCourseRegistrations));
    console.log('Data saved to localStorage');
    
    setSubmitted(true);
    setShowSummary(true);
    
    // auto-reset after 4 seconds
    setTimeout(() => {
      setSubmitted(false);
      setShowSummary(false);
      setStudentName('');
      setStudentId('');
      setSelections(initialSelections);
      setErrors({});
      setAnimPlay(false);
      localStorage.removeItem('currentCourseRegistration'); // Clear draft data
      setTimeout(() => setAnimPlay(true), 40);
    }, 4000);
  };
  


  return (
    <div className={`course-form ${animPlay ? 'play' : ''}`}>
      <div className="course-header">
        <div className="sparkles" aria-hidden />
        <h1 className="course-title">Course Registration</h1>
        <p className="course-sub">Select up to 5 courses — make it count!</p>
      </div>

      <form className="course-card" onSubmit={handleSubmit}>
        {Object.keys(errors).length > 0 && (
          <div style={{
            background: '#fee',
            border: '2px solid #c53030',
            color: '#c53030',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            ⚠️ Please fix the following errors:
            <ul style={{marginTop: '10px', marginBottom: '0', paddingLeft: '20px'}}>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="student-row">
          <div className="input-group">
            <label>Student Name</label>
            <input
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                localStorage.setItem('currentCourseRegistration', JSON.stringify({
                  studentName: e.target.value,
                  studentId,
                  semester,
                  selections
                }));
              }}
              placeholder="Full name"
              className={errors.studentName ? 'error' : ''}
            />
            {errors.studentName && <div className="error-text">{errors.studentName}</div>}
          </div>

          <div className="input-group">
            <label>Student ID</label>
            <input
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                localStorage.setItem('currentCourseRegistration', JSON.stringify({
                  studentName,
                  studentId: e.target.value,
                  semester,
                  selections
                }));
              }}
              placeholder="STU-2026-123"
              className={errors.studentId ? 'error' : ''}
            />
            {errors.studentId && <div className="error-text">{errors.studentId}</div>}
          </div>
        </div>

        <div className="term-row">
          <label className="term-label">Semester</label>
          <select value={semester} onChange={(e) => {
            setSemester(e.target.value);
            localStorage.setItem('currentCourseRegistration', JSON.stringify({
              studentName,
              studentId,
              semester: e.target.value,
              selections
            }));
          }} className="course-select">
            <option>Fall 2026</option>
            <option>Spring 2027</option>
            <option>Summer 2027</option>
          </select>
        </div>

        <div className="courses-grid">
          {selections.map((sel, idx) => (
            <div key={idx} className={`course-slot ${sel ? 'filled' : ''}`}>
              <label>Course {idx + 1}</label>
              <select
                value={sel}
                onChange={(e) => handleSelect(idx, e.target.value)}
                className="course-select"
              >
                <option value="">-- choose course --</option>
                {availableCourses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.credits}cr)
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {errors.courses && <div className="error-text" style={{marginTop: '10px'}}>{errors.courses}</div>}

        <div className="info-row">
          <div className="credits-box">
            <div className="credits-label">Total Credits</div>
            <div>
              <span className="credits-value">{totalCredits}</span>
              <span style={{marginLeft:'5px', fontWeight: '600', color: '#4a5568'}}>/ 22</span>
            </div>
            <div className="credits-track">
              <div className="credits-bar" style={{ width: `${Math.min(100, (totalCredits / 22) * 100)}%` }} />
            </div>
          </div>

          <div className="actions">
            <button type="button" className="btn-ghost" onClick={() => { setSelections(initialSelections); setErrors({}); }}>
              Reset
            </button>
            <button type="submit" className="btn-primary">
              Submit Registration
            </button>
            <button type="button" className="btn-primary" onClick={onNext} style={{ marginLeft: '10px', backgroundColor: '#6366f1' }}>
              Next →
            </button>
          </div>
        </div>

      </form>

      <div className={`summary-panel ${showSummary ? 'open' : ''}`}>
        <h3>Enrollment Summary</h3>
        <div className="summary-list">
          {selections.filter(Boolean).map((code) => {
            const c = availableCourses.find((x) => x.code === code);
            return (
              <div key={code} className="summary-item">
                <div className="pill">{c.code}</div>
                <div className="summary-text">{c.name}</div>
                <div className="summary-credits">{c.credits} cr</div>
              </div>
            );
          })}
        </div>
        <div className="summary-total">Total Credits: {totalCredits}</div>
      </div>

      {submitted && <div className="toast">Registration submitted ✓</div>}
    </div>
  );
}



