import React, { PureComponent, useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Layout from '../components/layout/layout';
import popupsContext from '../context/pop-ups/pop-upsContext';
import triggeraxios from '../config/axiosv2';
import { useFormik } from 'formik';
import InputFormk from '../components/form/inputformik';
import DateRange from '../components/form/daterange';
import * as Yup from 'yup';
import MultiSelectFunction from '../hooks/useMultiSelectFunction';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell,
    BarChart, Bar, LabelList
} from 'recharts';


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


const Dashboard = () => {
    const { setloadingglobal, loading } = useContext(popupsContext);
    const [dataclients, setdataclients] = useState([]);
    const [dataclaims, setdataclaims] = useState([]);
    const [datasentiments, setdatasentiments] = useState([]);
    const [datatypesclaim, setdatatypesclaim] = useState([]);
    const [dataemojis, setdataemojis] = useState([]);
    const [dataposts, setdataposts] = useState([]);


    const [filter, setfilter] = useState({ postid: '', startdate: '', enddate: '' });
    const [dateRange, setdateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    ]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            posts: '',
        },
        validationSchema: Yup.object({

        }),
        onSubmit: async values => {
            const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
            const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";

            setfilter({ postid: values.posts, startdate, enddate });
        }
    });

    useEffect(() => {
        let continious = true;
        (async () => {
            triggeraxios('post', '/api/main/', { method: 'UFN_FACEBOOKROOTPOST_SEL', data: { offset: (new Date().getTimezoneOffset() / 60) * -1 }}).then(res => {
                if (res.success && continious) {
                    if (res.result instanceof Array) {
                        const newdata = res.result.map(x => {
                            return {
                                ...x,
                                description: x.message ? x.message.substring(0, 30) : "MEDIA " + x.datetimecreated 
                            }
                        });
                        setdataposts(newdata);
                    }
                    else
                        console.error("Result is not array");
                }
            })
        })();
        return () => {
            continious = false;
        }
    }, [])

    useEffect(() => {
        let continious = true;
        (async () => {
            setloadingglobal(true);

            await Promise.all([
                triggeraxios('post', '/api/main/', { method: 'UFN_DASHBOARD_ANALYTICS_NLUEMOTIONS', data: filter }).then(res => {
                    if (res.success && continious) {
                        if (res.result instanceof Array) {
                            const dataemm = [];
                            res.result.forEach(r => {
                                dataemm.push({
                                    date: r.date,
                                    Ira: r.nluanger,
                                    Disgusto: r.nludisgust,
                                    Temor: r.nlufear,
                                    Alegría: r.nlujoy,
                                    Tristeza: r.nlusadness,
                                    emojiIra: '😡',
                                    emojiDisgusto: '🤬',
                                    emojiTemor: '😱',
                                    emojiAlegría: '😂',
                                    emojiTristeza: '😞'
                                });
                            });
                            setdataemojis(dataemm)
                        }
                        else
                            console.error("Result is not array");
                    }
                }),
                triggeraxios('post', '/api/main/', { method: 'UFN_DASHBOARD_ANALYTICS_NLCSUBCLASS', data: filter }).then(res => {
                    if (res.success && continious) {
                        if (res.result instanceof Array) {
                            const dataclaims = [];
                            res.result.forEach(r => {
                                const foundindex = dataclaims.findIndex(x => x.name === r.watsonsubclass);
                                if (foundindex === -1) {
                                    dataclaims.push({
                                        name: r.watsonsubclass,
                                        [r.clienttype]: r.quantity
                                    })
                                } else {
                                    dataclaims[foundindex][r.clienttype] = r.quantity;
                                    dataclaims[foundindex]['total'] = dataclaims[foundindex].cliente + dataclaims[foundindex].nocliente;
                                }
                            });
                            setdatatypesclaim(dataclaims);
                        }
                        else
                            console.error("Result is not array");
                    }
                }),
                triggeraxios('post', '/api/main/', { method: 'UFN_DASHBOARD_ANALYTICS_SUMMARY', data: filter }).then(res => {
                    if (res.success && continious) {
                        if (res.result instanceof Array) {
                            const r = res.result[0];
                            setdataclients([{ name: 'Cliente', value: r.cliente }, { name: 'No Cliente', value: r.nocliente }]);
                            setdataclaims([{ name: 'Reclamo', value: r.reclamo }, { name: 'No Reclamo', value: r.noreclamo }]);
                            setdatasentiments([
                                { name: 'Positivo', value: r.nlupositive },
                                { name: 'Negativo', value: r.nlunegative },
                                { name: 'Neutral', value: r.nluneutral }
                            ]);
                        }
                        else
                            console.error("Result is not array");
                    }
                })
            ]);

            setloadingglobal(false)
        })();

        return () => {
            continious = false;
        }
    }, [filter])

    return (
        <Layout>
            <Box component={Paper} px={2} pt={2} mx={1} mb={2} style={{ height: '100%' }}>
                <Box display="flex" justifyContent="space-between" mb={2} ml={1}>
                    <Typography variant="h6" id="tableTitle" component="div">
                        Dashboards
                    </Typography>
                </Box>
                <form
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    <div className="row-zyx" style={{ paddingLeft: '16px' }}>
                        <MultiSelectFunction
                            classname="col-3"
                            title="Posts"
                            datatosend={dataposts}
                            optionvalue="facebookid"
                            optiondesc="description"
                            namefield="posts"
                            formik={formik}
                        />
                        <div className="col-3">
                            <DateRange
                                label="Filtrar Rango de Fecha"
                                dateRangeinit={dateRange}
                                setDateRangeExt={setdateRange}
                            />
                        </div>
                        <div style={{ width: 'auto' }}>
                            <Button
                                type="submit"
                                color="secondary"
                                disabled={loading}
                                variant="contained"
                            >
                                BUSCAR
                            </Button>
                        </div>
                    </div>
                </form>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                        <h4>Identificación de clientes</h4>
                        <PieChart width={400} height={350}>
                            <Legend />
                            <Pie
                                data={dataclients}
                                cx={120}
                                cy={150}
                                innerRadius={60}
                                outerRadius={80}
                                label
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataclients.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </Box>
                    <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                        <h4>Identificación de reclamos</h4>
                        <PieChart width={400} height={350}>
                            <Legend />
                            <Pie
                                data={dataclaims}
                                cx={120}
                                cy={150}
                                innerRadius={60}
                                outerRadius={80}
                                label
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataclaims.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </Box>
                    <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                        <h4>Análisis de sentimientos en comentarios</h4>
                        <PieChart width={400} height={350}>
                            <Legend />
                            <Pie
                                data={datasentiments}
                                cx={120}
                                cy={150}
                                innerRadius={60}
                                outerRadius={80}
                                label
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {datasentiments.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </Box>

                    <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                        <h4>Tipos de reclamo</h4>
                        <BarChart
                            width={700}
                            height={400}
                            data={datatypesclaim}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#1e2835" >
                                <LabelList dataKey="name" content={r => renderCustomizedLabel(r, datatypesclaim, "total", "#1e2835")} />
                            </Bar>
                            <Bar dataKey="cliente" fill="#8EC3E0" >
                                <LabelList dataKey="name" content={r => renderCustomizedLabel(r, datatypesclaim, "cliente", "#8EC3E0")} />
                            </Bar>
                        </BarChart>
                    </Box>

                    <Box component={Paper} px={2} pt={1} mx={2} mb={2} style={{ height: '100%' }}>
                        <h4>Análisis de emociones en comentarios</h4>
                        <BarChart
                            width={700}
                            height={400}
                            data={dataemojis}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Alegría" fill="#E0AD30" >
                                <LabelList dataKey="date" content={r => renderCustomizedLabel(r, dataemojis, "emojiAlegría", "#E0AD30")} />
                            </Bar>
                            <Bar dataKey="Tristeza" fill="#1e2835" >
                                <LabelList dataKey="date" content={r => renderCustomizedLabel(r, dataemojis, "emojiTristeza", "#8EC3E0")} />
                            </Bar>
                            <Bar dataKey="Ira" fill="#ec6e1a" >
                                <LabelList dataKey="date" content={r => renderCustomizedLabel(r, dataemojis, "emojiIra", "#ec6e1a")} />
                            </Bar>
                            <Bar dataKey="Disgusto" fill="#72ac45" >
                                <LabelList dataKey="date" content={r => renderCustomizedLabel(r, dataemojis, "emojiDisgusto", "#72ac45")} />
                            </Bar>
                            <Bar dataKey="Temor" fill="#8EC3E0" >
                                <LabelList dataKey="date" content={r => renderCustomizedLabel(r, dataemojis, "emojiTemor", "#8EC3E0")} />
                            </Bar>
                        </BarChart>
                    </Box>
                </div>
            </Box>

        </Layout>
    );
}

export default Dashboard;