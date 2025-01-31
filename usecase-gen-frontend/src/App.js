import React, { useEffect, useState } from 'react';
import './App.css';
import IndustryAnalysis from './IndustryAnalysis';
import Login from './login';  // Assuming this is your login page
import TaskList from './tasklist';  // The component where tasks will be displayed

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

  // Toggle between Industry Analysis and Task List
  const handleSwitchComponent = () => {
    setIsIndustryAnalysis(!isIndustryAnalysis);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Show the component based on the state */}
          {isIndustryAnalysis ? <IndustryAnalysis /> : <TaskList />}
          {/* Button to toggle between TaskList and IndustryAnalysis */}
          <button onClick={handleSwitchComponent}>
            {isIndustryAnalysis ? 'Go to Task List' : 'Go to Industry Analysis'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
