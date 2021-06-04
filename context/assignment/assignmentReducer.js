import {
    ITEMDISTRICTS,
    SETDISTRICTS,
    SETDATA,
    CLEANASSIGNED,
    SELECTMARKER,
    ADDMARKERVISIBLE,
    CHANGESTEP,
    DATAQUADRANT,
    SELECTQUADRANT,
    QUADRANTGUIDES,
    SELECTMARKERGLOBAL,
    VEHICLESELECTED,
    CHECKFILTERDISTRICT
} from '../../types';

export default (state, action) => {
    switch (action.type) {
        case SETDATA:
            return {
                ...state,
                dataAssignment: action.payload.dataassignments,
                dataWithoutCoordinates: action.payload.dataWithoutCoordinates
            }
        case SETDISTRICTS:
            return {
                ...state,
                dataDistritcs: action.payload
            }
        case ITEMDISTRICTS:
            const newdatadistrict = state.dataDistritcs.map(i => i.district === action.payload.district ? action.payload : i);
            const districtselected = newdatadistrict.filter(x => !!x.selected);
            return {
                ...state,
                firstdistrict: districtselected.length === 1 ? districtselected[0].district : state.firstdistrict,
                dataDistritcs: newdatadistrict,
                dataVisible: action.payload.selected ? state.dataVisible.concat(state.dataAssignment.filter(i => i.district === action.payload.district && state.filterdistrict.includes(i.status) && (state.dataVisible.length === 0 || state.dataVisible.some(x => x.id_guide !== i.id_guide)))) : state.dataVisible.filter(i => i.district !== action.payload.district && !state.filterdistrict.includes(i.status))
            }
        case SELECTMARKERGLOBAL:
            const newdatavisible = state.dataVisible.map(x => ({ ...x, selected: true }));
            return {
                ...state,
                quadrantguides: { [state.quadrantselected]: newdatavisible },
                dataVisible: newdatavisible
            }
        case SELECTMARKER:
            const auxquadrantguides = { ...state.quadrantguides };
            if (action.payload.selected && !auxquadrantguides[state.quadrantselected]) {
                auxquadrantguides[state.quadrantselected] = [action.payload];
            } else if (!action.payload.selected) {
                if (auxquadrantguides[state.quadrantselected])
                    auxquadrantguides[state.quadrantselected] = auxquadrantguides[state.quadrantselected].filter(x => x.id_guide !== action.payload.id_guide);
                else {
                    for (const [idquadrant, guides] of Object.entries(auxquadrantguides)) {
                        auxquadrantguides[idquadrant] = guides.filter(x => x.id_guide !== action.payload.id_guide)
                    }
                }
            } else {
                auxquadrantguides[state.quadrantselected] = [...auxquadrantguides[state.quadrantselected], action.payload]
            }
            return {
                ...state,
                quadrantguides: auxquadrantguides,
                dataVisible: state.dataVisible.find(x => x.id_guide === action.payload.id_guide) ? state.dataVisible.map(x => x.id_guide === action.payload.id_guide ? action.payload : x) : [...state.dataVisible, action.payload]
            }
        case CHANGESTEP:
            return {
                ...state,
                activeStep: state.activeStep + action.payload
            }
        case ADDMARKERVISIBLE:
            return {
                ...state,
                dataVisible: [...state.dataVisible, action.payload]
            }
        case VEHICLESELECTED:
            return {
                ...state,
                vehicleSelected: action.payload
            }
        case DATAQUADRANT:
            return {
                ...state,
                dataquadrant: action.payload,
                quadrantselected: ''
            }
        case QUADRANTGUIDES:
            return {
                ...state,
                quadrantguidesvehicles: action.payload
            }
        case SELECTQUADRANT:
            return {
                ...state,
                quadrantselected: action.payload
            }
        case CHECKFILTERDISTRICT:
            return {
                ...state,
                filterdistrict: action.payload
            }
        case CLEANASSIGNED:
            return {
                ...state,
                quadrantguides: {},
                vehicleSelected: null,
                dataVisible: [],
                dataAssignment: [],
                dataDistritcs: [],
                activeStep: 0
            }
        default:
            return state;
    }
}