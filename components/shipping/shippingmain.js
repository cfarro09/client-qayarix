import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import { useFormik } from 'formik';
import TableZyx from '../../hooks/useTableCRUD2';
import triggeraxios from '../../config/axiosv2';

import {
    Delete as DeleteIcon,
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import AddGuide from './selectguide';
import SelectVehicle from './selectvehicles';

const ShippingModal = ({ title, openModal, setOpenModal, rowselected, fetchData, typeofi }) => {
    const { setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);

    const [openModalAddGuide, setOpenModalAddGuide] = useState(false);
    const [openModalDriver, setOpenModalDriver] = useState(false);
    const [datashippingdetail, setdatashippingdetail] = useState([]);

    const [driver, setdriver] = useState(null)

    const columnsDetail = [
        {
            Header: 'CLIENTE',
            accessor: 'client_name'
        },
        {
            Header: 'COD BARRAS CLIENTE',
            accessor: 'client_barcode'
        },
        {
            Header: 'DNI CLIENTE',
            accessor: 'client_dni'
        },
        {
            Header: 'COD SEGUIMIENTO',
            accessor: 'seg_code'
        },
        {
            Header: 'ESTADO',
            accessor: 'status'
        },
        {
            Header: '',
            accessor: 'type',
            isComponent: true,
            Cell: props => {
                if (["ACEPTADO", "PENDIENTE"].includes(rowselected?.status))
                    return (
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => deleterow(props.cell.row.original)}
                        >
                            <DeleteIcon
                                fontSize="inherit"
                                size="small"
                                color="secondary"
                            />
                        </IconButton>
                    )
                else
                    return null;
            }
        },
    ]

    useEffect(() => {
        let continuezyx = true;

        if (openModal) {
            formik.resetForm();
            setdatashippingdetail([]);
            setdriver({ drivername: rowselected.drivername, plate_number: rowselected.plate_number });
            (async () => {
                if (rowselected) {
                    const datashippingdetail = {
                        method: "SP_SEL_SHIPPING_DETAIL",
                        data: {
                            id_shipping_order: rowselected.id_shipping_order,
                        }
                    }
                    const res = await triggeraxios('post', '/api/web/main/', datashippingdetail);
                    if (res.success && continuezyx) {
                        setdatashippingdetail(res.result.data);
                    }
                }
            })();

        }
        return () => continuezyx = false;
    }, [openModal])

    const addguide = () => {
        setOpenModalAddGuide(true);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected,
        onSubmit: values => {
            
            const datatomanage = datashippingdetail.filter(x => !!x.operation);
            if (datatomanage.length === 0 && !driver.id_driver) {
                setOpenSnackBack(true, { success: false, message: 'No ha hecho ningun cambio para que guarde' });
            } else {
                const callback = async () => {

                    setModalQuestion({ visible: false });
                    if (datatomanage.length !== 0) {
                        const requestdata = {
                            method: 'SP_UPDATE_SHIPPING_ORDER',
                            header: {
                                data: {}
                            },
                            details: {
                                data: datatomanage.map(x => (
                                    {
                                        id_shipping_order: rowselected.id_shipping_order,
                                        id_shipping_order_detail: x.operation === "ELIMINAR" ? x.id_shipping_order_detail : null,
                                        id_guide: x.operation === "ASIGNAR" ? x.id_guide : null,
                                        operation: x.operation
                                    }
                                ))
                            }
                        }
                        setOpenBackdrop(true);
                        const res = await triggeraxios('post', '/api/web/main/simpleTransaction', requestdata);
                        if (res.success) {
                            fetchData({});
                            setOpenModal(false);

                            setOpenSnackBack(true, { success: true, message: 'Transacción ejecutada satisfactoriamente.' });
                        } else {
                            setOpenSnackBack(true, { success: false, message: res.msg });
                        }
                    } 
                    if (driver.id_driver) {
                        const requesttosend = {
                            method: "SP_REASIGNAR_ENVIO",
                            data: {
                                id_driver: driver.id_driver,
                                id_vehicle: driver.id_vehicle,
                                id_shipping_order: rowselected.id_shipping_order
                            }
                        }
                        setOpenBackdrop(true);
                        const res = await triggeraxios('post', '/api/web/main', requesttosend);
                        if (res.success) {
                            fetchData({});
                            setOpenModal(false);

                            setOpenSnackBack(true, { success: true, message: 'Conductor Actualizado' });
                        } else {
                            setOpenSnackBack(true, { success: false, message: res.msg });
                        }
                    }

                    setOpenBackdrop(false);
                }

                setModalQuestion({ visible: true, question: `¿Está seguro de actualizar las guias del envío?`, callback })
            }
        }
    });

    const handleClick = () => setOpenModal(false);

    const deleterow = (row) => {
        const callback = () => {
            setdatashippingdetail(prev => [...prev.map(o => o.id_guide === row.id_guide ? { ...row, status: 'ELIMINADO', deleted: true, operation: (row.operation ? '' : 'ELIMINAR') } : o)]);
            setModalQuestion({ visible: false })
        }

        setModalQuestion({ visible: true, question: `¿Está seguro de eliminar el registro?`, callback })
    }

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth={true}
                maxWidth='md'
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    <DialogContent>
                        <TableZyx
                            columns={columnsDetail}
                            HeadComponent={() =>
                                <div style={{ width: '100%' }}>
                                    {rowselected?.status === "PENDIENTE" && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                variant="contained"
                                                style={{ marginLeft: '4px', width: 'auto', maxHeight: '40px' }}
                                                onClick={() => setOpenModalDriver(true)}
                                            >
                                                SELECCIONAR NUEVO CONDUCTOR
                                            </Button>
                                        </div>
                                    )}
                                    <div className="row-zyx">
                                        <InputFormk
                                            name="id_shipping_order"
                                            classname="col-3"
                                            label="ID"
                                            formik={formik}
                                            disabled={true}
                                        />
                                        <InputFormk
                                            name="provider_name"
                                            classname="col-3"
                                            label="Proveedor"
                                            formik={formik}
                                            disabled={true}
                                        />
                                        <InputFormk
                                            name="N° Placa"
                                            classname="col-3"
                                            label="Nombre Conductor"
                                            valuedefault={driver.drivername}
                                            // formik={formik}
                                            disabled={true}
                                        />
                                        <InputFormk
                                            name="plate_number"
                                            classname="col-3"
                                            label="N° Placa"
                                            valuedefault={driver.plate_number}
                                            // formik={formik}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="row-zyx">
                                        <InputFormk
                                            name="number_guides"
                                            classname="col-3"
                                            label="N° Guias"
                                            formik={formik}
                                            disabled={true}
                                        />
                                        <InputFormk
                                            name="status"
                                            classname="col-3"
                                            label="Estado"
                                            formik={formik}
                                            disabled={true}
                                        />
                                        <InputFormk
                                            name="date_created"
                                            classname="col-3"
                                            label="Fecha registro"
                                            formik={formik}
                                            disabled={true}
                                        />
                                        <InputFormk
                                            name="created_by"
                                            classname="col-3"
                                            label="Registrado por"
                                            formik={formik}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            }
                            titlemodule='Detalle del Envío'
                            data={datashippingdetail.filter(x => !x.deleted)}
                            register={["ACEPTADO", "PENDIENTE"].includes(rowselected?.status)}
                            selectrow={addguide}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            color="primary"
                        >
                            GUARDAR
                        </Button>
                        <Button
                            type="button"
                            color="secondary"
                            style={{ marginLeft: '1rem' }}
                            onClick={() => setOpenModal(false)}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <AddGuide
                openModal={openModalAddGuide}
                setOpenModal={setOpenModalAddGuide}
                datatable={datashippingdetail}
                setdatatable={setdatashippingdetail}
                type={typeofi}
            />
            <SelectVehicle
                openModal={openModalDriver}
                setOpenModal={setOpenModalDriver}
                title="Seleccionar vehiculo"
                setdriver={setdriver}
            />
        </>
    );
}

export default ShippingModal;