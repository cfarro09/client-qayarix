import clientAxios from './axios';

const triggeraxios = async (method, url, data, callback, source) => {
    try {
        const result = await clientAxios({
            method,
            url,
            data,
            cancelToken: source?.token
        });
        if (callback)
            callback(result.data);
        return {
            success: true,
            result: result.data
        }
    } catch (error) {
        return {
            success: false,
            msg: error?.response?.data?.error?.mensaje
        }
    }
}

export default triggeraxios;

