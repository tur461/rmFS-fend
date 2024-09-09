import axios from "axios";
import { toast } from "react-toastify";
import { create_by_uid_url, delete_by_fid_url, download_by_fid_url, files_by_uid_url } from "../utils";

export default class FileAPIService {
    static inst = null
    constructor(token) {
        if(FileAPIService.inst) return FileAPIService.inst
        this.token = token
        FileAPIService.inst = this
    }

    async fetchFiles(uid) {
        try {
            console.log('[Dash] fetching files..')
            const resp = await axios.get(files_by_uid_url(uid), {
            headers: { Authorization: `Bearer ${this.token}` },
        });
        if(resp.status >= 200 && resp.status <= 300) {
            return resp.data
        }
        } catch (err) {
            console.error('Error fetching files', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
        }
        return null
    }

    async uploadFile(fileData, uid) {
        console.log('[FMGMT] Uploading file', this.token);
        var loadID = toast.loading('Uploading..')
        try {
            const resp = await axios.post(
            create_by_uid_url(uid),
            fileData,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
            );
            if(resp.status >= 200 && resp.status <= 300) {
                toast.update(loadID, {render: "Completed.", type: "success", isLoading: !1, autoClose: 5000});
                toast.success('File uploaded successfully!');
                return !0;
            }
        } catch (err) {
            console.error('Error uploading file', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
        }
        toast.update(loadID, {render: "File upload failed!", type: "error", isLoading: !1, autoClose: 5000});
        return !1
    }
    
    async delFile(fid) {
        console.log('Deleting file..')
        try {
            const resp = await axios.delete(delete_by_fid_url(`${fid}`), {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            if(resp.status >= 200 && resp.status <= 300) {
                toast.success('File deleted successfully!');
                return !0
            }
        } catch (err) {
            console.error('Error deleting file', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
        }
        toast.error('Failed to delete the file.');
        return !1
    }

    async downloadFile(fid) {
        console.log('Downloading file..')
        var loadID = toast.loading('Downloading..')
        try {
            const resp = await axios.get(download_by_fid_url(fid), {
                headers: { Authorization: `Bearer ${this.token}` },
                responseType: 'blob',
            });

            if(resp.status >= 200 && resp.status <= 300) {
                toast.update(loadID, {render: "Download Completed.", type: "success", isLoading: !1, autoClose: 5000});
                return {
                    data: resp.data, 
                    headers: resp.headers
                }
            }
        } catch (err) {
            console.error('Error deleting file', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
        }
        toast.update(loadID, {render: "Something went wrong.", type: "error", isLoading: !1, autoClose: 5000});
        return null
    }

    static getInst(token) {
        if(!FileAPIService.inst) FileAPIService.inst = new FileAPIService(token)
        return FileAPIService.inst
    }
}