import {
    SELECTGUIDE,
    ADDGUIDE,
    UPDATEATTEMPT,
    REMOVEIMAGE
} from '../../types';

export default (state, action) => {
    switch (action.type) {
        case ADDGUIDE:
            return {
                ...state,
                guides: [...action.payload, ...state.guides]
            }
        case SELECTGUIDE:
            return {
                ...state,
                id_guide: action.payload.id_guide,
                infoguide: action.payload.infoguide,
                images: action.payload.images,
                tracking: action.payload.tracking,
                attempts: action.payload.attempts,
                id_shipping_order: action.payload.id_shipping_order,
                attempt: action.payload.attempt,
                trackingselected: action.payload.trackingselected,
            }
        case UPDATEATTEMPT:
            return {
                ...state,
                attempt: action.payload.attempt,
                id_shipping_order: action.payload.id_shipping_order,
                trackingselected: state.tracking.filter(x => x.attempt == action.payload.attempt)
            }
        case REMOVEIMAGE:
            return {
                ...state,
                images: state.images.filter(x => x.url !== action.payload.url )
            }

        default:
            return state;
    }
}