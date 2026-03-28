import { useState, useEffect } from 'react';
import './styles.css';

function Admin1({ onLogout }) {
  const [displayMode, setDisplayMode] = useState(null); // null, 'profile', or 'courses'
  const [profileData, setProfileData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

 
  const handleViewProfiles = () => {
    const profiles = [];
    try {
      const existingData = localStorage.getItem('allStudentRegistrations');
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        if (Array.isArray(parsedData)) {
          profiles.push(...parsedData);
        }
      }
    } catch (error) {
      console.error('Error parsing profile data:', error);
    }
    console.log('Loaded profiles:', profiles);
    setAllProfiles(profiles);
    setDisplayMode('profile');
  };

  
  const handleViewCourses = () => {
    const courses = [];
    try {
      const existingData = localStorage.getItem('allCourseRegistrations');
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        if (Array.isArray(parsedData)) {
          courses.push(...parsedData);
        }
      }
    } catch (error) {
      console.error('Error parsing course data:', error);
    }
    console.log('Loaded courses:', courses);
    setAllCourses(courses);
    setDisplayMode('courses');
  };


  const handleDeleteProfile = (deleteIndex) => {
    try {
      const updated = allProfiles.filter((_, idx) => idx !== deleteIndex);
      setAllProfiles(updated);
      localStorage.setItem('allStudentRegistrations', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  
  const handleDeleteCourse = (deleteIndex) => {
    try {
      const updated = allCourses.filter((_, idx) => idx !== deleteIndex);
      setAllCourses(updated);
      localStorage.setItem('allCourseRegistrations', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting course registration:', error);
    }
  };

  // Edit course registration state
  const [editingCourseIndex, setEditingCourseIndex] = useState(null);
  const [editRegistration, setEditRegistration] = useState(null);
  const [editNewCourse, setEditNewCourse] = useState('');

  const startEditCourse = (index) => {
    const toEdit = allCourses[index];
    setEditingCourseIndex(index);
    // shallow copy to allow editing
    setEditRegistration({ ...toEdit, courses: Array.isArray(toEdit.courses) ? [...toEdit.courses] : [] });
    setEditNewCourse('');
  };

  const cancelEdit = () => {
    setEditingCourseIndex(null);
    setEditRegistration(null);
    setEditNewCourse('');
  };

  const saveEdit = () => {
    if (editingCourseIndex === null || !editRegistration) return;
    try {
      const updated = allCourses.map((item, idx) => (idx === editingCourseIndex ? editRegistration : item));
      setAllCourses(updated);
      localStorage.setItem('allCourseRegistrations', JSON.stringify(updated));
      cancelEdit();
    } catch (error) {
      console.error('Error saving course registration edit:', error);
    }
  };

  const addCourseToEdit = () => {
    const code = (editNewCourse || '').trim();
    if (!code) return;
    setEditRegistration((prev) => ({ ...prev, courses: [...(prev.courses || []), code] }));
    setEditNewCourse('');
  };

  const removeCourseFromEdit = (idxToRemove) => {
    setEditRegistration((prev) => ({ ...prev, courses: prev.courses.filter((_, i) => i !== idxToRemove) }));
  };

  const handleEditTotalCredits = (value) => {
    const parsed = parseInt(value, 10);
    setEditRegistration((prev) => ({ ...prev, totalCredits: Number.isNaN(parsed) ? '' : parsed }));
  };

  return (
    <div className="admin-dashboard">
      {}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📊 Admin Dashboard</h1>
          <p>Manage Student Registrations</p>
        </div>
        <button className="logout-btn-header" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      {displayMode === null && (
        <div className="admin-container">
          <div className="welcome-section">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Select an option below to manage registrations</p>
          </div>

          <div className="buttons-grid">
            <button className="button-option profile-btn" onClick={handleViewProfiles}>
              <div className="btn-icon">👤</div>
              <div className="btn-title">Student Profiles</div>
              <div className="btn-desc">View all profile registrations</div>
            </button>

            <button className="button-option courses-btn" onClick={handleViewCourses}>
              <div className="btn-icon">📚</div>
              <div className="btn-title">Course Registrations</div>
              <div className="btn-desc">View all course selections</div>
            </button>
          </div>
        </div>
      )}

      {/* Profile Registrations View */}
      {displayMode === 'profile' && (
        <div className="admin-container">
          <div className="view-header">
            <h2>📋 Student Profile Registrations</h2>
            <button className="btn-back" onClick={() => setDisplayMode(null)}>
              ← Back
            </button>
          </div>

          {allProfiles.length > 0 ? (
            <div className="registrations-list">
              {allProfiles.map((profile, index) => (
                <div key={index} className="registration-card profile-card">
                  <div className="card-header">
                    <h3>Student #{index + 1}</h3>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span className="submitted-at">
                        {profile.submittedAt ? new Date(profile.submittedAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProfile(index)}
                        title="Delete profile"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    {profile.profilePhoto && (
                      <div className="profile-photo">
                        <img src={profile.profilePhoto} alt="Profile" />
                      </div>
                    )}

                    <div className="profile-details">
                      <div className="detail-row">
                        <span className="label">Full Name:</span>
                        <span className="value">{profile.fullName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Email:</span>
                        <span className="value">{profile.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Phone:</span>
                        <span className="value">{profile.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Student ID:</span>
                        <span className="value">{profile.studentId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Department:</span>
                        <span className="value">{profile.department}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Date of Birth:</span>
                        <span className="value">{profile.dob}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Address:</span>
                        <span className="value">{profile.address}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">GPA:</span>
                        <span className="value">{profile.gpa || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Emergency Contact:</span>
                        <span className="value">{profile.emergencyContact || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No profile registrations found</p>
            </div>
          )}
        </div>
      )}

      {/* Course Registrations View */}
      {displayMode === 'courses' && (
        <div className="admin-container">
          <div className="view-header">
            <h2>📚 Course Registrations</h2>
            <button className="btn-back" onClick={() => setDisplayMode(null)}>
              ← Back
            </button>
          </div>

          {allCourses.length > 0 ? (
            <div className="registrations-list">
              {allCourses.map((registration, index) => (
                <div key={index} className="registration-card course-card">
                  <div className="card-header">
                    <h3>Course Registration #{index + 1}</h3>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span className="submitted-at">
                        {registration.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <button
                        className="edit-btn"
                        onClick={() => startEditCourse(index)}
                        title="Edit course registration"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCourse(index)}
                        title="Delete course registration"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    {editingCourseIndex === index && editRegistration ? (
                      <div className="course-edit-form">
                        <div className="detail-row">
                          <label className="label">Total Credits:</label>
                          <input
                            className="small-input"
                            type="number"
                            value={editRegistration.totalCredits || ''}
                            onChange={(e) => handleEditTotalCredits(e.target.value)}
                          />
                        </div>

                        <div className="detail-row" style={{alignItems: 'flex-start'}}>
                          <div style={{flex: 1}}>
                            <label className="label">Selected Courses:</label>
                            <div className="courses-edit-list">
                              {(editRegistration.courses || []).length > 0 ? (
                                (editRegistration.courses || []).map((c, ci) => (
                                  <div key={ci} className="chip">
                                    <span>{c}</span>
                                    <button className="chip-remove" onClick={() => removeCourseFromEdit(ci)}>
                                      ✕
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <p>No courses selected</p>
                              )}
                            </div>

                            <div style={{display: 'flex', gap: 8, marginTop: 8}}>
                              <input
                                className="small-input"
                                type="text"
                                placeholder="Add course code (e.g. CS101)"
                                value={editNewCourse}
                                onChange={(e) => setEditNewCourse(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') addCourseToEdit(); }}
                              />
                              <button className="button-option small" onClick={addCourseToEdit}>Add</button>
                            </div>
                          </div>
                        </div>

                        <div style={{display: 'flex', gap: 10, marginTop: 12}}>
                          <button className="button-option" onClick={saveEdit}>Save</button>
                          <button className="button-option" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="course-details">
                        <div className="detail-row">
                          <span className="label">Student Name:</span>
                          <span className="value">{registration.studentName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Student ID:</span>
                          <span className="value">{registration.studentId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Semester:</span>
                          <span className="value">{registration.semester}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Total Credits:</span>
                          <span className="value course-credits">{registration.totalCredits}</span>
                        </div>

                        <div className="courses-section">
                          <h4>📖 Selected Courses:</h4>
                          <div className="courses-list">
                            {registration.courses && registration.courses.length > 0 ? (
                              registration.courses.map((courseCode, idx) => (
                                <div key={idx} className="course-item">
                                  <span className="course-code">{courseCode}</span>
                                </div>
                              ))
                            ) : (
                              <p>No courses selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No course registrations found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin1;
