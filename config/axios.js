import axios from 'axios';

const clientAxios = axios.create({
    baseURL: process.env.urlapi
});

export default clientAxios;