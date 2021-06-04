import React, { useContext, useState } from 'react';
import assignmentContext from '../../context/assignment/assignmentContext';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import GoogleMapReact from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import SwitchZyx from '../../hooks/useSwitch'
import triggeraxios from '../../config/axiosv2';
import CheckBox from '../../hooks/useCheckBox'
import { LocationOn, Person, CropFree } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    hovermarker: {
        width: 18,
        height: 36,
        transform: '.3s',
        cursor: 'pointer'
    },
    marker: {
        width: 16,
        height: 32
    },
    square: {
        width: '15px',
        height: '15px',
        marginRight: '5px'
    },
    containerSquare: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '5px'
    },
    infowindow: {
        backgroundColor: '#e1e1e1',
        width: '200px',
        transform: 'translate(-50%, -32px)',
        borderRadius: '10px',
        zIndex: '2',
        position: 'relative',
        border: "1px solid #c3c3c3",
        padding: '4px',
        '&::after, &::before': {
            bottom: '100%',
            left: '50%',
            border: 'solid transparent',
            content: "",
            height: 0,
            width: 0,
            position: 'absolute',
            pointerEvents: 'none',
        },
        '&::after': {
            content: "''",
            borderColor: 'rgba(136, 183, 213, 0)',
            borderBottomColor: '#e1e1e1',
            borderWidth: '5px',
            marginLeft: '-5px',
        },
        '&::before': {
            content: "''",
            borderColor: 'rgba(194, 225, 245, 0)',
            borderBottomColor: '#c3c3c3',
            borderWidth: '6px',
            marginLeft: '-6px',
        }

    },
    rowinfo: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export const updatecoordinates = async (id_guide, latitude, longitude) => {
    const res = await triggeraxios('post', '/api/web/main/', { method: "SP_UPDATE_ADDRESS", data: { id_guide, latitude, longitude } });
    if (res.success)
        return null;
    else
        return "Hubo un error, vuelva a intentarlo."

}

const AnyReactComponent = ({ $hover, item, selectMarker, hoverselected, dataVisible }) => {
    const classes = useStyles();
    const color = item.selected ? "#46b931" : ((item.status === "NO ENTREGADO" || item.status === "NO RECOLECTADO") ? "#993675" : "#d53");

    if (hoverselected && $hover && !item.selected) {
        const moremarkers = dataVisible.filter(x => x.latitude === item.latitude && x.longitude === item.longitude)
        moremarkers.forEach(x => {
            selectMarker({ ...x, selected: true })
        });
    }

    return (
        <>
            <svg
                className={clsx({
                    [classes.hovermarker]: $hover,
                    [classes.marker]: !$hover,
                })} viewBox="-16 0 32 32"
                style={{
                    transform: 'translate(-50%, -90%)',
                }}
            >
                <path fill={color}
                    d="M0,47 Q0,28 10,15 A15,15 0,1,0 -10,15 Q0,28 0,47" />
                <circle cx="0" cy="4" r="5" fill={item.selected ? "#157104" : "#811411"} stroke="none" />
            </svg >

            {$hover && (
                <div className={classes.infowindow}>
                    <div className={classes.rowinfo}><Person color="secondary" fontSize="small" style={{ marginRight: '5px' }} /> {item.client_name}</div>
                    <div className={classes.rowinfo}><LocationOn color="secondary" fontSize="small" style={{ marginRight: '5px' }} /> {item.address}</div>
                    <div className={classes.rowinfo}><CropFree color="secondary" fontSize="small" style={{ marginRight: '5px' }} />{item.client_barcode}</div>
                </div>
            )}
        </>
    )
}

const MapAssignment = () => {
    const classes = useStyles();
    const { dataVisible, selectMarker, filterdistrict, checkFilterDistrict, quadrantselected, quadrantguides } = useContext(assignmentContext);
    const { setModalQuestion, setOpenSnackBack, setOpenBackdrop } = useContext(popupsContext);

    const [draggable, setdraggable] = useState(true);

    const [hoverselected, sethoverselected] = useState(false);

    const [flagdraggable, setflagdraggable] = useState(false);


    const onCircleInteraction = (_, { item }, { lat, lng }) => {
        if (!flagdraggable)
            return
        setdraggable(false)
        selectMarker({ ...item, newlatitude: lat, newlongitude: lng });
    }

    const onCircleInteraction3 = (_, { item }, { lat, lng }) => {
        if (!flagdraggable)
            return
        setdraggable(true);
        const ii = dataVisible.find(x => x.id_guide === item.id_guide);

        if (ii.newlatitude !== ii.latitude || ii.newlongitude !== ii.longitude) {
            const callback = async () => {
                setOpenBackdrop(true);
                const error = await updatecoordinates(ii.id_guide, ii.newlatitude, ii.newlongitude);
                if (error)
                    setOpenSnackBack(true, { success: false, message: error });
                else {
                    setOpenSnackBack(true, { success: true, message: 'Marcador actualizado satisfactoriamente.' });
                }
                setModalQuestion({ visible: false })
                setOpenBackdrop(false);
            }
            const callbackcancel = () => {
                selectMarker({ ...ii, newlatitude: ii.latitude, newlongitude: ii.longitude })
            }
            setModalQuestion({ visible: true, question: `¿Está seguro de actualizar el marker?`, callback, callbackcancel });
        }
    }

    const _onChildClick = (_, { item }) => {
        if (!quadrantselected) {
            setOpenSnackBack(true, { success: false, message: 'Tiene que seleccionar un cuadrante para asignar la guia.' });
            return;
        }

        const moremarkers = dataVisible.filter(x => x.latitude === item.latitude && x.longitude === item.longitude)
        const ii = dataVisible.find(x => x.id_guide === item.id_guide);

        if (moremarkers.length > 1) {
            const callback = async () => {
                moremarkers.forEach(x => {
                    selectMarker({ ...x, selected: !x.selected })
                });
                setModalQuestion({ visible: false });
            }
            const callbackcancel = () => {
                selectMarker({ ...ii, selected: !ii.selected })
            }
            const verb = !ii.selected ? "seleccionar" : "deseleccionar";
            setModalQuestion({ visible: true, question: `En la misma ubicación se encuentran ${moremarkers.length} marcadores. Si desea ${verb} todos los marcadores, de click en "seguir" si solo desea uno en "cancelar".`, callback, callbackcancel });
        } else {
            selectMarker({ ...ii, selected: !ii.selected })
        }
    }

    const callbackSwitch = (cheked) => setflagdraggable(cheked)

    return (
        <>
            <div style={{ height: '450px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyALAoyRt0XI5-tRR7b9J11j9y8VIoemyUw" }}
                    defaultCenter={{
                        lat: -12.1089003,
                        lng: -77.0410536
                    }}
                    onChildClick={_onChildClick}
                    draggable={draggable}
                    defaultZoom={11}
                    onChildMouseDown={onCircleInteraction}
                    onChildMouseUp={onCircleInteraction3}
                    onChildMouseMove={onCircleInteraction}
                >
                    {dataVisible.map(item =>
                        <AnyReactComponent
                            item={item}
                            key={item.id_guide}
                            selectMarker={selectMarker}
                            hoverselected={hoverselected}
                            dataVisible={dataVisible}
                            setModalQuestion={setModalQuestion}
                            lat={item.newlatitude}
                            lng={item.newlongitude}
                        />
                    )}
                </GoogleMapReact>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                    <div className={classes.containerSquare}>
                        <div className={classes.square} style={{ backgroundColor: '#46b931' }}></div>
                        <span>SELECCIONADO</span>
                    </div>
                    <div className={classes.containerSquare}>
                        <div className={classes.square} style={{ backgroundColor: '#993675' }}></div>
                        <span>NO ENTREGADO</span>
                        <CheckBox
                            valueselected={true}
                            callback={(checked) => {
                                if (checked)
                                    checkFilterDistrict([...filterdistrict, 'NO ENTREGADO']);
                                else
                                    checkFilterDistrict(filterdistrict.filter(x => x !== 'NO ENTREGADO'));
                            }}
                        />
                    </div>
                    <div className={classes.containerSquare}>
                        <div className={classes.square} style={{ backgroundColor: '#993675' }}></div>
                        <span>NO RECOLECTADO</span>
                        <CheckBox
                            valueselected={true}
                            callback={(checked) => {
                                if (checked)
                                    checkFilterDistrict([...filterdistrict, 'NO RECOLECTADO']);
                                else
                                    checkFilterDistrict(filterdistrict.filter(x => x !== 'NO RECOLECTADO'));
                            }}
                        />
                    </div>
                    <div className={classes.containerSquare}>
                        <div className={classes.square} style={{ backgroundColor: '#d53' }}></div>
                        <span>PENDIENTE</span>
                        <CheckBox
                            valueselected={true}
                            callback={(checked) => {
                                if (checked)
                                    checkFilterDistrict([...filterdistrict, 'PENDIENTE']);
                                else
                                    checkFilterDistrict(filterdistrict.filter(x => x !== 'PENDIENTE'));
                            }}
                        />
                    </div>
                </div>
                <div>
                    <SwitchZyx
                        title="Seleccionar x hover"
                        valueselected={false}
                        disabled={!quadrantselected}
                        callback={(cheked) => sethoverselected(cheked)}
                    />
                    <SwitchZyx
                        title="Mover Markers"
                        valueselected={false}
                        callback={callbackSwitch}
                    />
                </div>
            </div>
        </>
    );
}

export default MapAssignment;