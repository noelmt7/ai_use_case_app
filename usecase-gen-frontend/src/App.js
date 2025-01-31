import React, { useEffect, useState } from 'react';
import './App.css';
import IndustryAnalysis from './IndustryAnalysis';
import Login from './login';  // Assuming this is your login page
import TaskList from './tasklist';  // The component where tasks will be displayed
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isIndustryAnalysis, setIsIndustryAnalysis] = useState(false); // Track which component to show

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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Remove login state from localStorage
    setIsLoggedIn(false);
  };

  // Toggle between Industry Analysis and Task List
  const handleSwitchComponent = () => {
    setIsIndustryAnalysis(!isIndustryAnalysis);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Handle routing based on login status */}
          {!isLoggedIn ? (
            <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          ) : (
            <Route path="/" element={
              <>
                {/* Show the component based on the state */}
                {isIndustryAnalysis ? <IndustryAnalysis /> : <TaskList />}
                {/* Button to toggle between TaskList and IndustryAnalysis */}
                <button onClick={handleSwitchComponent}>
                  {isIndustryAnalysis ? 'Go to Task List' : 'Go to Industry Analysis'}
                </button>
                {/* Logout button */}
                <button onClick={handleLogout} className="btn btn-danger mt-3">
                  Logout
                </button>
              </>
            } />
          )}

          {/* Redirect if the user is logged out */}
          <Route path="/login" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
