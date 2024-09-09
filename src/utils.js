import { BASE_URL, URL_PATH } from "./constants";

const toMB = v => ( v / (1024 * 1024) ).toFixed(4);

const toPcent = (n, d) => `( ${(n / d * 100).toFixed(1)}% )`;

const toDenom = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1e6) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
    return `${(bytes / 1e9).toFixed(1)} GB`;
  };

  const truncFname = (fname, maxLen) => {
    const [name, ext] = fname.split('.');
    return name.length > maxLen
      ? `${name.slice(0, maxLen)}...${ext ? '.' + ext : ''}`
      : fname;
  };

  const login_url = _ => `${BASE_URL}${URL_PATH.USER_LOGIN}`;
  const register_url = _ => `${BASE_URL}${URL_PATH.USER_REGISTER}`;
  const download_by_fid_url = f_id => `${BASE_URL}${URL_PATH.DWN_FILE_BY_FILE_ID}${f_id}`;
  const user_by_uid_url = user_id => `${BASE_URL}${URL_PATH.GET_USER_BY_USER_ID}${user_id}`;
  const files_by_uid_url = user_id => `${BASE_URL}${URL_PATH.GET_FILES_BY_USER_ID}${user_id}`;
  const create_by_uid_url = user_id => `${BASE_URL}${URL_PATH.CRE_FILE_BY_USER_ID}${user_id}`;
  const delete_by_fid_url = file_id => `${BASE_URL}${URL_PATH.DEL_FILE_BY_FILE_ID}${file_id}`;

  const createDownloadLinkFor = (blobData, headers) => {
    const blob = new Blob([blobData], { type: headers['content-type'] });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            
            const contentDisposition = headers['content-disposition'];
            let fileName = 'downloaded_file';
            console.log('downloaded: ', contentDisposition, headers);
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
  }

export {
    toMB,
    toDenom,
    toPcent,
    truncFname,

    login_url,
    register_url,
    user_by_uid_url,
    files_by_uid_url,
    create_by_uid_url,
    delete_by_fid_url,
    download_by_fid_url,
    createDownloadLinkFor,
}