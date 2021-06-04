import {
    MANAGESNACKBAR,
    MANAGEBACKDROP,
    LOADGLOBAL,
    MANAGEQUESTION,
    SETOPENDRAWER,
    LIGHTBOXCAROUSEL
} from '../../types';

export default (state, action) => {
    switch (action.type) {
        case LOADGLOBAL:
            return {
                ...state,
                loading: action.payload
            }
        case MANAGESNACKBAR:
            return {
                ...state,
                openSnackbar: action.payload.status,
                auxiliarSnackbar: action.payload.auxiliarSnackbar
            }
        case MANAGEBACKDROP:
            return {
                ...state,
                openBackdrop: action.payload
            }
        case MANAGEQUESTION:
            return {
                ...state,
                modalquestion: action.payload
            }
        case SETOPENDRAWER:
            return {
                ...state,
                openDrawer: action.payload
            }
        case LIGHTBOXCAROUSEL:
            return {
                ...state,
                ligthBox: action.payload
            }
        default:
            return state;
    }
}