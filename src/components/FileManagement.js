import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createDownloadLinkFor, toDenom, truncFname } from '../utils';
import FileAPIService from '../services/FileApiService';

function FileManagement({ files, token, fetchFiles, fetchUserDetails, userId }) {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const createFile = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            const good = await FileAPIService.getInst(token).uploadFile(formData, userId)
            if(good) {
                setFileName('');
                setSelectedFile(null);
                fetchFiles();
                fetchUserDetails(userId);
            }

            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            toast.error('Please select a file to upload.');
        }
    };

    const deleteFile = async fileId => {
        const good = await FileAPIService.getInst(token).delFile(fileId)
        if(good) {
            fetchFiles();
            fetchUserDetails(userId)
        }
    };
    
    const downloadFile = async fileId => {
        const res = await FileAPIService.getInst(token).downloadFile(fileId)
        if(res) {
            createDownloadLinkFor(res.data, res.headers)
        }
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
                <input type="file" onChange={onFileChange} ref={fileInputRef} />
                <button onClick={createFile}>Upload File</button>
            </div>

            <div className="file-list">
                {files.map((file) => (
                    <div key={file.id} className="file-item">
                        <h6>{`${truncFname(file.filename, 12)}  (${toDenom(file.size)})`}</h6>
                        <img src={`data:image/png;base64,${file.thumbnail}`} alt={file.name} className="file-thumbnail" />
                        <button onClick={() => downloadFile(file.id)}>Donwload</button>
                        <button onClick={() => deleteFile(file.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileManagement;
