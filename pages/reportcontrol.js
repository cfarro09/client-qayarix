import React, { useState, useContext, useEffect } from 'react';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
import DateRange from '../components/form/daterange';
import Button from '@material-ui/core/Button';
import ButtonExport from '../components/form/buttonexport';
import Fab from '@material-ui/core/Fab';
import GetAppIcon from '@material-ui/icons/GetApp';
// import LoadMassiveMain from '../components/loadmassive/loadmassivemain';
import { validateres } from '../config/helper';
const LoadMassive = () => {
    const { setOpenSnackBack, setOpenBackdrop } = useContext(popupsContext);

    const [datatable, setdatatable] = useState([]);
    const [dateRange, setdateRange] = useState([
        {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);

    const handleexport = async () => {
        const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
        const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
        if (startdate) {
            const datarequest = {
                desde: startdate,
                hasta: enddate,
                type: 'DISTRIBUCION'
            };
            setOpenBackdrop(true);
            await triggeraxios('post', '/api/web/reportes/control/', datarequest).then(r => {
                if (r.success) {
                    window.open(r.result.data.reporte);
                } else
                    setOpenSnackBack(true, { success: false, message: 'Hubo un error, intentelo mas tarde.' });
            })
            setOpenBackdrop(false);
        }
    }

    const columns = React.useMemo(
        () => [

            {
                Header: 'CLIENTE',
                accessor: 'cliente'
            },
            {
                Header: 'CODIGO_BARRA',
                accessor: 'codigo_barra'
            },
            {
                Header: 'CODIGO_SEGUIMIENTO',
                accessor: 'codigo_seguimiento'
            },
            {
                Header: 'NRO_GUIA',
                accessor: 'nro_guia'
            },
            {
                Header: 'FECHA_PROMESA',
                accessor: 'fecha_promesa'
            },
            {
                Header: 'ESTADO_PEDIDO',
                accessor: 'estado_pedido'
            },
            {
                Header: 'FECHA_PEDIDO',
                accessor: 'fecha_pedido'
            },
            {
                Header: 'HORA_PEDIDO',
                accessor: 'hora_pedido'
            },
            {
                Header: 'FECHA_ENVIO',
                accessor: 'fecha_envio'
            },
            {
                Header: 'NOMBRE_CONDUCTOR',
                accessor: 'nombre_conductor'
            },
            {
                Header: 'TIPO_VEHICULO',
                accessor: 'tipo_vehiculo'
            },
            {
                Header: 'NRO_PLACA',
                accessor: 'nro_placa'
            },
            {
                Header: 'PROVEEDOR',
                accessor: 'proveedor'
            },
            {
                Header: 'ULTIMO_ESTADO',
                accessor: 'ultimo_estado'
            },
            {
                Header: 'NOMBRE_CLIENTE',
                accessor: 'nombre_cliente'
            },
            {
                Header: 'TELEFONO_1',
                accessor: 'telefono_1'
            },
            {
                Header: 'TELEFONO_2',
                accessor: 'telefono_2'
            },
            {
                Header: 'DIRECCION',
                accessor: 'direccion'
            },
            {
                Header: 'DEPARTAMENTO',
                accessor: 'departamento'
            },
            {
                Header: 'DISTRITO',
                accessor: 'distrito'
            },
            {
                Header: 'PROVINCIA',
                accessor: 'provincia'
            },
            {
                Header: 'TIPO_ZONA',
                accessor: 'tipo_zona'
            },
            {
                Header: 'FECHA_ASIGNADO',
                accessor: 'fecha_asignado'
            },
            {
                Header: 'ULTFECHA_ESTADO',
                accessor: 'ultfecha_estado'
            },
            {
                Header: 'ESTADO_DE_DESCARGA',
                accessor: 'estado_de_descarga'
            },
            {
                Header: 'OBSERVACIONES',
                accessor: 'observaciones'
            },
            {
                Header: 'FECHA_VISITA1',
                accessor: 'fecha_visita1'
            },
            {
                Header: 'RESULTADO_1',
                accessor: 'resultado_1'
            },
            {
                Header: 'FECHA_VISITA2',
                accessor: 'fecha_visita2'
            },
            {
                Header: 'RESULTADO_2',
                accessor: 'resultado_2'
            },
            {
                Header: 'FECHA_VISITA3',
                accessor: 'fecha_visita3'
            },
            {
                Header: 'RESULTADO_3',
                accessor: 'resultado_3'
            },
            {
                Header: 'CANTIDAD_VISITAS',
                accessor: 'cantidad_visitas'
            },
            {
                Header: 'NRO_IMAGENES',
                accessor: 'nro_imagenes'
            },

        ],
        []
    );
    

    const fetchData = async () => {
        const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
        const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
        if (startdate) {
            const datarequest = {
                method: 'SP_REPORTE_CONTROL',
                data: {
                    desde: startdate,
                    hasta: enddate,
                    type: 'DISTRIBUCION'
                }
            };
            setOpenBackdrop(true);
            await triggeraxios('post', '/api/web/main/', datarequest).then(r => setdatatable(validateres(r, true)))
            setOpenBackdrop(false);
        }
    };

    return (
        <Layout>
            <TableZyx
                columns={columns}
                data={datatable}
                titlemodule="Reporte de Control"
                HeadComponent={() =>
                    <div style={{ width: '100%' }}>
                        <DateRange
                            label="Filtrar Rango de Fecha"
                            dateRangeinit={dateRange}
                            setDateRangeExt={setdateRange}
                        />
                        <Button
                            color="secondary"
                            style={{marginLeft: '1rem'}}
                            variant="contained"
                            onClick={fetchData}
                        >
                            BUSCAR
                        </Button>
                        <div className="col-3"></div>

                        <div className="col-3" style={{ textAlign: 'right' }}>
                            <Fab
                                size="small"
                                aria-label="add"
                                color="primary"
                                onClick={handleexport}
                                disabled={!dateRange[0]?.startDate}
                            >
                                <GetAppIcon size="small" color="action" />
                            </Fab>
                        </div>

                    </div>}
                register={false}
                pageSizeDefault={20}
            />
        </Layout>
    );
}

export default LoadMassive;