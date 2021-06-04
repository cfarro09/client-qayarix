import React, { useState, useContext, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import trackingContext from '../../context/tracking/trackingContext';
import popupsContext from '../../context/pop-ups/pop-upsContext';

import * as Yup from 'yup';
import { useFormik } from 'formik';

const ModalMessage = () => {
    const { openModalMessage, setOpenModal, messageSelected, sendMessage, infotrackingelected } = useContext(trackingContext);
    const { setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            message: ""
        },
        validationSchema: Yup.object({
            message: Yup.string().required('El mensaje es obligatorio'),
        }),
        onSubmit: async values => {
            const datatosend = {
                facebookpostid: messageSelected.facebookpostid,
                SiteId: messageSelected.externalid,
                RecipientId: messageSelected.facebookid,
                MessageType: "text",
                MessageContent: values.message,
                PersonId: infotrackingelected.userid,
                WatsonClass: messageSelected.watsonclass,
                WatsonSubClass: messageSelected.classification,
                SourceContent :messageSelected.message
            }
            setOpenBackdrop(true);
            const resultsendmessage = await sendMessage(datatosend);
            resultsendmessage.message = resultsendmessage.operationMessage;
            setOpenSnackBack(true, resultsendmessage);

            setOpenBackdrop(false);
        }
    });

    useEffect(() => {
        if (openModalMessage) {
            formik.handleChange({ target: { name: 'message', value: '' } });
        }
    }, [openModalMessage])

    const handleClick = () => {
        setOpenModal(false);
    }

    return (

        <Dialog
            open={openModalMessage}
            fullWidth={true}

            onClose={handleClick}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <DialogTitle id="alert-dialog-title">{"Enviar Mensaje"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Mensaje"
                        multiline
                        rows={3}
                        variant="outlined"
                        name="message"
                        value={formik.values?.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.message ? true : false}
                        helperText={formik.errors.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        color="primary"
                    >
                        Enviar
                    </Button>
                    <Button
                        type="button"
                        color="secondary"
                        style={{ marginLeft: '1rem' }}
                        onClick={handleClick}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ModalMessage;