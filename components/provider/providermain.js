import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import { useFormik } from 'formik';
import triggeraxios from '../../config/axiosv2';
import UseSelectDomain from '../../hooks/useSelectDomain';
import * as Yup from 'yup';
import { validateres, getDomain } from '../../config/helper';

const ProviderMain = ({ title, openModal, setOpenModal, rowselected, fetchDataUser }) => {

    const [domains, setdomains] = useState({ status: [], type: [] })

    const { setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', getDomain("ESTADOGENERICO")).then(r => setdomains(p => ({ ...p, status: validateres(r, continuezyx) })))
            ]);
        })();
        return () => continuezyx = false;
    }, [])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            name: '',
            ruc: '',
            description: '',
            address: '',
            status: 'ACTIVO',
            responsible_name: '',
            responsible_phone: '',
            responsible_email: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es obligatorio').nullable(),
            ruc: Yup.string().required('El ruc es obligatorio').nullable(),
            description: Yup.string().required('La descripción es obligatorio').nullable(),
            status: Yup.string().required('El estado es obligatorio').nullable(),
            address: Yup.string().required('La dirección es obligatorio').nullable(),
            responsible_name: Yup.string().required('El responsible name es obligatorio').nullable(),
            responsible_phone: Yup.string().required('El responsible phone es obligatorio').nullable(),
            responsible_email: Yup.string().email('El correo no es valido').required('El correo es obligatorio').nullable(),
        }),
        onSubmit: async values => {
            const callback = async () => {
                setModalQuestion({ visible: false });
                const datatosend = {
                    method: "SP_INS_PROVIDER",
                    data: {
                        ...values,
                        id_provider: rowselected ? rowselected.id_provider : 0
                    }
                }

                setOpenBackdrop(true);
                const res = await triggeraxios('post', '/api/web/main', datatosend);
                if (res.success) {
                    fetchDataUser({});
                    setOpenModal(false);

                    setOpenSnackBack(true, { success: true, message: 'Transacción ejecutada satisfactoriamente.' });
                } else {
                    const message = res.msg ? res.msg : 'Hubo un error, vuelva a intentarlo'
                    setOpenSnackBack(true, { success: false, message });
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
                                label="Empresa"
                                formik={formik}
                            />
                            <InputFormk
                                name="ruc"
                                classname="col-3"
                                label="Ruc"
                                formik={formik}
                            />
                            <InputFormk
                                name="description"
                                classname="col-3"
                                label="Descripcion"
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
                                name="responsible_name"
                                classname="col-3"
                                label="Nombre responsable"
                                formik={formik}
                            />
                            <InputFormk
                                name="responsible_phone"
                                classname="col-3"
                                label="Tel Responsable"
                                formik={formik}
                            />
                            <InputFormk
                                name="responsible_email"
                                classname="col-3"
                                label="Correo Responsable"
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

export default ProviderMain;