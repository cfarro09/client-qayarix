import React, { useState, useContext, useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
import DateRange from '../components/form/daterange';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import ButtonExport from '../components/form/buttonexport';
import {
    Edit as EditIcon,
    Description as DescriptionIcon
} from '@material-ui/icons';
// import LoadMassiveMain from '../components/loadmassive/loadmassivemain';
import { validateres } from '../config/helper';
const LoadMassive = () => {
    const { setloadingglobal, setOpenBackdrop } = useContext(popupsContext);

    const [datatable, setdatatable] = useState([]);
    const [dateRange, setdateRange] = useState([
        {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);
    const columns = React.useMemo(
        () => [
            {
                Header: 'Cliente',
                accessor: 'cliente'
            },
            {
                Header: 'N° guia',
                accessor: 'numero_guia'
            },
            {
                Header: 'Fecha promesa',
                accessor: 'fecha_promesa'
            },
            {
                Header: 'Estado pedido',
                accessor: 'estado_pedido'
            },
            {
                Header: 'Fecha pedido',
                accessor: 'fecha_pedido'
            },
            {
                Header: 'Hora pedido',
                accessor: 'hora_pedido'
            },
            {
                Header: 'Fecha envío',
                accessor: 'fecha_envio'
            },
            {
                Header: 'Conductor',
                accessor: 'nombre_conductor'
            },
            {
                Header: 'Vehiculo',
                accessor: 'tipo_vehiculo'
            },
            {
                Header: 'Placa',
                accessor: 'nro_placa'
            },
            {
                Header: 'Proveedor',
                accessor: 'proveedor'
            },
            {
                Header: 'Último estado',
                accessor: 'ultimo_estado'
            },
            {
                Header: 'Cliente',
                accessor: 'nombre_cliente'
            },
            {
                Header: 'Teléfono 1',
                accessor: 'telefono_1'
            },
            {
                Header: 'Teléfono 2',
                accessor: 'telefono_2'
            },
            {
                Header: 'Dirección',
                accessor: 'direccion'
            },
            {
                Header: 'Departamento',
                accessor: 'departamento'
            },
            {
                Header: 'Distrito',
                accessor: 'distrito'
            },
            {
                Header: 'Provincia',
                accessor: 'provincia'
            },
            {
                Header: 'Fecha asignado',
                accessor: 'fecha_asignado'
            },
            {
                Header: 'Ult fecha estado',
                accessor: 'ultfecha_estado'
            },
            {
                Header: 'Estado descarga',
                accessor: 'estado_descarga'
            },
            {
                Header: 'Observaciones',
                accessor: 'observaciones'
            },
            {
                Header: 'Visita',
                accessor: 'visita'
            },
        ],
        []
    );

    const fetchData = async () => {
        const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
        const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
        if (startdate) {
            const datarequest = {
                method: 'SP_REPORTE_ASIGNACION_POR_GUIA',
                data: {
                    desde: startdate,
                    hasta: enddate,
                    type: 'RECOLECCION'
                }
            };
            setOpenBackdrop(true);
            await triggeraxios('post', '/api/web/main/', datarequest).then(r => setdatatable(validateres(r, true)))
            setOpenBackdrop(false);
        }
    };

    
    
    const handleexport = async () => {
        const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
        const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
        if (startdate) {
            const datarequest = {
                desde: startdate,
                hasta: enddate,
                type: 'RECOLECCION'
            };
            setOpenBackdrop(true);
            await triggeraxios('post', '/api/web/reportes/control_proveedor/', datarequest).then(r => {
                if (r.success) {
                    window.open(r.result.data.reporte);
                } else
                    setOpenSnackBack(true, { success: false, message: 'Hubo un error, intentelo mas tarde.' });
            })
            setOpenBackdrop(false);
        }
    }
    return (
        <Layout>
            <TableZyx
                columns={columns}
                data={datatable}
                titlemodule="Reporte Control Proveedor"
                HeadComponent={() =>
                    <div style={{ width: '100%' }}>
                        <DateRange
                            label="Filtrar Rango de Fecha"
                            dateRangeinit={dateRange}
                            setDateRangeExt={setdateRange}
                        />
                        <Button
                            color="secondary"
                            style={{ marginLeft: '1rem' }}
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