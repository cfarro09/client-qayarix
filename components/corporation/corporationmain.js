import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import { useFormik } from 'formik';
import TableZyx from '../../hooks/useTableCRUD';
import triggeraxios from '../../config/axiosv2';
import Organization from './organization';
import SelectDomain from '../../hooks/useSelectDomain';
import * as Yup from 'yup';


const CorporationModal = ({ title, openModal, setOpenModal, rowselected, fetchDataUser }) => {
    const { setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);

    // #region orguser
    const [openModalOrganization, setOpenModalOrganization] = useState(false);
    const [orgrowselected, setorgrowselected] = useState(null);
    const [dataorg, setdataorg] = useState([]);

    const columnsOrganization = React.useMemo(
        () => [
            {
                Header: 'NOMBRE',
                accessor: 'name'
            },
            {
                Header: 'TIPO',
                accessor: 'type'
            },
            {
                Header: 'DESCRIPCION',
                accessor: 'description'
            },
            {
                Header: 'RUC',
                accessor: 'ruc'
            },
            {
                Header: 'DIRECCIÓN',
                accessor: 'address'
            },
            {
                Header: 'TIPO SERVICIO',
                accessor: 'typeservices'
            },
            {
                Header: 'ESTADO',
                accessor: 'status'
            },
        ],
        []
    );

    useEffect(() => {
        let continuezyx = true;

        if (openModal) {
            formik.resetForm();
            setdataorg([]);
            (async () => {
                if (rowselected) {
                    const datatlistorg = {
                        method: "SP_SEL_ORGANIZATIONS",
                        data: {
                            id_corporation: rowselected.id_corporation,
                            status: null,
                            type: null
                        }
                    }
                    const res = await triggeraxios('post', '/api/web/main/', datatlistorg);
                    if (res.success && continuezyx) {
                        setdataorg(res.result.data);
                    }
                }
            })();

        }
        return () => continuezyx = false;
    }, [openModal])

    const selectrow = (row) => {
        setOpenModalOrganization(true);
        setorgrowselected(row);
    }
    // #endregion

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            name: '',
            description: '',
            status: 'ACTIVO',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El name es obligatorio'),
            description: Yup.string().required('El descripcion es obligatorio'),
            status: Yup.string().required('El status es obligatorio'),
        }),
        onSubmit: async values => {
            if (dataorg.length !== 0) {
                const callback = async () => {
                    setModalQuestion({ visible: false });
                    const dattosend = {
                        method: "SP_INS_CORPORATION",
                        header: {
                            data: {
                                id_corporation: rowselected ? rowselected.id_corporation : 0,
                                name: values.name,
                                description: values.description,
                                status: values.status
                            }
                        },
                        details: {
                            data: dataorg.filter(x => x.operation === true).map(x => {
                                return {
                                    id_organization: x.id_organization < 0 ? 0 : x.id_organization,
                                    name: x.name,
                                    type: x.type,
                                    description: x.description,
                                    ruc: x.ruc,
                                    address: x.address,
                                    status: x.status,
                                    typeservices: x.typeservices,
                                }
                            })
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

                setModalQuestion({ visible: true, question: `¿Está seguro de guardar la corporación?`, callback })
            } else {
                setOpenSnackBack(true, { success: false, message: 'Necesita insertar regitros a la corporación.' });
            }
        }
    });
    const handleClick = () => setOpenModal(false);

    const deleterow = (row) => {
        const callback = () => {
            setdataorg(prev => [...prev.map(o => o.id_organization === row.id_organization ? { ...row, status: 'ELIMINADO', deleted: true, operation: (row.id_organization > 0) } : o)]);
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
                                name="description"
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
                        <TableZyx
                            columns={columnsOrganization}
                            titlemodule='Organizaciones'
                            data={dataorg.filter(x => x.deleted !== true)}
                            register={true}
                            setOpenModal={setOpenModalOrganization}
                            selectrow={selectrow}
                            deleterow={deleterow}
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
            <Organization
                openModal={openModalOrganization}
                setOpenModal={setOpenModalOrganization}
                setdataorg={setdataorg}
                rowselected={orgrowselected}
            />
        </>
    );
}

export default CorporationModal;