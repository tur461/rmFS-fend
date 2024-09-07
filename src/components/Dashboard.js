import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileManagement from './FileManagement';

function Dashboard({ user, spaceUsed, allocatedSpace, logout, token }) {
    const [files, setFiles] = useState([]);
    
    console.log('[Dash] user', user)

    useEffect(() => {
        user && fetchFiles();
    }, [user]);

    const fetchFiles = async () => {
        if(!user) return
        try {
            console.log('[Dash] fetching files: ', token)
        const response = await axios.get(`http://localhost:8080/files/get_all_by_uid/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(response.data);
        } catch (error) {
        console.error('Error fetching files', error);
        }
    };

    return (
        <div className="dashboard">
        <h1>Dashboard</h1>
        <p>
            <strong>Username:</strong> {user?.username}
        </p>
        <p>
            <strong>Space Used:</strong> {spaceUsed} MB / {allocatedSpace} MB
        </p>
        <button onClick={logout}>Logout</button>
        <FileManagement files={files} token={token} fetchFiles={fetchFiles} user_id={user?.id} />
        </div>
    );
}

export default Dashboard;
