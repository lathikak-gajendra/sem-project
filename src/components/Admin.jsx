import { useState } from 'react';
import './styles.css';

function Admin({ onNavigateToForm1, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

  
    const TEST_CREDENTIALS = {
      email: 'admin@example.com',
      password: 'admin123'
    };

    try {
      
      if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
        setSuccess('Login successful!');
        setEmail('');
        setPassword('');
        setIsLoggedIn(true);
        // Store token for test
        localStorage.setItem('adminToken', 'test-token-' + Date.now());
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1500);
        setLoading(false);
        return;
      }

    
      const response = await fetch('http://localhost:3001/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        setEmail('');
        setPassword('');
        setIsLoggedIn(true);
        // Store token if provided
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        setTimeout(() => {
          console.log('Login successful', data);
        }, 2000);
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running at localhost:3001. For testing, use: admin@example.com / admin123');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
    setSuccess('');
    if (onNavigateToForm1) {
      onNavigateToForm1();
    }
  };

  if (isLoggedIn) {
    return (
      <div className="login-container">
        <div className="success-box">
          <h2>Welcome Admin!</h2>
          <p>You have successfully logged in.</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(u) => setEmail(u.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !email || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="hint">
          Test credentials: admin@example.com / admin123<br/>
          Or use your actual backend credentials when server is running
        </p>
      </div>
    </div>
  );
}

export default Admin;
