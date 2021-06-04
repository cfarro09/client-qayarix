import React, { useReducer } from 'react';
import PopUpsContext from './pop-upsContext';
import popUpsReducer from './pop-upsReducer';
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

import {
    MANAGEBACKDROP,
    MANAGESNACKBAR,
    LOADGLOBAL,
    MANAGEQUESTION,
    SETOPENDRAWER,
    LIGHTBOXCAROUSEL
} from '../../types';

const PopUpsState = ({ children }) => {

    const initialState = {
        auxiliarSnackbar: {
            success: false,
            message: ''
        },
        modalquestion: {
            visible: false,
            question: '',
            callback: null,
            callbackcancel: null
        },
        loading: false,
        openSnackbar: false,
        openBackdrop: false,
        openDrawer: true,
        ligthBox: {
            open: false,
            index: 0,
            images: []
        }
    }

    const [state, dispatch] = useReducer(popUpsReducer, initialState)
    
    const setLightBox = value => {
        dispatch({
            type: LIGHTBOXCAROUSEL,   
            payload: value
        });
    }

    const setloadingglobal = value => {
        dispatch({
            type: LOADGLOBAL,   
            payload: value
        });
    }
    
    const setOpenDrawer = payload => {
        dispatch({
            type: SETOPENDRAWER,
            payload
        });
    }
    
    const setModalQuestion = value => {
        dispatch({
            type: MANAGEQUESTION,
            payload: value
        });
    }

    const setOpenSnackBack = (status, auxiliarSnackbar) => {
        dispatch({
            type: MANAGESNACKBAR,
            payload: {
                status,
                auxiliarSnackbar
            }
        });
    }

    const setOpenBackdrop = (status) => {
        dispatch({
            type: MANAGEBACKDROP,
            payload: status
        });
    }
    
    return (
        <PopUpsContext.Provider
            value={{
                openSnackbar: state.openSnackbar,
                auxiliarSnackbar: state.auxiliarSnackbar,
                successSnackbar: state.successSnackbar,
                openBackdrop: state.openBackdrop,
                loading: state.loading,
                modalquestion: state.modalquestion,
                openDrawer: state.openDrawer,
                ligthBox: state.ligthBox,
                setOpenSnackBack,
                setOpenBackdrop,
                setloadingglobal,
                setModalQuestion,
                setOpenDrawer,
                setLightBox
            }}
        > {children}
        </PopUpsContext.Provider>
    )
}

export default PopUpsState;