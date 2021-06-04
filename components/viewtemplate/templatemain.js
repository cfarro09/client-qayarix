import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import SelectFunction from '../../hooks/useSelectFunction';
import { useFormik } from 'formik';
import authContext from '../../context/auth/authContext';
import triggeraxios from '../../config/axiosv2';
import ColumnSelect from '../viewtemplate/columnselect';
import SelectDomain from '../../hooks/useSelectDomain';
import { validateres, getDomain } from '../../config/helper';
import * as Yup from 'yup';

const columnsinit = [
    {
        columnbd: "seg_code",
        columnbddesc: "Codigo Seguimiento",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "sku_description",
        columnbddesc: "Descripcion SKU",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "alt_code1",
        columnbddesc: "Codigo alternativo 1",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "alt_code2",
        columnbddesc: "Codigo alternativo 2",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_date",
        columnbddesc: "Fecha Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_date2",
        columnbddesc: "Fecha Cliente 2",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_barcode",
        columnbddesc: "Codigo barras Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "guide_number",
        columnbddesc: "N° Guia",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_dni",
        columnbddesc: "Dni Cliente",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "client_name",
        columnbddesc: "Nombre Cliente",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "client_phone1",
        columnbddesc: "Telefono Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_phone2",
        columnbddesc: "Telefono 2 Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_phone3",
        columnbddesc: "Telefono 3 Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_email",
        columnbddesc: "Correo Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "client_address",
        columnbddesc: "Dirección Cliente",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "client_address_reference",
        columnbddesc: "Referencia Dirección Cliente",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "coord_latitude",
        columnbddesc: "Latitud Entrega",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "coord_longitude",
        columnbddesc: "Longitud Entrega",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "department",
        columnbddesc: "Departamento",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "district",
        columnbddesc: "Distrito",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "province",
        columnbddesc: "Provincia",
        obligatory: true,
        obligatorycolumn: true,
        selected: true
    },
    {
        columnbd: "sku_code",
        columnbddesc: "Codigo SKU",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "sku_weight",
        columnbddesc: "Peso SKU",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "sku_pieces",
        columnbddesc: "Piezas SKU",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "sku_brand",
        columnbddesc: "Marca SKU",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "sku_size",
        columnbddesc: "Tamaño SKU",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "box_code",
        columnbddesc: "Codigo Caja",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "delivery_type",
        columnbddesc: "Tipo delivery",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "contact_name",
        columnbddesc: "Nombre contacto",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "contact_phone",
        columnbddesc: "Teléfono contacto",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
    {
        columnbd: "collect_time_range",
        columnbddesc: "Horario de recojo",
        obligatory: false,
        obligatorycolumn: false,
        selected: false
    },
]

const requestorganizations = (id_corporation) => ({
    method: "SP_SEL_ORGANIZATIONS",
    data: { status: 'ACTIVO', id_corporation, type: null }
})
const requestcorporations = {
    method: "SP_SEL_CORPORATIONS",
    data: { status: 'ACTIVO' }
}
const TemplateModal = ({ title, openModal, setOpenModal, rowselected, fetchDataUser }) => {
    const theme = useTheme();
    const { setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);
    const { typeuser } = useContext(authContext);

    const [selectedcolumns, setselectedcolumns] = useState([]);
    const [optionscolumn, setoptionscolumn] = useState([]);

    const [dataOrganizations, setDataOrganizations] = useState([]);
    const [dataCorporations, setdataCorporations] = useState([]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            description: '',
            name: '',
            status: 'ACTIVO',
            id_organization: 0,
            id_corporation: 0,
            type: "RECAUDACION"
        },
        validationSchema: Yup.object({
            description: Yup.string().required('La descripción es obligatorio'),
            name: Yup.string().required('El nombre es obligatorio'),
            status: Yup.string().required('El nombre es obligatorio'),
            type: Yup.string().required('El tipo es obligatorio'),
        }),
        onSubmit: async values => {
            const allcompleted = selectedcolumns.some(x => !x.keyexcel);

            if (allcompleted) {
                setOpenSnackBack(true, { success: false, message: 'Debe completar todos los titulos del excel.' });
                return;
            }
            const datatosend = {
                method: "SP_INS_TEMPLATE",
                data: {
                    ...values,
                    id_load_template: rowselected ? rowselected.id_load_template : 0,
                    json_detail: JSON.stringify(selectedcolumns),
                    id_organization: typeuser === "EXTERNO" ? null : values.id_organization,
                    id_corporation: typeuser === "EXTERNO" ? null : values.id_corporation,
                }
            }
            setOpenBackdrop(true);
            await triggeraxios('post', '/api/web/main', datatosend);
            fetchDataUser({});
            setOpenModal(false);
            setOpenBackdrop(false)
        }
    });

    const callbackCorporation = useCallback(({ newValue }) => {
        triggeraxios('post', '/api/web/main/', requestorganizations(newValue.id_corporation)).then(r => {
            setDataOrganizations(validateres(r, true));
        });
    }, [])

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', requestcorporations).then(r => setdataCorporations(validateres(r, continuezyx)))
            ]);

        })();
        return () => continuezyx = false;
    }, [])

    useEffect(() => {
        if (openModal) {
            formik.resetForm();
            if (rowselected) {

                const dateedited = JSON.parse(rowselected.json_detail);
                try {
                    setselectedcolumns(dateedited);
                    setoptionscolumn(columnsinit.filter(r => !dateedited.map(x => x.columnbd).includes(r.columnbd)
                    ));
                } catch (error) {
                    setselectedcolumns(columnsinit.filter(r => r.obligatorycolumn === true));
                    setoptionscolumn(columnsinit);
                }
            } else {
                setselectedcolumns(columnsinit.filter(r => r.obligatorycolumn === true));
                setoptionscolumn(columnsinit);
            }
        }
    }, [openModal]);

    const handlerselectcolumn = useCallback(({ newValue }) => {
        if (newValue) {
            setselectedcolumns(p => [...p, newValue]);
            setoptionscolumn(p => p.map(x => {
                return {
                    ...x,
                    selected: x.columnbd === newValue.columnbd ? true : x.selected
                }
            }));
        }
    });
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
                                classname="col-3"
                                name="name"
                                label="Nombre"
                                formik={formik}
                            />
                            <InputFormk
                                classname="col-3"
                                name="description"
                                label="Descripción"
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
                            <SelectDomain
                                classname="col-3"
                                title="Tipo"
                                domainname="TIPOPLANTILLA"
                                valueselected={formik.values.type}
                                namefield="type"
                                formik={formik}
                            />
                        </div>
                        {typeuser === "INTERNO" && (
                            <div className="row-zyx">
                                <SelectFunction
                                    title="Corporación"
                                    datatosend={dataCorporations}
                                    classname="col-3"
                                    optionvalue="id_corporation"
                                    optiondesc="name"
                                    valueselected={formik.values.id_corporation}
                                    namefield="id_corporation"
                                    descfield="corp_name"
                                    formik={formik}
                                    callback={callbackCorporation}
                                />
                                <SelectFunction
                                    title="Organizacion"
                                    datatosend={dataOrganizations}
                                    classname="col-3"
                                    optionvalue="id_organization"
                                    optiondesc="name"
                                    valueselected={formik.values.id_organization}
                                    namefield="id_organization"
                                    descfield="org_name"
                                    formik={formik}
                                />
                            </div>
                        )}
                        <div className="row-zyx">
                            <SelectFunction
                                title="Columnas Opcionales"
                                datatosend={optionscolumn.filter(r => !r.selected)}
                                optionvalue="columnbd"
                                optiondesc="columnbddesc"
                                callback={handlerselectcolumn}
                            />

                        </div>
                        <div style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: theme.spacing(1) }}>
                            <div className="row-zyx" style={{ marginBottom: theme.spacing(1) }}>
                                <div className="col-3" style={{ fontWeight: 'bold' }}>
                                    COLUMNA BD
                                </div>
                                <div className="col-3" style={{ fontWeight: 'bold' }}>
                                    COLUMNA EXCEL
                                </div>
                                <div className="col-3" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    OBLIGATORIO
                                </div>
                                <div className="col-3" style={{ fontWeight: 'bold' }}>
                                    ACCIONES
                                </div>
                            </div>
                            <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                {selectedcolumns.map(r => (
                                    <ColumnSelect
                                        key={r.columnbd}
                                        r={r}
                                        setselectedcolumns={setselectedcolumns}
                                        setoptionscolumn={setoptionscolumn}
                                    />
                                ))}
                            </div>

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

export default TemplateModal;