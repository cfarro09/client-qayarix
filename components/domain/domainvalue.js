import React, { useEffect, useCallback, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputFormk from '../form/inputformik';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectDomain from '../../hooks/useSelectDomain';

const Organization = ({ openModal, setOpenModal, setdatadomainvalues, rowselected }) => {

    useEffect(() => {
        if (openModal) {
            formik.resetForm();
        }
    }, [openModal])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            domain_value: '',
            domain_description: '',
            status: 'ACTIVO',
        },
        validationSchema: Yup.object({
            domain_value: Yup.string().required('El valor es obligatorio'),
            domain_description: Yup.string().required('La descripcion es obligatorio'),
            status: Yup.string().required('La descripcion es obligatorio'),
        }),
        onSubmit: async values => {
            if (!rowselected) {
                setdatadomainvalues(prev => [...prev, { ...values, id_domain: prev.length * -1, operation: true }]);
            } else {
                setdatadomainvalues(prev => [...prev.map(o => o.id_domain === values.id_domain ? { ...values, operation: true } : o)]);
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
                <DialogTitle id="alert-dialog-title">Dominio Valor</DialogTitle>
                <DialogContent>
                    <div className="row-zyx">

                        <InputFormk
                            name="domain_value"
                            classname="col-3"
                            label="Valor"
                            formik={formik}
                        />
                        <InputFormk
                            name="domain_description"
                            classname="col-3"
                            label="Descripcion"
                            formik={formik}
                        />
                        <SelectDomain
                            classname="col-3"
                            title="Estado"
                            domainname="ESTADOGENERICO"
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