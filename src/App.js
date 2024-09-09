import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import UserAPIService from './services/UserApiService';

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

  const fetchUserDetails = async userId => {
    const data = await UserAPIService.getInst(token).fetchUserDetails(userId)
    if(data) {
      setUser(data);
      setSpaceUsed(data.used_space);
      setAllocatedSpace(data.allocated_space);
    }
  };

  const login = async (uname, pwd) => {
    const jwt = await UserAPIService.getInst(null).doLogin(uname, pwd)
    if(jwt) {
      setToken(jwt);
      localStorage.setItem('token', jwt);
      fetchUserDetails(jwtDecode(jwt).sub);
    }
  };

  const register = async (uname, pwd, allocSpace) => {
    const good = await UserAPIService.getInst(null).doRegister(uname, pwd, allocSpace)
    if(good) setIsRegistered(!0);
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
