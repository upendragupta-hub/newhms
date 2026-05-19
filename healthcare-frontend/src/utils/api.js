import axios from 'axios';

const defaultBaseURL = import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://newhms.onrender.com/api';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
    withCredentials: true // Cookies (Token) bhejne ke liye
});

export default API;
