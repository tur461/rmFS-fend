const BASE_URL = 'http://localhost:8080'

const URL_PATH = {
    USER_LOGIN: '/login',
    USER_REGISTER: '/register',
    GET_USER_BY_USER_ID: '/user/',
    CRE_FILE_BY_USER_ID: '/files/cre_by_uid/',
    DEL_FILE_BY_COMP_ID: '/files/del_by_compid/',
    DWN_FILE_BY_FILE_ID: '/files/get_one_by_fid/',
    GET_FILES_BY_USER_ID: '/files/get_all_by_uid/',

}


export {
    BASE_URL,
    URL_PATH
}