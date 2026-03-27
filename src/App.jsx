import './App.css'
import { useState } from 'react'
import Form1 from './components/Form1'
import Form2 from './components/Form2'
import Admin from './components/Admin'
import Admin1 from './components/Admin1'

function App() {
  const [CurrentForm, setCurrentForm] = useState(2)

  const goToForm2 = () => {
    setCurrentForm(2)
  }

  const goToForm1 = () => {
    setCurrentForm(1)
  }

  const goToAdmin = () => {
    setCurrentForm(0)
  }

  const goToAdmin1 = () => {
    setCurrentForm(3)
  }

  const handleLogout = () => {
    setCurrentForm(0)
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <button 
          onClick={goToAdmin}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Admin Login
        </button>
      </div>
      {CurrentForm === 0 && <Admin onNavigateToForm1={goToForm1} onLoginSuccess={goToAdmin1} />}
      {CurrentForm === 1 && <Form1 onNext={goToForm2} />}
      {CurrentForm === 2 && <Form2 onNext={goToForm1} onBack={goToForm2} />}
      {CurrentForm === 3 && <Admin1 onLogout={handleLogout} />}

    </>
  )
}

export default App
