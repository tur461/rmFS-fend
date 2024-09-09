import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileManagement from './FileManagement';
import { files_by_uid_url, toDenom } from '../utils';
import { toast } from 'react-toastify';


function Dashboard({ user, spaceUsed, allocatedSpace, logout, token, fetchUserDetails }) {
    const [files, setFiles] = useState([]);
    
    console.log('[Dash] user', user)

    useEffect(() => {
        user && fetchFiles();
    }, [user]);

    const toPcent = (n, d) => `( ${(n / d * 100).toFixed(1)}% )`;

    const fetchFiles = async () => {
        if(!user) return
        try {
            console.log('[Dash] fetching files: ', token)
        const response = await axios.get(files_by_uid_url(user.id), {
            headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(response.data);
        } catch (error) {
            toast.error(error.response.data)
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
            <strong>Space Used:</strong> {toDenom(spaceUsed)} / {toDenom(allocatedSpace)} {toPcent(spaceUsed, allocatedSpace)}
        </p>
        <button onClick={logout}>Logout</button>
        <FileManagement files={files} token={token} fetchFiles={fetchFiles} fetchUserDetails={fetchUserDetails} user_id={user?.id} />
        </div>
    );
}

export default Dashboard;
