import React, { useState, useContext, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import { useFormik } from 'formik';
import triggeraxios from '../../config/axiosv2';
import * as Yup from 'yup';
import { validateres, getDomain } from '../../config/helper';
const requestroles = {
    method: "SP_SEL_ROLE",
    data: { status: 'ACTIVO' }
}


const PropertyMain = ({ title, openModal, setOpenModal, rowselected, fetchData }) => {

    const { setOpenBackdrop, setOpenSnackBack, setModalQuestion } = useContext(popupsContext);

    const columnsOrganization = React.useMemo(
        () => [
            {
                Header: 'ORGANIZACION',
                accessor: 'org_name'
            },
            {
                Header: 'ROLE',
                accessor: 'role_name'
            },
            {
                Header: 'ORG X DEFECTO',
                accessor: 'bydefault'
            },
            {
                Header: 'ESTADO',
                accessor: 'status'
            },
        ],
        []
    );


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            name: '',
            value: '',

        },
        validationSchema: Yup.object({
            name: Yup.string().required('El mensaje es obligatorio'),
            value: Yup.string().required('El mensaje es obligatorio'),
        }),
        onSubmit: async values => {
            const callback = async () => {
                setModalQuestion({ visible: false });
                const datatosend = {
                    method: "SP_INS_PROPERTIES",
                    data: {
                        ...values,
                        id_properties: rowselected ? rowselected.id_properties : 0,
                        status: 'ACTIVO'
                    }
                }

                setOpenBackdrop(true);
                const res = await triggeraxios('post', '/api/web/main', datatosend);
                if (res.success) {
                    fetchData({});
                    setOpenModal(false);

                    setOpenSnackBack(true, { success: true, message: 'Transacción ejecutada satisfactoriamente.' });
                } else {
                    setOpenSnackBack(true, { success: false, message: res.msg });
                }

                setOpenBackdrop(false);
            }

            setModalQuestion({ visible: true, question: `¿Está seguro de guardar la propiedad?`, callback })
        }
    });

    const handleClick = () => setOpenModal(false);

    useEffect(() => {
        if (openModal) {
            formik.resetForm();
        }
    }, [openModal]);

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth={true}
                maxWidth='md'
                onClose={handleClick}
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
                                name="name"
                                classname="col-3"
                                label="Nombre"
                                formik={formik}
                            />
                            <InputFormk
                                name="value"
                                classname="col-3"
                                label="Valor"
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

export default PropertyMain;