import React, { useState } from 'react';

function RegistrationForm({ setIsRegistered, register }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        register(username, password);
    };

    return (
        <div className="registration-form">
        <h2>Register</h2>
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
        <button onClick={handleRegister}>Register</button>
        <p>
            Already have an account? <button onClick={() => setIsRegistered(true)}>Login</button>
        </p>
        </div>
    );
}

export default RegistrationForm;
