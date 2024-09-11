import { BASE_URL, MISC, URL_PATH } from "./constants";

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


  const blobToArrBuf = blob => {
    return new Promise((r, j) => {
        const reader = new FileReader();
        reader.onloadend = () => r(reader.result);
        reader.onerror = j;
        reader.readAsArrayBuffer(blob); // Read the blob as ArrayBuffer
    });
}
  const createDownloadLinkFor = async (blobData, headers) => {
    const secret = MISC.ENC_KEY
    const str = atob(headers['x-file-iv']);
    const iv = str.replace(/\[|\]/g, '').split(',').map(Number); 
    const arrBuf = await blobToArrBuf(blobData)
    console.log('[CDLF] IV:', blobData, str, iv, secret, arrBuf)

    const decBlob = await decFile(arrBuf, iv, secret);
    const blob = new Blob([decBlob], { type: headers['content-type'] })
    
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
  
  const encFile = async (file, secret) => {
    const arrayBuffer = await file.arrayBuffer();
    const key = await getKeyFromSecret(secret);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encContent = await crypto.subtle.encrypt(
        {
            name: MISC.ALGO.AES_GCM,
            iv: iv,
        },
        key,
        arrayBuffer
    );

    return { encContent, iv };
  }
  
  const decFile = async (encContent, iv, secret) => {
    const key = await getKeyFromSecret(secret);

    const decryptedArrayBuffer = await crypto.subtle.decrypt(
        {
            name: MISC.ALGO.AES_GCM,
            iv: new Uint8Array(iv),
        },
        key,
        encContent
    );

    return new Blob([decryptedArrayBuffer]);
  }

  const getKeyFromSecret = async secret => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("salt"), // Use a proper salt
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
};

export {
    toMB,
    toDenom,
    toPcent,
    truncFname,

    encFile,
    decFile,

    login_url,
    register_url,
    user_by_uid_url,
    files_by_uid_url,
    create_by_uid_url,
    delete_by_fid_url,
    download_by_fid_url,
    createDownloadLinkFor,
}