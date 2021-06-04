import React, { useReducer } from 'react';
import trackingContext from './trackingContext';
import trackingReducer from './trackingReducer';
import { useRouter } from 'next/router';
import triggeraxios from '../../config/axiosv2';

import {
    GETtracking,
    SELECTTRACKING,
    INFOSELECTTRACKING,
    MESSAGESFROMUSER,
    OPENMODALMESSAGE,
    SETMESSAGESELECTED,
    SENDMESSAGEOK,
    UPDATEATTEMPT,
    ADDGUIDE,
    SELECTGUIDE,
    REMOVEIMAGE
} from '../../types';

const trackingState = ({ children }) => {
    const router = useRouter();

    const initialState = {
        guides: [],
        id_guide: 0,
        infoguide: null,
        tracking: [],
        images: [],
        attempts: [],
        id_shipping_order: 0,
        trackingselected: []
    }

    const [state, dispatch] = useReducer(trackingReducer, initialState)

    const addguide = (guide) => {
        dispatch({
            type: ADDGUIDE,
            payload: guide
        });
    }
    const selectguide = (payload) => {
        dispatch({
            type: SELECTGUIDE,
            payload
        });
    }

    const updateattempt = (payload) => {
        dispatch({
            type: UPDATEATTEMPT,
            payload
        });
    }
    const removeimage = (payload) => {
        dispatch({
            type: REMOVEIMAGE,
            payload
        });
    }

    return (
        <trackingContext.Provider
            value={{
                guides: state.guides,
                id_guide: state.id_guide,
                infoguide: state.infoguide,
                images: state.images,
                tracking: state.tracking,
                attempts: state.attempts,
                id_shipping_order: state.id_shipping_order,
                attempt: state.attempt,
                trackingselected: state.trackingselected,
                addguide,
                removeimage,
                selectguide,
                updateattempt
            }}
        > {children}
        </trackingContext.Provider>
    )
}

export default trackingState;