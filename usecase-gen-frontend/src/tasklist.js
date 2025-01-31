import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  // Fetch the task data
  const fetchData = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setTasks(response.data);  // Store the fetched tasks in the state
    } catch (error) {
      setError('Error fetching tasks');
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>  // Modify as per your task model
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
