import React, { useReducer, useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import authContext from './authContext';
import authReducer from './authReducer';
import { useRouter } from 'next/router';
import clientAxios from '../../config/axios';
import triggeraxios from '../../config/axiosv2';
import tokenAuth from '../../config/tokenAuth';

import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

import {
    LOGIN_SUCCESS,
    AUTH_SUCCESS,
    AUTH_FAILED,
    LOADGLOBAL,
    ORGCHANGE,
    INFOSYS

} from '../../types';

const AuthState = ({ children }) => {

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''; //next run in server and client, validate to get item from localstorage
    const typeuser = typeof window !== 'undefined' ? localStorage.getItem('typeuser') : '';

    const [tologged, settologged] = useState({ isloading: true, logged: false });
    tokenAuth(token);

    const router = useRouter();
    const initialState = {
        token,
        authenticated: token ? true : false,
        user: null,
        message: null,
        typeuser,
        infosys: {
            sys_company_name: "QAYARIX",
            sys_company_img: "/logotipo.png",
            sys_company_color_primary: "#da042e",
            sys_company_color_secondary: "#010025",
        }
    }
    useEffect(() => {
        async function loadUserFromCookies() {
            try {
                const resultproperties = await clientAxios.get('/api/web/properties');
                if (resultproperties.data.data.length > 0) {
                    const auxx = resultproperties.data.data[0].reduce((o, x) => ({
                        ...o,
                        sys_company_name: x.name === "sys_company_name" ? x.value : o.sys_company_name,
                        sys_company_img: x.name === "sys_company_img" ? x.value : o.sys_company_img,
                        sys_company_color_primary: x.name === "sys_company_color_primary" ? x.value : o.sys_company_color_primary,
                        sys_company_color_secondary: x.name === "sys_company_color_secondary" ? x.value : o.sys_company_color_secondary,
                    }), {
                        sys_company_name: "QAYARIX",
                        sys_company_img: "/logotipo.png",
                        sys_company_color_primary: "#da042e",
                        sys_company_color_secondary: "#010025",
                    });
                    dispatch({
                        type: INFOSYS,
                        payload: auxx
                    });
                }

            } catch (error) {
                console.log(error);
            }
            if (token) {
                try {
                    const result = await clientAxios.get('/api/web/validateToken');
                    if (result.data.data.rol_name === "CONSULTOR" && !['/tracking', '/', '/dashboard', '/dashboardpickup', '/reportcontrol', '/reporttower', '/reportcontrolpickup', '/reporttowerpickup', '/reportpickup'].includes(router.pathname)) {
                        settologged({ isloading: false, logged: true })
                        router.push('/').then(() => dispatch({
                            type: AUTH_SUCCESS,
                            payload: { firstname: result.data.data.first_name, lastname: result.data.data.last_name, role_name: result.data.data.rol_name }
                        }))
                    } else {
                        settologged({ isloading: false, logged: true })
                        dispatch({
                            type: AUTH_SUCCESS,
                            payload: { firstname: result.data.data.first_name, lastname: result.data.data.last_name, role_name: result.data.data.rol_name }
                        });
                        if (['/sign-in', '/sign-up'].indexOf(router.pathname) > -1)
                            router.push("/", publicRuntimeConfig.staticFolder + "/");
                    }
                } catch (error) {
                    settologged({ isloading: false, logged: false })
                    dispatch({
                        type: AUTH_FAILED,
                    });
                    router.push('/sign-in', publicRuntimeConfig.staticFolder + '/sign-in')
                }
            } else {
                settologged({ isloading: false, logged: false })
                if (['/sign-in', '/sign-up'].indexOf(router.pathname) === -1)
                    router.push('/sign-in', publicRuntimeConfig.staticFolder + '/sign-in')
            }
        }
        if (router.pathname !== "/guidestatus/[id]") {
            loadUserFromCookies()
        } else {
            settologged({ isloading: false, logged: true })
        }
    }, [token])

    const [state, dispatch] = useReducer(authReducer, initialState)

    const login = async (payload, setisloading, setresultrequest) => {
        setisloading(true);
        try {
            const result = await clientAxios.post('/api/web/login', { data: payload });

            localStorage.setItem('typeuser', result.data.data.type);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: result.data.data
            });
        } catch (e) {
            setresultrequest({
                success: false,
                msg: e.response ? e.response.data.error.mensaje : 'Hubo un problema, vuelva a intentarlo mas tarde'
            });
            setTimeout(() => {
                setresultrequest(null);
            }, 3000);
        }
        setisloading(false);
    }

    const changeOrg = async (neworg, setOpenBackdrop) => {
        try {
            setOpenBackdrop(true)
            const res = await triggeraxios('post', '/api/web/change', { id_organization: neworg.id_organization });

            if (res.success) {
                dispatch({
                    type: ORGCHANGE,
                    payload: { id_organization: neworg.id_organization, org_name: neworg.org_name, token: res.result.data.token }
                });
                tokenAuth(res.result.data.token);
                // setTimeout(() => {
                router.reload()
                // }, 1000);
            }
            setOpenBackdrop(false)

        } catch (e) {
            console.log(e);
        }
    }

    const register = async (payload, setisloading, setresultrequest) => {
        setisloading(true);
        try {
            const result = await clientAxios.post('/api/usuarios', payload);
            setresultrequest({
                success: true,
                msg: result.data.msg
            });
            tokenAuth(token);
            setTimeout(() => {
                router.push('/sign-in', publicRuntimeConfig.staticFolder + '/sign-in')
            }, 2000);
        } catch (error) {
            setresultrequest({
                success: false,
                msg: error.response.data.msg
            });
            setTimeout(() => {
                setresultrequest(null);
            }, 2000);
        }
        setisloading(false);
    }

    const islogin = async () => {
        if (token) {
            tokenAuth(token);
            try {
                const result = await clientAxios.get('/api/web/validateToken');
                debugger
                if (result.data.data.rol_name === "CONSULTOR" && !['/tracking', '/', '/dashboard', '/dashboardpickup', '/reportcontrol', '/reporttower', '/reportcontrolpickup', '/reporttowerpickup', '/reportpickup'].includes(router.pathname)) {
                    console.log('11111111');
                    router.push('/').then(() => dispatch({
                        type: AUTH_SUCCESS,
                        payload: { firstname: result.data.data.first_name, lastname: result.data.data.last_name, role_name: result.data.data.rol_name }
                    }))
                } else {
                    console.log('222222222');
                    dispatch({
                        type: AUTH_SUCCESS,
                        payload: { firstname: result.data.data.first_name, lastname: result.data.data.last_name, role_name: result.data.data.rol_name }
                    });
                }
            } catch (error) {
                dispatch({
                    type: AUTH_FAILED,
                });
                router.push('/sign-in', publicRuntimeConfig.staticFolder + '/sign-in')
            }
        } else {
            dispatch({
                type: AUTH_FAILED,
            });
            router.push('/sign-in', publicRuntimeConfig.staticFolder + '/sign-in')
        }
    }

    const signout = () => {
        dispatch({
            type: AUTH_FAILED,
        });
        router.push('/sign-in', publicRuntimeConfig.staticFolder + '/sign-in')
    };


    return (
        <authContext.Provider
            value={{
                token: state.token,
                authenticated: state.authenticated,
                user: state.user,
                loading: state.loading,
                typeuser: state.typeuser,
                tologged,
                infosys: state.infosys,
                login,
                register,
                islogin,
                changeOrg,
                signout
            }}
        > {children}
        </authContext.Provider>
    )
}

export default AuthState;
