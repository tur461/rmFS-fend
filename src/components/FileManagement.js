import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { create_by_uid_url, delete_by_fid_url, download_by_fid_url, toDenom, truncFname } from '../utils';

function FileManagement({ files, token, fetchFiles, fetchUserDetails, user_id }) {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const createFile = async () => {
        if (selectedFile) {
            var loadID = null;
            try {
                loadID = toast.loading('Uploading..')
                
                console.log('[FMGMT] Uploading file: ', token, user_id);

                const formData = new FormData();
                formData.append('file', selectedFile);

                await axios.post(
                    create_by_uid_url(user_id),
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                toast.update(loadID, {render: "Completed.", type: "success", isLoading: !1, autoClose: 5000});

                if (fileInputRef.current) fileInputRef.current.value = '';

                toast.success('File uploaded successfully!');
                fetchFiles();
                fetchUserDetails(user_id);
                setFileName('');
                setSelectedFile(null);

            } catch (error) {
                console.log('LOAD ID:', loadID)
                toast.update(loadID, {render: "Something went wrong.", type: "error", isLoading: !1, autoClose: 5000});
                toast.error(error.response.data);
                console.error('Error uploading file', error);
            }
        } else {
            toast.error('Please select a file to upload.');
        }
    };

    const deleteFile = async (id) => {
        try {
            await axios.delete(delete_by_fid_url(`${id}`), {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('File deleted successfully!');
            fetchFiles();
            fetchUserDetails(user_id)
        } catch (error) {
            toast.error('Failed to delete the file.');
            toast.error(error.response.data)
            console.error('Error deleting file', error);
        }
    };
    
    const downldFile = async (id) => {
        var loadID = null;
        try {
            loadID = toast.loading('Downloading..');
            const response = await axios.get(download_by_fid_url(id), {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'downloaded_file';
            console.log('downloaded: ', contentDisposition, response.headers);
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch.length > 1) {
                    fileName = filenameMatch[1];
                }
            }
            
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
           
            toast.update(loadID, {render: "Download Completed.", type: "success", isLoading: !1, autoClose: 5000});

            // fetchFiles();
            // fetchUserDetails(user_id)
        } catch (error) {
            toast.update(loadID, {render: "Something went wrong.", type: "error", isLoading: !1, autoClose: 5000});
            toast.error('Failed to download the file.');
            toast.error(error.response.data)
            console.error('Error deleting file', error);
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
                        <button onClick={() => downldFile(file.id)}>Donwload</button>
                        <button onClick={() => deleteFile(file.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileManagement;
