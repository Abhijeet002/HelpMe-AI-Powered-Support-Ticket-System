import axios from 'axios';
import { logout } from './redux/slices/authSlice';
import { store } from './redux/store';
import { log } from 'console';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Include credentials for CORS requests
})

// Request interceptor logic 
API.interceptors.request.use(
    (config)=>{
        const token = store.getState().auth.token;
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Response interceptor logic 
API.interceptors.response.use(
    (response)=> response,
    async(error)=>{
        if(error.response && error.response.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
)

// refresh token logic is not implemented here in this we have to add it.

export default API;