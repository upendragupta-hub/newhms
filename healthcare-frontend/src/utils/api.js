import axios from 'axios';

const API = axios.create({
    baseURL: 'https://newhms.onrender.com/api', // Aapka backend URL
    withCredentials: true // Cookies (Token) bhejne ke liye
});

export default API;