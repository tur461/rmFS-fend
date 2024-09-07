import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function FileManagement({ files, token, fetchFiles, user_id }) {
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [editingId, setEditingId] = useState(null);

    const createFile = async () => {
        if (fileName && fileContent) {
        try {
            console.log('[FMGMT] Creating file: ', token, user_id)
            const response = await axios.post(
            `http://localhost:8080/files/cre_by_uid/${user_id}`,
            { filename: fileName, content: fileContent },
            { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('File created successfully!');
            fetchFiles();
            setFileName('');
            setFileContent('');
        } catch (error) {
            toast.error('Failed to create file.');
            console.error('Error creating file', error);
        }
        }
    };

    const updateFile = async () => {
        if (fileName && fileContent && editingId) {
        try {
            const response = await axios.put(
            `http://localhost:8080/files/up_by_fid/${editingId}`,
            { name: fileName, content: fileContent },
            { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('File updated successfully!');
            fetchFiles();
            setFileName('');
            setFileContent('');
            setEditingId(null);
        } catch (error) {
            toast.error('Failed to update file.');
            console.error('Error updating file', error);
        }
        }
    };

    const deleteFile = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/files/del_by_fid/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('File deleted successfully!');
            fetchFiles();
        } catch (error) {
            toast.error('Failed to delete file.');
            console.error('Error deleting file', error);
        }
    };

    const startEditing = (file) => {
        setFileName(file.name);
        setFileContent(file.content);
        setEditingId(file.id);
    };

    const cancelEditing = () => {
        setFileName('');
        setFileContent('');
        setEditingId(null);
    };

    return (
        <div className="file-management">
        <h2>File Management</h2>
        <div className="file-form">
            <input
            type="text"
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            />
            <textarea
            placeholder="File Content"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            />
            {editingId ? (
            <>
                <button onClick={updateFile}>Update File</button>
                <button onClick={cancelEditing}>Cancel</button>
            </>
            ) : (
            <button onClick={createFile}>Create File</button>
            )}
        </div>

        <div className="file-list">
            {files.map((file) => (
            <div key={file.id} className="file-item">
                <h3>{file.name}</h3>
                <img src={`data:image/png;base64,${file.thumbnail}`} alt={file.name} className="file-thumbnail" />
                <p>{file.content}</p>
                <button onClick={() => startEditing(file)}>Edit</button>
                <button onClick={() => deleteFile(file.id)}>Delete</button>
            </div>
            ))}
        </div>
        </div>
    );
}

export default FileManagement;
        
