import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import { toast } from 'react-toastify';
import { login_url, register_url, user_by_uid_url } from './utils';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [spaceUsed, setSpaceUsed] = useState(0);
  const [allocatedSpace, setAllocatedSpace] = useState(0);
  const [isRegistered, setIsRegistered] = useState(!0);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserDetails(decoded.sub);
    }
  }, [token]);

  const fetchUserDetails = async (userId) => {
    try {
      console.log('fetching user: ', token)
      const response = await axios.get(user_by_uid_url(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('fetch user:', response)
      if (response.status === 200) {
        setUser(response.data);
        setSpaceUsed(response.data.used_space);
        setAllocatedSpace(response.data.allocated_space);
      } else {
        // toast.error('Err!. [code: ' + response.status +  ']');
      }
    } catch (error) {
      toast.error(error.response.data)
      console.error('Error fetching user details', error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(login_url(), { username, password });
      const jwtToken = response.data;
      if (response.status === 200) {
        toast.success('Login successful!');
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        const decoded = jwtDecode(jwtToken);
        console.log('Token: ', jwtToken, decoded)
        fetchUserDetails(decoded.sub);
      } else {
        toast.error('Err!. [code: ' + response.status +  ']');
      }
    } catch (error) {
      toast.error('Login failed.')
      toast.error(error.response.data)
      console.error('Login failed', error);
    }
  };

  const register = async (username, password, allocated_space) => {
    try {
      await axios.post(register_url(), { username, password, allocated_space });
      setIsRegistered(!0);
      toast.success('Registered successfully.')
    } catch (error) {
      toast.error('Registration failed.')
      toast.error(error.response.data)
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
          fetchUserDetails={fetchUserDetails}
        />
      )}
    </div>
  );
}

export default App;
