import clientAxios from './axios';

const tokenAuth = token => {
    if(token){
        clientAxios.defaults.headers['Authorization'] = `Bearer ${token}`;
    }else{
        delete clientAxios.defaults.headers['Authorization'];
    }
}

export default tokenAuth;