import React, { useState, useContext, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import UseSelectDomain from '../../hooks/useSelectDomain';
import { useFormik } from 'formik';
import TableZyx from '../../hooks/useTableCRUD';
import triggeraxios from '../../config/axiosv2';
import UserOrganization from './userorganization';
import * as Yup from 'yup';
import { validateres, getDomain } from '../../config/helper';
import SelectFunction from '../../hooks/useSelectFunction';
const requestroles = {
    method: "SP_SEL_ROLE",
    data: { status: 'ACTIVO' }
}


const UserModal = ({ title, openModal, setOpenModal, rowselected, fetchDataUser }) => {

    const { setOpenBackdrop, setOpenSnackBack, setModalQuestion } = useContext(popupsContext);

    //#region orguser
    const [openModalOrganization, setOpenModalOrganization] = useState(false);
    const [orgrowselected, setorgrowselected] = useState(null);
    const [dataorg, setdataorg] = useState([]);
    const [showtable, setshowtable] = useState(false);
    const [dataRoles, setDataRoles] = useState([]);
    const [domains, setdomains] = useState({ doc_type: [], status: [], type: [] });

    const callbackType = useCallback(({ newValue }) => {
        setshowtable(newValue.domain_value === "EXTERNO");
        if (newValue.domain_value === "INTERNO") {
            setdataorg([]);
        };
    }, [])

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', getDomain("TIPODOCUMENTO")).then(r => setdomains(p => ({ ...p, doc_type: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', getDomain("ESTADOGENERICO")).then(r => setdomains(p => ({ ...p, status: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', getDomain("TIPOUSUARIO")).then(r => setdomains(p => ({ ...p, type: validateres(r, continuezyx) }))),
                triggeraxios('post', '/api/web/main/', requestroles).then(r => setDataRoles(validateres(r, continuezyx))),
            ]);

        })();
        return () => continuezyx = false;
    }, [])


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

    useEffect(() => {
        setdataorg([]);
        let continuezyx = true;
        (async () => {
            if (rowselected) {
                setshowtable(rowselected.type === "EXTERNO");
                const datatlistorg = {
                    method: "SP_SEL_ORGUSER",
                    data: {
                        id_user: rowselected.id_user,
                        status: null
                    }
                }
                const res = await triggeraxios('post', '/api/web/main/', datatlistorg);
                if (res.success && continuezyx) {
                    setdataorg(res.result.data.map(x => ({ ...x, bydefault: (x.bydefault === 1 ? "SI" : "NO") })));
                }
            } else
                setshowtable(false);
        })();
        return () => continuezyx = false;
    }, [rowselected])

    const selectrow = (row) => {
        setOpenModalOrganization(true);
        setorgrowselected(row);
    }
    //    #endregion

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            first_name: '',
            last_name: '',
            username: '',
            user_email: '',
            doc_type: '',
            doc_number: '',
            status: 'ACTIVO',
            password: '',
            type: '',
            id_role: 0,
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('El mensaje es obligatorio'),
            id_role: Yup.number().min(1),
            last_name: Yup.string().required('El mensaje es obligatorio'),
            username: Yup.string().required('El mensaje es obligatorio'),
            user_email: Yup.string().email('El user_email no es valido').required('El user_email es obligatorio'),
            doc_number: Yup.string().required('El mensaje es obligatorio'),
            doc_type: Yup.string().required('El mensaje es obligatorio'),
            type: Yup.string().required('El mensaje es obligatorio'),
            confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: async values => {

            if (!values.id_user && !values.password) {
                setOpenSnackBack(true, { success: false, message: 'Debe asignarle una contraseña al usuario.' });
                return
            }

            if (values.type !== "INTERNO" && dataorg.every(x => x.bydefault === "NO")) {
                setOpenSnackBack(true, { success: false, message: 'Debe seleccionar una organización por defecto.' });
                return
            }

            if (values.type === "INTERNO" || (dataorg.filter(x => !x.deleted).length !== 0 && values.type === "EXTERNO")) {
                const callback = async () => {
                    setModalQuestion({ visible: false });
                    const dattosend = {
                        method: "SP_INS_USER",
                        header: {
                            data: {
                                ...values,
                                id_user: rowselected ? rowselected.id_user : 0,
                                password: values.password ? values.password : "",
                            }
                        },
                        details: {
                            data: dataorg.filter(x => x.operation === true).map(x => {
                                return {
                                    ...x,
                                    id_role: 1,
                                    id_orguser: x.id_orguser < 0 ? 0 : x.id_orguser,
                                    bydefault: x.bydefault === "SI" ? 1 : 0,
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
                        setOpenSnackBack(true, { success: false, message: res.msg });
                    }

                    setOpenBackdrop(false);
                }

                setModalQuestion({ visible: true, question: `¿Está seguro de guardar el usuario?`, callback })
            } else {
                setOpenSnackBack(true, { success: false, message: 'El usuario debe estar asignado almenos en una organización.' });
            }
        }
    });

    const handleClick = () => setOpenModal(false);

    const deleterow = (row) => {
        const callback = () => {
            if (row.id_orguser <= 0) {
                setdataorg(prev => prev.filter(x => x.id_orguser !== row.id_orguser));
            } else {
                setdataorg(prev => [...prev.map(o => o.id_organization === row.id_organization ? { ...row, status: 'ELIMINADO', deleted: true, bydefault: "NO", operation: (row.id_organization > 0) } : o)]);
            }
            setModalQuestion({ visible: false });
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
                                name="first_name"
                                classname="col-3"
                                label="Nombre"
                                formik={formik}
                            />
                            <InputFormk
                                name="last_name"
                                classname="col-3"
                                label="Apellido"
                                formik={formik}
                            />
                            <InputFormk
                                name="username"
                                classname="col-3"
                                label="Usuario"
                                formik={formik}
                            />
                            <InputFormk
                                name="user_email"
                                classname="col-3"
                                label="Correo"
                                formik={formik}
                            />
                        </div>
                        <div className="row-zyx">
                            <InputFormk
                                name="doc_number"
                                classname="col-3"
                                label="N° Doc"
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
                            <UseSelectDomain
                                classname="col-3"
                                title="Estado"
                                domainname={domains.status}
                                valueselected={formik.values.status}
                                namefield="status"
                                formik={formik}
                            />
                            <UseSelectDomain
                                classname="col-3"
                                title="Tipo"
                                domainname={domains.type}
                                disabled={!!rowselected}
                                valueselected={formik.values.type}
                                namefield="type"
                                formik={formik}
                                callback={callbackType}
                            />
                        </div>
                        <div className="row-zyx">
                            <SelectFunction
                                title="Rol"
                                datatosend={dataRoles}
                                classname="col-3"
                                optionvalue="id_role"
                                optiondesc="description"
                                valueselected={formik.values.id_role}
                                namefield="id_role"
                                descfield="role_name"
                                formik={formik}
                            />
                        </div>

                        <div className="row-zyx">
                            <InputFormk
                                classname="col-6"
                                name="password"
                                label="Contraseña"
                                type="password"
                                formik={formik}
                            />
                            <InputFormk
                                classname="col-6"
                                name="confirmpassword"
                                label="Confirmar Contraseña"
                                type="password"
                                formik={formik}
                            />
                        </div>
                        {showtable && (
                            <TableZyx
                                columns={columnsOrganization}
                                titlemodule='Organizaciones'
                                data={dataorg.filter(x => !x.deleted)}
                                register={dataorg.filter(x => !x.deleted).length === 0}
                                setOpenModal={setOpenModalOrganization}
                                selectrow={selectrow}
                                deleterow={deleterow}
                            />
                        )}
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
            <UserOrganization
                openModal={openModalOrganization}
                setOpenModal={setOpenModalOrganization}
                setdataorg={setdataorg}
                rowselected={orgrowselected}
                selectedorgs={dataorg}
            />
        </>
    );
}

export default UserModal;