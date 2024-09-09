import axios from "axios";
import { toast } from "react-toastify";
import { login_url, register_url, user_by_uid_url } from "../utils";

export default class UserAPIService {
    static inst = null
    constructor(token) {
        if(UserAPIService.inst) return UserAPIService.inst
        this.token = token
        UserAPIService.inst = this
    }
    async fetchUserDetails(uid) {
        try {
            console.log('fetching user..', this.token)
            const resp = await axios.get(user_by_uid_url(uid), {
              headers: { Authorization: `Bearer ${this.token}` },
            });
            
            console.log('fetch user:', resp)
            if (resp.status >= 200 && resp.status <= 300) {
                return resp.data       
            }
          } catch (err) {
            console.error('Error fetching user details', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
          }
          return null
    }

    async doLogin(username, password) {
        try {
            const resp = await axios.post(login_url(), { username, password });
            
            if (resp.status >= 200 && resp.status <= 300) {
              toast.success('Login successful!');
              return resp.data
            }
          } catch (err) {
            console.error('Login failed', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
          }
          toast.error('Login failed.')
          return null
    }

    async doRegister(username, password, allocated_space) {
        try {
            const resp = await axios.post(register_url(), { username, password, allocated_space });
            if(resp.status == 200) {
              toast.success('Registered successfully.')
              return !0
            }
          } catch (err) {
            console.error('Registration failed', err);
            if(err.response) toast.error(err.response.data)
            else toast.error(err.message)
          }
          toast.error('Registration failed.')
          return !1
    }

    static getInst(token) {
        if(!UserAPIService.inst) UserAPIService.inst = new UserAPIService(token)
        return UserAPIService.inst
    }
}