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
import SelectFunction from '../../hooks/useSelectFunction';
import * as Yup from 'yup';
import { validateres, getDomain } from '../../config/helper';

const arraystatus = [
    { name: 'ENTREGADO', type: "DISTRIBUCION" },
    { name: 'NO ENTREGADO', type: "DISTRIBUCION" },
    { name: 'RECOLECCION COMPLETA', type: "RECOLECCION" },
    { name: 'NO RECOLECTADO', type: "RECOLECCION" },
    { name: 'RECOLECCION PARCIAL', type: "RECOLECCION" },
]

const motivesapi = (type) => ({
    method: "SP_SEL_MOTIVES",
    data: { type }
})

const ChangeStatus = ({ title, openModal, setOpenModal, rowselected, fetchData }) => {


    const { setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);
    const [dataMotive, setDataMotive] = useState([]);
    const [showMotives, setShowMotives] = useState(null);
    const [liststatus, setliststatus] = useState([])

    const callbackStatus = useCallback(({ newValue }) => {
        if (newValue && (newValue.name === "NO ENTREGADO" || newValue.name === "NO RECOLECTADO")) {
            setShowMotives(true)
        } else {
            setShowMotives(false)
        }
    }, []);

    useEffect(() => {
        if (openModal) {
            setShowMotives(false);
            if (rowselected) {
                setliststatus(arraystatus.filter(x => x.type === rowselected.type))

                let continuezyx = true;
                (async () => {
                    if (rowselected) {
                        await Promise.all([
                            triggeraxios('post', '/api/web/main/', motivesapi(rowselected.type)).then(r => setDataMotive(validateres(r, continuezyx)))
                        ]);
                    }
                })();
                return () => continuezyx = false;
            }
        }
    }, [openModal])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            newstatus: '',
            motive: ''
        },
        validationSchema: Yup.object({
            newstatus: Yup.string().required('El nombre es obligatorio')
        }),
        onSubmit: async values => {
            if (showMotives && !values.motive) {
                setOpenSnackBack(true, { success: false, message: 'Debe ingresar un motivo' });
                return;
            }
            const callback = async () => {
                setModalQuestion({ visible: false });
                const datatosend = {
                    method: "SP_CAMBIAR_ESTADO",
                    data: {
                        id_guide: values.id_guide,
                        status: values.newstatus,
                        motive: !showMotives ? "Entrega Exitosa" : values.motive
                    }
                }

                setOpenBackdrop(true);
                const res = await triggeraxios('post', '/api/web/main', datatosend);
                if (res.success) {
                    fetchData({});
                    setOpenModal(false);

                    setOpenSnackBack(true, { success: true, message: 'Transacción ejecutada satisfactoriamente.' });
                } else {
                    const message = res.msg ? res.msg : 'Hubo un error, vuelva a intentarlo'
                    setOpenSnackBack(true, { success: false, message });
                }

                setOpenBackdrop(false);
            }

            setModalQuestion({ visible: true, question: `¿Está seguro de cambiar el estado?`, callback })
        }
    });
    const handleClick = () => setOpenModal(false);

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth={true}
                maxWidth='sm'
                onClose={handleClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    <DialogTitle id="alert-dialog-title">Cambio de estado</DialogTitle>
                    <DialogContent>
                        <div className="row-zyx">
                            <SelectFunction
                                title="Estado"
                                classname="col-6"
                                namefield="newstatus"
                                datatosend={liststatus}
                                optionvalue="name"
                                formik={formik}
                                optiondesc="name"
                                callback={callbackStatus}
                            />
                            {showMotives &&
                                <SelectFunction
                                    title="Motivo"
                                    classname="col-6"
                                    formik={formik}
                                    datatosend={dataMotive}
                                    optionvalue="name"
                                    namefield="motive"
                                    optiondesc="name"
                                />
                            }
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

export default ChangeStatus;