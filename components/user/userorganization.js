import React, { useEffect, useCallback, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectFunction from '../../hooks/useSelectFunction';
import SwitchZyx from '../../hooks/useSwitch'
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import triggeraxios from '../../config/axiosv2';
import { validateres, getDomain } from '../../config/helper';

const requestorganizations = (id_corporation) => ({
    method: "SP_SEL_ORGANIZATIONS",
    data: { status: 'ACTIVO', id_corporation, type: 'EXTERNO' }
})
const requestcorporations = {
    method: "SP_SEL_CORPORATIONS",
    data: { status: 'ACTIVO' }
}

const UserOrganization = ({ openModal, setOpenModal, setdataorg, rowselected, selectedorgs }) => {
    const [dataOrganizations, setDataOrganizations] = useState([]);
    const [dataCorporations, setdataCorporations] = useState([]);
    const [dataOrganizationsShowed, setDataOrganizationsShowed] = useState([]);
    // const [dataRoles, setDataRoles] = useState([]);
    const [domainstatus, setdomainstatus] = useState([]);

    const [disabledbydefault, setdisabledbydefault] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rowselected || {
            id_organization: 0,
            org_name: '',
            // id_role: 0,
            role_name: '',
            bydefault: "NO",
            status: 'ACTIVO'
        },
        validationSchema: Yup.object({
            id_organization: Yup.number().min(1),
            // id_role: Yup.number().min(1),
            status: Yup.string().required('La organización es obligatorio'),
        }),
        onSubmit: async values => {
            const bydefault = !values.bydefault || values.bydefault === "NO" ? "NO" : "SI";
            if (!rowselected) {
                setdataorg(prev => [...prev, { ...values, bydefault, id_orguser: prev.length * -1, operation: true }]);
            } else {
                setdataorg(prev => [...prev.map(o => o.id_orguser === values.id_orguser ? { ...values, bydefault, operation: true } : o)]);
            }
            setOpenModal(false);
        }
    });

    const callbackCorporation = useCallback(({ newValue }) => {
        triggeraxios('post', '/api/web/main/', requestorganizations(newValue.id_corporation)).then(r => {
            const organizations = validateres(r, true); const idorganizationsselected = rowselected ? selectedorgs.filter(x => x.id_organization !== rowselected.id_organization).map(x => x.id_organization) : selectedorgs.map(x => x.id_organization);
            setDataOrganizationsShowed(organizations.filter(x => !idorganizationsselected.includes(x.id_organization)));

            setDataOrganizations(organizations);
        });
    }, [])
    useEffect(() => {
        let continuezyx = true;
        if (openModal) {
            formik.resetForm();
            if (rowselected && rowselected.bydefault === "SI") {
                setdisabledbydefault(false);
            } else {
                setdisabledbydefault(selectedorgs.some(x => x.bydefault === "SI"));
            }
        }
        return () => continuezyx = false;
    }, [openModal])

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', requestcorporations).then(r => setdataCorporations(validateres(r, continuezyx))),
                // triggeraxios('post', '/api/web/main/', requestroles).then(r => setDataRoles(validateres(r, continuezyx))),
                triggeraxios('post', '/api/web/main/', getDomain("ESTADOGENERICO")).then(r => setdomainstatus(validateres(r, continuezyx))),
            ]);

        })();
        return () => continuezyx = false;
    }, [])


    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth='md'
            // onClose={() => setOpenModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <DialogTitle id="alert-dialog-title">Usuario - Organización</DialogTitle>
                <DialogContent>
                    <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                        <SwitchZyx
                            title="Org x Defecto"
                            namefield="bydefault"
                            disabled={disabledbydefault}
                            formik={formik}
                            valueselected={formik.values.bydefault === "SI" ? true : false}
                        />
                    </div>
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
                            datatosend={dataOrganizationsShowed}
                            classname="col-3"
                            optionvalue="id_organization"
                            optiondesc="name"
                            valueselected={formik.values.id_organization}
                            namefield="id_organization"
                            descfield="org_name"
                            formik={formik}
                        />
                        
                        <SelectFunction
                            title="Estado"
                            datatosend={domainstatus}
                            classname="col-3"
                            optionvalue="domain_value"
                            optiondesc="domain_description"
                            valueselected={formik.values.status}
                            namefield="domain_value"
                            descfield="name"
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

export default UserOrganization;