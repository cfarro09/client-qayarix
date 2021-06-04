import React, { PureComponent, useState, useEffect, useContext, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Layout from '../components/layout/layout';
import popupsContext from '../context/pop-ups/pop-upsContext';
import triggeraxios from '../config/axiosv2';
import { useFormik } from 'formik';
import DateRange from '../components/form/daterange';
import * as Yup from 'yup';
import SelectFunction from '../hooks/useSelectFunction';
import { validateres, getDomain } from '../config/helper';
import authContext from '../context/auth/authContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell,
    BarChart, Bar, LabelList
} from 'recharts';

const requestorganizations = (id_corporation) => ({
    method: "SP_SEL_ORGANIZATIONS",
    data: { status: 'ACTIVO', id_corporation, type: null }
})
const requestcorporations = {
    method: "SP_SEL_CORPORATIONS",
    data: { status: 'ACTIVO' }
}
const requestproviders = {
    method: "SP_SEL_PROVIDERS",
    data: { status: 'ACTIVO' }
}

const CardSimple = ({ name, value }) => (
    <Box component={Paper} px={4} pb={1} mx={2} mb={2} style={{ height: '100%', width: '270px' }}>
        <h2 style={{ textAlign: 'center' }}>{name}</h2>
        <div style={{ textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '50px', margin: '0 20px' }}>{value}</span>
        </div>
    </Box>
)

const COLORS = ['#8EC3E0', '#1e2835', '#E0AD30'];

const renderCustomizedLabel = (props, datatypesclaim, column, color) => {
    const {
        x, y, width, height, value, index
    } = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill={color} textAnchor="middle" dominantBaseline="middle">
                {datatypesclaim[index][column]}
            </text>
        </g>
    );
};

// const CustomTooltip = ({ active, payload, label }) => {
//     if (active) {
//         return (
//             <div style={{ backgroundColor: 'white', border: '1px solid #e1e1e1', width: '100px', padding: '10px 5px', textAlign: 'center' }}>
//                 {`${label} : ${payload[0].value}`}
//                 {/* <p className="intro">{getIntroOfPage(label)}</p> */}
//             </div>
//         );
//     }

//     return null;
// };

const Dashboard = () => {
    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);

    const [dataOrganizations, setDataOrganizations] = useState([]);
    const [dataCorporations, setdataCorporations] = useState([]);
    const [dataProviders, setdataProviders] = useState([]);
    const [datadashboard, setdatadashboard] = useState();
    const [graphclients, setgraphclients] = useState([]);
    const [graphproviders, setgraphproviders] = useState([]);
    const [datadashboardproviders, setdatadashboardproviders] = useState(null);
    const { user } = useContext(authContext);


    const [dateRange, setdateRange] = useState([
        {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);
    const [dateRangeProviders, setdateRangeProviders] = useState([
        {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);

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
                const datarequest = (method) => ({
                    method,
                    data: {
                        desde: startdate,
                        hasta: enddate,
                        id_corporation: values.id_corporation,
                        id_organization: values.id_organization ? values.id_organization : null,
                        type: "DISTRIBUCION"
                    }
                });
                setOpenBackdrop(true);
                await triggeraxios('post', '/api/web/main/', datarequest("SP_DASHBOARD_CLIENTE")).then(r => {
                    const ccaux = validateres(r, true)[0];
                    setdatadashboard(ccaux);
                    setgraphclients([
                        { name: "Total", GUIA: ccaux.total_guias, BULTO: ccaux.total_bultos },
                        { name: "Entregado", GUIA: ccaux.total_guias_entregadas, BULTO: ccaux.total_bultos_entregados },
                        { name: "No entregado", GUIA: ccaux.total_guias_noEntregados, BULTO: ccaux.total_bultos_noEntregados },
                        { name: "Curso", GUIA: ccaux.total_guias_curso, BULTO: ccaux.total_bultos_curso },
                        { name: "Pendiente", GUIA: ccaux.total_guias_pendientes, BULTO: ccaux.total_bultos_pendientes },
                        { name: "Asignado", GUIA: ccaux.total_guias_asignadas, BULTO: ccaux.total_bultos_asignados },
                    ])
                })
                setOpenBackdrop(false);
            }
        }
    });

    const formikproviders = useFormik({
        enableReinitialize: true,
        initialValues: {
            id_provider: 0,
        },
        validationSchema: Yup.object({
            // id_provider: Yup.number().min(1),
        }),
        onSubmit: async values => {
            const startdate = dateRangeProviders.length > 0 ? dateRangeProviders[0].startDate : "";
            const enddate = dateRangeProviders.length > 0 ? dateRangeProviders[0].endDate : "";
            if (startdate) {
                const datarequest = (method) => ({
                    method,
                    data: {
                        desde: startdate,
                        hasta: enddate,
                        id_provider: values.id_provider ? values.id_provider : null,
                        type: "DISTRIBUCION"
                    }
                });
                setOpenBackdrop(true);
                await triggeraxios('post', '/api/web/main/', datarequest("SP_DASHBOARD_PROVEEDOR")).then(r => {
                    const ccaux = validateres(r, true)[0];
                    setdatadashboardproviders(ccaux);
                    setgraphproviders([
                        { name: "Total", GUIA: ccaux.total_guias, BULTO: ccaux.total_bultos },
                        { name: "Entregado", GUIA: ccaux.total_guias_entregadas, BULTO: ccaux.total_bultos_entregados },
                        { name: "No entregado", GUIA: ccaux.total_guias_noEntregados, BULTO: ccaux.total_bultos_noEntregados },
                        { name: "Curso", GUIA: ccaux.total_guias_curso, BULTO: ccaux.total_bultos_curso },
                        // { name: "Pendiente", GUIA: ccaux.total_guias_pendientes, BULTO: ccaux.total_bultos_pendientes },
                        { name: "Asignado", GUIA: ccaux.total_guias_asignadas, BULTO: ccaux.total_bultos_asignados },
                    ])

                });
                setOpenBackdrop(false);
            }
        }
    });

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
                triggeraxios('post', '/api/web/main/', requestproviders).then(r => setdataProviders(validateres(r, continuezyx))),
            ]);

        })();
        return () => continuezyx = false;
    }, [])

    return (
        <Layout>
            <Box style={{ height: '100%' }}>
                <div>
                    <Box display="flex" justifyContent="space-between" mb={2} ml={1}>
                        <Typography variant="h6" id="tableTitle" component="div">
                            Indicadores por cliente
                        </Typography>
                    </Box>
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
                                >
                                    BUSCAR
                                </Button>
                            </div>
                        </div>
                    </form>
                    {datadashboard && (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <CardSimple
                                name="TOTAL BULTOS"
                                value={datadashboard.total_bultos}
                            />
                            <CardSimple
                                name="BULTOS ENTREGADAS"
                                value={datadashboard.total_bultos_entregados}
                            />
                            <CardSimple
                                name="EFECTIVIDAD BULTOS"
                                value={datadashboard.total_bultos ? ((datadashboard.total_bultos_entregados / datadashboard.total_bultos) * 100).toFixed(2) + "%" : 0}
                            />
                            <CardSimple
                                name="EFECTIVIDAD<24h (BULTOS)"
                                value={datadashboard.total_bultos_efectividad24}
                            />
                            <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                                <h2 style={{ textAlign: 'center' }}>RESUMEN</h2>
                                <BarChart
                                    width={700}
                                    height={400}
                                    data={graphclients}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="BULTO" fill="#da042e" >
                                        <LabelList dataKey="name" content={r => renderCustomizedLabel(r, graphclients, "BULTO", "#da042e")} />
                                    </Bar>
                                    <Bar dataKey="GUIA" fill="#E0AD30" >
                                        <LabelList dataKey="name" content={r => renderCustomizedLabel(r, graphclients, "GUIA", "#E0AD30")} />
                                    </Bar>
                                </BarChart>
                            </Box>

                        </div>
                    )}
                </div>
                {user?.role_name !== "CONSULTOR" && (
                    <div>
                        <Box display="flex" justifyContent="space-between" mb={2} ml={1}>
                            <Typography variant="h6" id="tableTitle" component="div">
                                Indicadores por proveedor
                        </Typography>
                        </Box>
                        <form
                            noValidate
                            onSubmit={formikproviders.handleSubmit}
                        >
                            <div className="row-zyx" style={{ paddingLeft: '16px' }}>
                                <SelectFunction
                                    title="Proveedor"
                                    datatosend={dataProviders}
                                    classname="col-2"
                                    optionvalue="id_provider"
                                    optiondesc="name"
                                    valueselected={formikproviders.values.id_provider}
                                    namefield="id_provider"
                                    descfield="name"
                                    formik={formikproviders}
                                />
                                <div className="col-3">
                                    <DateRange
                                        fullWidthInput={true}
                                        label="Filtrar Rango de Fecha"
                                        dateRangeinit={dateRangeProviders}
                                        setDateRangeExt={setdateRangeProviders}
                                    />
                                </div>
                                <div style={{ width: 'auto' }}>
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                    >
                                        BUSCAR
                                </Button>
                                </div>
                            </div>
                        </form>
                        {datadashboardproviders && (
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <CardSimple
                                    name="TOTAL GUIAS"
                                    value={datadashboardproviders.total_guias}
                                />
                                <CardSimple
                                    name="GUIAS ENTREGADAS"
                                    value={datadashboardproviders.total_guias_entregadas}
                                />
                                <CardSimple
                                    name="GUIAS NO ENTREGADAS"
                                    value={datadashboardproviders.total_guias_noEntregados}
                                />
                                <CardSimple
                                    name="EFECTIVIDAD GUIAS"
                                    value={datadashboardproviders.total_guias ? ((datadashboardproviders.total_guias_entregadas / datadashboardproviders.total_guias) * 100).toFixed(2) : 0}
                                />
                                <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                                    <h2 style={{ textAlign: 'center' }}>RESUMEN</h2>
                                    <BarChart
                                        width={700}
                                        height={400}
                                        data={graphproviders}
                                        margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="BULTO" fill="#da042e" >
                                            <LabelList dataKey="name" content={r => renderCustomizedLabel(r, graphproviders, "BULTO", "#da042e")} />
                                        </Bar>
                                        <Bar dataKey="GUIA" fill="#E0AD30" >
                                            <LabelList dataKey="name" content={r => renderCustomizedLabel(r, graphproviders, "GUIA", "#E0AD30")} />
                                        </Bar>
                                    </BarChart>
                                </Box>
                            </div>
                        )}
                    </div>
                )}
            </Box>

        </Layout>
    );
}

export default Dashboard;