import { toDenom, toPcent } from '../utils';
import FileManagement from './FileManagement';
import React, { useState, useEffect } from 'react';
import FileAPIService from '../services/FileApiService';


function Dashboard({ user, spaceUsed, allocatedSpace, logout, token, fetchUserDetails }) {
    const [files, setFiles] = useState([]);
    
    useEffect(() => {
        user && fetchFiles();
    }, [user]);

    const fetchFiles = async () => {
        if(!user) return
        const files = await FileAPIService.getInst(token).fetchFiles(user.id)
        if(files) setFiles(files);
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
        <FileManagement files={files} token={token} fetchFiles={fetchFiles} fetchUserDetails={fetchUserDetails} userId={user?.id} />
        </div>
    );
}

export default Dashboard;
