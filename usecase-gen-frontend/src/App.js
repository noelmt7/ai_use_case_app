import React, { useEffect, useState } from 'react';
import './App.css';
import IndustryAnalysis from './IndustryAnalysis';
import Login from './Login'; // Import the Login component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in on initial load
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store login state in localStorage
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <IndustryAnalysis />
      )}
    </div>
  );
}

export default App;
