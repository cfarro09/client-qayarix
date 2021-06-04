import React, { useReducer, useContext } from 'react';
import assignmentContext from './assignmentContext';
import assignmentReducer from './assignmentReducer';
import { useRouter } from 'next/router';
import triggeraxios from '../../config/axiosv2';
import popupsContext from '../../context/pop-ups/pop-upsContext';

import {
    SETDATA,
    SETDISTRICTS,
    ITEMDISTRICTS,
    CHANGESTEP,
    SELECTMARKER,
    ADDMARKERVISIBLE,
    VEHICLESELECTED,
    CLEANASSIGNED,
    DATAQUADRANT,
    SELECTQUADRANT,
    QUADRANTGUIDES,
    SELECTMARKERGLOBAL,
    CHECKFILTERDISTRICT
} from '../../types';
import { fitBounds } from 'google-map-react';

const datatosend = (type) => ({
    method: "SP_SEL_GUIDES",
    data: { type}
})

const requestdata = client_barcode => (
    {
        method: "SP_SEL_GUIDE_BY_BARCODE",
        data: {
            client_barcode
        }
    }
)

const AssignmentState = ({ children, type }) => {
    // const router = useRouter();
    const { setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);

    const initialState = {
        dataAssignment: [],
        dataDistritcs: [],
        dataVisible: [],
        dataWithoutCoordinates: [],
        activeStep: 0,
        vehicleSelected: null,
        firstdistrict: '',
        dataquadrant: [],
        quadrantguides: {},
        quadrantguidesvehicles: [],
        quadrantselected: '',
        filterdistrict: ['PENDIENTE', 'NO ENTREGADO'],
        type
    }

    const [state, dispatch] = useReducer(assignmentReducer, initialState)

    const updateGuide = (guide) => {
        const newdataassignments = [...state.dataAssignment, { ...guide, selected: false, newlatitude: guide.latitude, newlongitude: guide.longitude }];
        dispatch({
            type: SETDATA,
            payload: {
                dataassignments: newdataassignments,
                dataWithoutCoordinates: state.dataWithoutCoordinates.filter(x => x.id_guide !== guide.id_guide)
            }
        });
        const founddistrict = state.dataDistritcs.some(x => x.district === guide.district);
        const newdatadistrict = founddistrict ? state.dataDistritcs.map(x => x.district === guide.district ? ({ ...x, count: x.count + 1 }) : x) : [...state.dataDistritcs, { district: guide.district, selected: false, count: 1 }]
        setDataDistricts(newdatadistrict.sort((a, b) => {
            if (a.district < b.district) return -1
            if (a.district > b.district) return 1
            return 0;
        }));
    }

    const setDistrictHardcore = (dataguides, filtercheck) => {
        const keyrepeated = "district";
        const rr = dataguides.filter(x => filtercheck.includes(x.status)).reduce((repeated, item) => {
            if (repeated[item[keyrepeated]]) {
                repeated[item[keyrepeated]]++;
            } else {
                repeated[item[keyrepeated]] = 1;
            }
            return repeated;
        }, {});

        setDataDistricts(Object.entries(rr).map(([district, count]) => ({
            district,
            count,
            description: `${district} (${count})`,
            selected: false
        })).sort((a, b) => {
            if (a.district < b.district) return -1
            if (a.district > b.district) return 1
            return 0;
        }))
    }

    const setDataAssignment = async () => {
        const res = await triggeraxios('post', '/api/web/main/', datatosend(state.type));
        if (res.success) {
            const datawithcoordinates = res.result.data//.filter(x => !!x.latitude && !!x.longitude);
            const dataWithoutCoordinates = res.result.data.filter(x => !x.latitude || !x.longitude);

            const dataassignments = res.result.data.map(i => ({ ...i, selected: false, newlatitude: i.latitude, newlongitude: i.longitude }));

            dispatch({
                type: SETDATA,
                payload: { dataassignments, dataWithoutCoordinates }
            });

            setDistrictHardcore(datawithcoordinates, ['PENDIENTE', 'NO ENTREGADO', 'NO RECOLECTADO', 'RECOLECCION PARCIAL']);
        }
    };

    const setQuadrants = (payload) => {
        dispatch({
            type: DATAQUADRANT,
            payload
        });
    }

    const checkFilterDistrict = (payload) => {
        setDistrictHardcore(state.dataAssignment, payload);
        dispatch({
            type: CHECKFILTERDISTRICT,
            payload
        });
    }
    const selectQuadrant = (payload) => {
        dispatch({
            type: SELECTQUADRANT,
            payload
        });
    }

    const setDataDistricts = (payload) => {
        dispatch({
            type: SETDISTRICTS,
            payload
        });
    };

    const updateDistrictsSelected = (payload) => {
        dispatch({
            type: ITEMDISTRICTS,
            payload
        });
    };

    const selectMarker = (payload) => {
        dispatch({
            type: SELECTMARKER,
            payload
        });
    };

    const selectMarkerGlobal = (payload) => {
        dispatch({
            type: SELECTMARKERGLOBAL,
            payload
        });
    };

    const setQuadrantVehicle = (payload) => {
        dispatch({
            type: QUADRANTGUIDES,
            payload
        });
    };

    const changeStep = (payload) => {
        if (state.activeStep === 2 && payload > 0) {
            const callback = async () => {
                setModalQuestion({ visible: false });
                setOpenBackdrop(true);
                const results = [];
                for (let i = 0; i < state.quadrantguidesvehicles.length; i++) {
                    const quadrant = state.quadrantguidesvehicles[i];
                    const ids = quadrant.guides.map(x => x.id_guide);
                    debugger
                    const datatosend = {
                        method: "SP_CREATE_SHIPPING_ORDER",
                        data: {
                            quadrant_name: quadrant.idquadrant.replace("_", ""),
                            id_vehicle: quadrant.id_vehicle,
                            id_driver: quadrant.id_driver,
                            guide_ids: JSON.stringify(ids),
                            type: quadrant.guides[0].type
                        }
                    }
                    debugger
                    const res = await triggeraxios('post', '/api/web/main/', datatosend).then(r => r);
                    results.push({
                        success: res.success,
                        msg: res.success ? `El cuadrante ${quadrant.idquadrant} se generó satisfactoriamente.` : `El cuadrante ${quadrant.idquadrant} no se guardó debido que ${res.msg}.`
                    })

                }
                if (results.every(x => !!x.success))
                    setOpenSnackBack(true, { success: true, message: 'Envíos registrados satisfactoriamente.' });
                else
                    setOpenSnackBack(true, { success: false, message: results.map(x => x.msg + "\n") });

                dispatch({
                    type: CLEANASSIGNED,
                    payload
                });
                setDataAssignment();
                setOpenBackdrop(false);
            }

            setModalQuestion({ visible: true, question: `¿Está seguro de finalizar la asignación?`, callback })
        } else {
            dispatch({
                type: CHANGESTEP,
                payload
            });
        }
    };

    const setVehicle = (payload) => {
        dispatch({
            type: VEHICLESELECTED,
            payload
        });
    };

    const selectBarCode = async ({ client_barcode, filterby }) => {
        client_barcode = client_barcode.trim();

        const foundrepeated = state.dataVisible.filter(x => x[filterby] === client_barcode && !!x.selected);

        if (foundrepeated.length > 0)
            return 'El codigo filtrado ya fue SELECCIONADO.';

        const found = state.dataAssignment.filter(x => x[filterby] === client_barcode);

        if (found.length === 0) {
            if (client_barcode.length === 15) {
                const res = await triggeraxios('post', '/api/web/main/', requestdata(client_barcode));

                if (res.success) {
                    if (res.result.data && res.result.data.length > 0)
                        return `El codigo filtrado se encuenta en estado ${res.result.data[0].last_status}.`;
                }
            }
            return 'El codigo filtrado que se insertó no existe';
        }
        found.forEach(y => {
            y.selected = true;
            dispatch({
                type: SELECTMARKER,
                payload: y
            });
        });
    };

    return (
        <assignmentContext.Provider
            value={{
                dataAssignment: state.dataAssignment,
                dataDistritcs: state.dataDistritcs,
                dataVisible: state.dataVisible,
                markersSelected: state.markersSelected,
                activeStep: state.activeStep,
                vehicleSelected: state.vehicleSelected,
                dataWithoutCoordinates: state.dataWithoutCoordinates,
                firstdistrict: state.firstdistrict,
                dataquadrant: state.dataquadrant,
                quadrantselected: state.quadrantselected,
                quadrantguides: state.quadrantguides,
                quadrantguidesvehicles: state.quadrantguidesvehicles,
                filterdistrict: state.filterdistrict,
                setDataAssignment,
                selectQuadrant,
                setDataDistricts,
                updateDistrictsSelected,
                selectMarker,
                selectBarCode,
                changeStep,
                setVehicle,
                updateGuide,
                setQuadrants,
                setQuadrantVehicle,
                selectMarkerGlobal,
                checkFilterDistrict
            }}
        > {children}
        </assignmentContext.Provider>
    )
}

export default AssignmentState;
