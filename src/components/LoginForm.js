import React, { useState } from 'react';

function LoginForm({ setIsRegistered, login }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
    login(username, password);
    };

    return (
    <div className="login-form">
        <h2>Login</h2>
        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>
        Don't have an account? <button onClick={() => setIsRegistered(!1)}>Register</button>
        </p>
    </div>
  );
}

export default LoginForm;
