import React, { useEffect, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputFormk from '../form/inputformik';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseSelectDomain from '../../hooks/useSelectDomain';
import triggeraxios from '../../config/axiosv2';
import { validateres, getDomain } from '../../config/helper';

const Organization = ({ openModal, setOpenModal, setdataorg, rowselected }) => {

    const [domains, setdomains] = useState({ status: [], type: [] })

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', getDomain("ESTADOGENERICO")).then(r => setdomains(p => ({ ...p, status: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', getDomain("TIPOORGANIZATION")).then(r => setdomains(p => ({ ...p, type: validateres(r, continuezyx) })))
            ]);

        })();
        return () => continuezyx = false;
    }, [])

    useEffect(() => {
        if (openModal) {
            formik.resetForm();
        }
    }, [openModal])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            name: '',
            description: '',
            ruc: '',
            address: '',
            status: 'ACTIVO',
            typeservices: '',
            type: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El name es obligatorio'),
            description: Yup.string().required('El descripcion es obligatorio'),
            ruc: Yup.string().required('El ruc es obligatorio'),
            address: Yup.string().required('El address es obligatorio'),
            typeservices: Yup.string().required('El typeservices es obligatorio'),
            type: Yup.string().required('El typeservices es obligatorio'),
        }),
        onSubmit: async values => {
            if (!rowselected) {
                setdataorg(prev => [...prev, { ...values, id_organization: prev.length * -1, operation: true }]);
            } else {
                setdataorg(prev => [...prev.map(o => o.id_organization === values.id_organization ? { ...values, operation: true } : o)]);
            }

            setOpenModal(false);
        }
    });
    return (
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
                <DialogTitle id="alert-dialog-title">Organización</DialogTitle>
                <DialogContent>
                    <div className="row-zyx">

                        <InputFormk
                            name="name"
                            classname="col-3"
                            label="Nombre"
                            formik={formik}
                        />
                        <InputFormk
                            name="description"
                            classname="col-3"
                            label="Descripcion"
                            formik={formik}
                        />
                        <InputFormk
                            name="ruc"
                            classname="col-3"
                            label="Ruc"
                            formik={formik}
                        />
                        <InputFormk
                            name="address"
                            classname="col-3"
                            label="Dirección"
                            formik={formik}
                        />
                    </div>
                    <div className="row-zyx">
                        <InputFormk
                            name="typeservices"
                            classname="col-3"
                            label="Tipo de Servicio"
                            formik={formik}
                        />
                        <UseSelectDomain
                            classname="col-3"
                            title="Tipo"
                            domainname={domains.type}
                            valueselected={formik.values.type}
                            namefield="type"
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
    );
}

export default Organization;