import React, { useState, useContext, useEffect, useCallback } from 'react';
import Fab from '@material-ui/core/Fab';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTable';
import popupsContext from '../context/pop-ups/pop-upsContext';
import triggeraxios from '../config/axiosv2';
import { validateres, getDomain } from '../config/helper';
import SelectFunction from '../hooks/useSelectFunction';
import MultiSelectFunction from '../hooks/useMultiSelectFunction';
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import DateRange from '../components/form/daterange';
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
const ITEM_HEIGHT = 48;

const requestproviders = {
    method: "SP_SEL_PROVIDERS",
    data: { status: 'ACTIVO' }
}
const requestvehicles = (id_provider) => ({
    method: "SP_SEL_VEHICLES",
    data: { status: 'ACTIVO', id_provider }
})

const DATATYPES = [
    {
        id: 'DISTRIBUCION',
        description: 'DISTRIBUCION'
    },
    {
        id: 'RECOLECCION',
        description: 'RECOLECCION'
    },
]

const ImageMonitoring = () => {
    const { setloadingglobal, setOpenBackdrop, setModalQuestion, setOpenSnackBack, setLightBox } = useContext(popupsContext);

    const [loading, setloading] = useState(true);
    const [dataProviders, setDataProviders] = useState([]);
    const [dataVehicles, setDataVehicles] = useState([]);
    const [datafetch, setdatafetch] = useState(null);
    const [dateRange, setdateRange] = useState([
        {
            startDate: new Date(new Date().setDate(1)),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);
    const [datatable, setdatatable] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);

    const [triggeraux, settriggeraux] = useState(-2);

    useEffect(() => {
        if (triggeraux !== -2) {
            fetchData(datafetch);
        }
    }, [triggeraux])

    useEffect(() => {
        let continuezyx = true;
        (async () => {
            await Promise.all([
                triggeraxios('post', '/api/web/main/', requestproviders).then(r => setDataProviders(validateres(r, continuezyx)))
            ]);
        })();
        return () => continuezyx = false;
    }, []);
    const [valuefile, setvaluefile] = useState('')

    const callbackProviders = useCallback(({ newValue }) => {
        if (newValue)
            triggeraxios('post', '/api/web/main/', requestvehicles(newValue.id_provider)).then(r => setDataVehicles(validateres(r, true)))
        else
            setDataVehicles([])
    }, [])

    const handleChange = (files, infoguide) => {
        const imagefile = files[0];

        const callback = async () => {
            setModalQuestion({ visible: false });
            setOpenBackdrop(true);
            const formData = new FormData();
            formData.append("imagen", imagefile);
            formData.append("name", imagefile.name);
            formData.append("id_shipping_order", infoguide.id_shipping_order);
            formData.append("guide_number", infoguide.guide_number);
            formData.append("tipo_imagen", "IMAGEN_PD");
            formData.append("descripcion", "image from web");
            const res = await triggeraxios('post', '/api/web/shipping/imagen', formData);
            if (res.success && res.result.success) {
                setOpenSnackBack(true, { success: true, message: 'Imagen guardada satisfactoriamente.' });
                settriggeraux(t => t === -2 ? -1 : t * -1); // to trigger again the filter on header and load the new report with the image
            } else {
                setOpenSnackBack(true, { success: true, message: 'Hubo un error, vuelva a intentarlo mas tarde.' });
            }
            setOpenBackdrop(false);
        }

        setModalQuestion({ visible: true, question: `¿Desea subir la imagen ${imagefile.name} al pedido N° guia: ${infoguide.guide_number}`, callback });

        setvaluefile('');
    }

    const columns = React.useMemo(
        () => [
            {
                Header: "Imágenes",
                accessor: "id_guide",
                isComponent: true,
                Cell: (props) => {
                    const { imagenes } = props.cell.row.original;
                    if (!imagenes)
                        return null;
                    return (
                        <AvatarGroup max={3} onClick={() => setLightBox({ open: true, index: 0, images: imagenes.split(",") })}>
                            {imagenes.split(",").map(image => (
                                <Avatar
                                    key={image}
                                    src={image}
                                    onClick={() => 'hola ' + image}
                                />
                            ))}
                        </AvatarGroup>
                    )
                }
            },
            {
                Header: "",
                accessor: "id_shipping_order",
                isComponent: true,
                Cell: (props) => (
                    <>
                        <input
                            accept="image/*"
                            id={`inputfile-${props.cell.row.original.id_shipping_order}${props.cell.row.original.guide_number}`}
                            type="file"
                            value={valuefile}
                            style={{ display: 'none' }}
                            onChange={(e) => handleChange(e.target.files, props.cell.row.original)}
                        />
                        <label htmlFor={`inputfile-${props.cell.row.original.id_shipping_order}${props.cell.row.original.guide_number}`}>
                            <Tooltip title="Subir imagen">
                                <PublishIcon
                                    style={{ cursor: 'pointer' }}
                                    color="inherit"
                                    fontSize="default"
                                />
                            </Tooltip>
                        </label>
                    </>
                )
            },
            {
                Header: 'Cant imágenes',
                accessor: 'images_count'
            },
            {
                Header: 'N° Guia',
                accessor: 'guide_number'
            },
            {
                Header: 'Estado descarga',
                accessor: 'status'
            },
            {
                Header: 'Placa',
                accessor: 'plate_number'
            },
            {
                Header: 'Proveedor',
                accessor: 'name'
            },
            {
                Header: 'N° visita',
                accessor: 'attempt'
            },
            {
                Header: 'Total visitas',
                NoFilter: true,
                accessor: 'attempts'
            }
        ],
        []
    );

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange, runaux = false }) => {
        if (!datafetch && !runaux) {
            setdatafetch({ pageSize, pageIndex, filters, sorts });
            return null;
        }

        setloadingglobal(true);
        const filtersaux = runaux ? { ...filters } : {
            ...datafetch.filters,
            ...filters,
        }

        if (filtersaux.id_vehicle && !filtersaux.id_vehicle.value)
            delete filtersaux.id_vehicle
        const datatosend = {
            methodcollection: "SP_SEL_IMG_MONITOR",
            methodcount: "SP_SEL_IMG_MONITOR_COUNT",
            take: pageSize,
            skip: pageIndex,
            filters: filtersaux,
            sorts,
            origin: 'img_monitor',
            daterange: runaux ? daterange : datafetch.daterange,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }

        setdatafetch({ pageSize, pageIndex, filters: datatosend.filters, sorts, daterange: datatosend.daterange });

        triggeraxios('post', '/api/web/main/paginated', datatosend).then(res => {
            if (res.success) {
                if (res.result.data.collection instanceof Array) {
                    setdatatable(res.result.data.collection);
                    setPageCount(Math.ceil(res.result.data.count / pageSize));
                    settotalrow(res.result.data.count);
                }
                else
                    console.error("Result is not array");
            }
            setloading(false);
            setloadingglobal(false)
        });
    };
    const handlerExport = async () => {
        if (Object.keys(datafetch.filters).length === 0)
            return null;

        setOpenBackdrop(true)
        const r = await triggeraxios('post', '/api/web/reportes/img_monitor', { ...datafetch, origin: 'img_monitor', });
        if (r.success) {
            window.open(r.result.data.reporte);
        } else
            setOpenSnackBack(true, { success: false, message: 'Hubo un error, intentelo mas tarde.' });
        setOpenBackdrop(false)
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id_provider: 0,
            id_vehicle: '',
            type: 'DISTRIBUCION'
        },
        validationSchema: Yup.object({
            id_provider: Yup.number().min(1),
            type: Yup.string().required('era requerido pero te fuiste!')
        }),
        onSubmit: async values => {
            fetchData({
                pageSize: datafetch.pageSize,
                pageIndex: datafetch.pageIndex,
                sorts: datafetch.sorts,
                runaux: true,
                filters: {
                    ...datafetch.filters,
                    id_provider: {
                        operator: "equals",
                        value: values.id_provider
                    },
                    id_vehicle: {
                        operator: "in",
                        value: values.id_vehicle
                    },
                    type: {
                        operator: "equals",
                        value: values.type
                    }
                },
                daterange: {
                    startDate: dateRange[0].startDate.toISOString().substring(0, 10),
                    endDate: dateRange[0].endDate.toISOString().substring(0, 10)
                }
            })
        }
    });

    return (
        <Layout>
            <form
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <div className="row-zyx">
                    <SelectFunction
                        title="Proveedor"
                        datatosend={dataProviders}
                        classname="col-3"
                        optionvalue="id_provider"
                        optiondesc="name"
                        valueselected={formik.values.id_provider}
                        namefield="id_provider"
                        descfield="name"
                        callback={callbackProviders}
                        formik={formik}
                    />
                    <MultiSelectFunction
                        classname="col-2"
                        title="Placas"
                        datatosend={dataVehicles}
                        optionvalue="id_vehicle"
                        optiondesc="plate_number"
                        namefield="id_vehicle"
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
                    <SelectFunction
                        title="Tipo"
                        datatosend={DATATYPES}
                        classname="col-2"
                        optionvalue="id"
                        optiondesc="description"
                        valueselected={formik.values.type}
                        namefield="type"
                        descfield="description"
                        formik={formik}
                    />
                    <div className="col-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"

                        >
                            BUSCAR
                        </Button>
                        <Tooltip title="Descargar reporte">
                            <Fab
                                size="small"
                                aria-label="add"
                                color="primary"
                                onClick={handlerExport}
                            >
                                <GetAppIcon size="small" color="inherit" />
                            </Fab>
                        </Tooltip>
                    </div>
                </div>
            </form>
            <TableZyx
                columns={columns}
                data={datatable}
                totalrow={totalrow}
                loading={loading}
                pageCount={pageCount}
                fetchData={fetchData}
                titlemodule='Pedidos' />
        </Layout>
    );
}

export default ImageMonitoring;