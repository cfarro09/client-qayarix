import React, { useEffect, useState, useContext } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputFormk from '../form/inputformik';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import assignmentContext from '../../context/assignment/assignmentContext';
import {updatecoordinates} from './mapassignment';

const Coordinates = ({ openModal, setOpenModal, rowselected }) => {
    const { setModalQuestion, setOpenSnackBack, setOpenBackdrop } = useContext(popupsContext);
    const { updateGuide } = useContext(assignmentContext);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected,
        validationSchema: Yup.object({
            latitude: Yup.string().required("La latitud debe ser un decimal"),
            longitude: Yup.string().required("La longitude debe ser un decimal"),

        }),
        onSubmit: async values => {
            const callback = async () => {
                
                const error = ''; //await updatecoordinates(values.id_guide, values.latitude, values.longitude);
                if (error)
                    setOpenSnackBack(true, { success: false, message: error });
                else { 
                    setOpenSnackBack(true, { success: true, message: 'Guia actualizada satisfactoriamente.' });
                    setOpenModal(false);
                    updateGuide(values);
                }
                setModalQuestion({ visible: false })
                setOpenBackdrop(false);
            }
            setModalQuestion({ visible: true, question: `¿Está seguro de actualizar las coordenadas?`, callback })
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
                <DialogTitle id="alert-dialog-title">Editar Coordenadas</DialogTitle>
                <DialogContent>
                    <div className="row-zyx">

                        <InputFormk
                            name="address"
                            classname=""
                            label="Dirección"
                            disabled={true}
                            formik={formik}
                        />
                    </div>
                    <div className="row-zyx">
                        <InputFormk
                            name="latitude"
                            classname="col-6"
                            type="number"
                            label="Latitud"
                            formik={formik}
                        />
                        <InputFormk
                            name="longitude"
                            classname="col-6"
                            type="number"
                            label="Longitud"
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

export default Coordinates;