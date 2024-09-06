import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import { toast } from 'react-toastify';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [spaceUsed, setSpaceUsed] = useState(0);
  const [allocatedSpace, setAllocatedSpace] = useState(0);
  const [isRegistered, setIsRegistered] = useState(true); // Flag to toggle between login and registration

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserDetails(decoded.sub);
    }
  }, [token]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        setUser(response.data);
        setSpaceUsed(response.data.used_space);
        setAllocatedSpace(response.data.allocated_space);
      } else {
        // toast.error('Err!. [code: ' + response.status +  ']');
      }
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      const jwtToken = response.data;
      if (response.status === 200) {
        toast.success('Login successful!');
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        const decoded = jwtDecode(jwtToken);
        fetchUserDetails(decoded.sub);
      } else {
        toast.error('Err!. [code: ' + response.status +  ']');
      }
    } catch (error) {

      console.error('Login failed', error);
    }
  };

  const register = async (username, password) => {
    try {
      await axios.post('http://localhost:8080/register', { username, password });
      setIsRegistered(true);
      toast.success('Registered successfully.')
    } catch (error) {
      toast.error('Registration failed.')
      console.error('Registration failed', error);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      {!token ? (
        isRegistered ? (
          <LoginForm setIsRegistered={setIsRegistered} login={login} />
        ) : (
          <RegistrationForm setIsRegistered={setIsRegistered} register={register} />
        )
      ) : (
        <Dashboard
          user={user}
          spaceUsed={spaceUsed}
          allocatedSpace={allocatedSpace}
          logout={logout}
          token={token}
        />
      )}
    </div>
  );
}

export default App;
