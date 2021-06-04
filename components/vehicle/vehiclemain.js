import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import triggeraxios from '../../config/axiosv2';
import InputFormk from '../form/inputformik';
import UseSelectDomain from '../../hooks/useSelectDomain';
import SelectFunction from '../../hooks/useSelectFunction';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { validateres, getDomain } from '../../config/helper';

const requestproviders = {
    method: "SP_SEL_PROVIDERS",
    data: { status: 'ACTIVO' }
}

const VehicleMain = ({ title, openModal, setOpenModal, rowselected, fetchDataUser }) => {
    const { setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);

    const [domains, setdomains] = useState({ status: [], type: [] })

    const [dataProviders, setDataProviders] = useState([]);

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', getDomain("ESTADOGENERICO")).then(r => setdomains(p => ({ ...p, status: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', getDomain("TIPO_VEHICULO")).then(r => setdomains(p => ({ ...p, vehicle_type: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', getDomain("TIPODOCUMENTO")).then(r => setdomains(p => ({ ...p, doc_type: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', requestproviders).then(r => setDataProviders(validateres(r, continuezyx))),
            ]);

        })();
        return () => continuezyx = false;
    }, [])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            first_name: '',
            last_name: '',
            doc_number: '',
            doc_type: '',
            email: '',
            phone: '',
            vehicle_type: '',
            id_provider: 0,
            brand: '',
            model: '',
            plate_number: '',
            soat: '',
            status: 'ACTIVO'
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('El nombre es obligatorio'),
            last_name: Yup.string().required('El apellido es obligatorio'),
            doc_number: Yup.string().required('El n° de documento es obligatorio'),
            doc_type: Yup.string().required('El tipo de documento es obligatorio'),
            email: Yup.string().required('El email es obligatorio'),
            phone: Yup.string().required('El teléfono es obligatorio'),
            vehicle_type: Yup.string().required('El tipo de vehiculo es obligatorio'),
            brand: Yup.string().required('La marca es obligatorio'),
            model: Yup.string().required('El modeo es obligatorio'),
            plate_number: Yup.string().required('El n° de placa es obligatorio'),
            soat: Yup.string().required('El soat es obligatorio'),
            status: Yup.string().required('El estado es obligatorio'),
            id_provider: Yup.number().min(1),
        }),
        onSubmit: async values => {
            const callback = async () => {
                setModalQuestion({ visible: false });
                const dattosend = {
                    method: "SP_INS_VEHICLE_DRIVER",
                    header: {
                        data: {
                            id_driver: rowselected ? rowselected.id_driver : 0,
                            first_name: values.first_name,
                            last_name: values.last_name,
                            doc_number: values.doc_number,
                            doc_type: values.doc_type,
                            email: values.email,
                            phone: values.phone,
                            password: values.doc_number,
                            status: values.status,
                        }
                    },
                    details: {
                        data: [{
                            id_vehicle: rowselected ? rowselected.id_vehicle : 0,
                            vehicle_type: values.vehicle_type,
                            brand: values.brand,
                            id_provider: values.id_provider,
                            model: values.model,
                            plate_number: values.plate_number,
                            soat: values.soat,
                            status: values.status
                        }]
                    }
                }

                setOpenBackdrop(true);
                const res = await triggeraxios('post', '/api/web/main/simpleTransaction', dattosend);
                if (res.success) {
                    fetchDataUser({});
                    setOpenModal(false);

                    setOpenSnackBack(true, { success: true, message: 'Transacción ejecutada satisfactoriamente.' });
                } else {
                    setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });
                }

                setOpenBackdrop(false);
            }

            setModalQuestion({ visible: true, question: `¿Está seguro de guardar el vehiculo?`, callback })
        }
    });
    const handleClick = () => setOpenModal(false);

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
                    <DialogTitle id="alert-dialog-title">{title} - {rowselected ? "Editar" : "Registrar"}</DialogTitle>
                    <DialogContent>
                        <div className="row-zyx">

                            <InputFormk
                                name="first_name"
                                classname="col-3"
                                label="Nombre Chofer"
                                formik={formik}
                            />

                            <InputFormk
                                name="last_name"
                                classname="col-3"
                                label="Apellido Chofer"
                                formik={formik}
                            />

                            <UseSelectDomain
                                classname="col-3"
                                title="Tipo Doc"
                                domainname={domains.doc_type}
                                valueselected={formik.values.doc_type}
                                namefield="doc_type"
                                formik={formik}
                            />

                            <InputFormk
                                name="doc_number"
                                classname="col-3"
                                label="N° doc Chofer"
                                formik={formik}
                            />

                        </div>
                        <div className="row-zyx">
                            <InputFormk
                                name="email"
                                classname="col-3"
                                label="Correo Chofer"
                                formik={formik}
                            />
                            <InputFormk
                                name="phone"
                                classname="col-3"
                                label="Teléfono Chofer"
                                formik={formik}
                            />
                        </div>
                        <div className="row-zyx">
                            <UseSelectDomain
                                classname="col-3"
                                title="Tipo Vehiculo"
                                domainname={domains.vehicle_type}
                                valueselected={formik.values.vehicle_type}
                                namefield="vehicle_type"
                                formik={formik}
                            />
                            <InputFormk
                                name="brand"
                                classname="col-3"
                                label="Marca Vehiculo"
                                formik={formik}
                            />

                            <InputFormk
                                name="model"
                                classname="col-3"
                                label="Modelo Vehiculo"
                                formik={formik}
                            />
                            <InputFormk
                                name="plate_number"
                                classname="col-3"
                                label="N° Placa Vehiculo"
                                formik={formik}
                            />
                        </div>
                        <div className="row-zyx">
                            <InputFormk
                                name="soat"
                                classname="col-3"
                                label="SOAT Vehiculo"
                                formik={formik}
                            />
                            <SelectFunction
                                title="Proveedor"
                                datatosend={dataProviders}
                                classname="col-3"
                                optionvalue="id_provider"
                                optiondesc="name"
                                valueselected={formik.values.id_provider}
                                namefield="id_provider"
                                descfield="name"
                                formik={formik}
                            />
                            <UseSelectDomain
                                classname="col-3"
                                title="Estado"
                                domainname={domains.status}
                                valueselected={formik.values.status}
                                namefield="status"
                                formik={formik}
                            />
                        </div>
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
        </>
    );
}

export default VehicleMain;