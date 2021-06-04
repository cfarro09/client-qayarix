import React, { useState, useContext, useCallback, useEffect } from 'react';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
import DateRange from '../components/form/daterange';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { validateres } from '../config/helper';
import SelectFunction from '../hooks/useSelectFunction';

const requestorganizations = (id_corporation) => ({
    method: "SP_SEL_ORGANIZATIONS",
    data: { status: 'ACTIVO', id_corporation, type: null }
})

const requestcorporations = {
    method: "SP_SEL_CORPORATIONS",
    data: { status: 'ACTIVO' }
}

const LoadMassive = () => {
    const { setloadingglobal, setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);

    const [dataOrganizations, setDataOrganizations] = useState([]);
    const [dataCorporations, setdataCorporations] = useState([]);
    const [dateRange, setdateRange] = useState([
        {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);

    const callbackCorporation = useCallback(({ newValue }) => {
        if (newValue) {
            triggeraxios('post', '/api/web/main/', requestorganizations(newValue.id_corporation)).then(r => {
                setDataOrganizations(validateres(r, true));
            });
        }
    }, [])

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', requestcorporations).then(r => setdataCorporations(validateres(r, continuezyx))),
            ]);

        })();
        return () => continuezyx = false;
    }, [])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id_corporation: 0,
        },
        validationSchema: Yup.object({
            id_corporation: Yup.number().min(1),
        }),
        onSubmit: async values => {

            const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
            const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
            if (startdate) {
                const datarequest = {
                    desde: startdate,
                    hasta: enddate,
                    id_corporation: values.id_corporation,
                    id_organization: values.id_organization ? values.id_organization : null,
                };
                setOpenBackdrop(true);
                const r = await triggeraxios('post', '/api/web/reportes/reporte_eficiencia', datarequest);
                if (r.success) {
                    window.open(r.result.data.reporte);
                } else
                    setOpenSnackBack(true, { success: false, message: 'Hubo un error, intentelo mas tarde.' });
                setOpenBackdrop(false);
            }
        }
    });

    return (
        <Layout>
            <form
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <div className="row-zyx" style={{ paddingLeft: '16px' }}>
                    <SelectFunction
                        title="Corporación"
                        datatosend={dataCorporations}
                        classname="col-2"
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
                        classname="col-2"
                        optionvalue="id_organization"
                        optiondesc="name"
                        valueselected={formik.values.id_organization}
                        namefield="id_organization"
                        descfield="org_name"
                        formik={formik}
                    />
                    <div className="col-3">
                        <DateRange
                            fullWidthInput={true}
                            label="Filtrar Rango de Fecha"
                            dateRangeinit={dateRange}
                            setDateRangeExt={setdateRange}
                        />
                    </div>
                    <div style={{ width: 'auto' }}>
                        <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                        // onClick={fetchData}
                        >
                            EXPORTAR
                        </Button>
                    </div>
                </div>
            </form>
        </Layout>
    );
}

export default LoadMassive;