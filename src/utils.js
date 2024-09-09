import { BASE_URL, URL_PATH } from "./constants";

const toMB = v => ( v / (1024 * 1024) ).toFixed(4);

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

export {
    toMB,
    toDenom,
    truncFname,

    login_url,
    register_url,
    user_by_uid_url,
    files_by_uid_url,
    create_by_uid_url,
    delete_by_fid_url,
    download_by_fid_url,
}