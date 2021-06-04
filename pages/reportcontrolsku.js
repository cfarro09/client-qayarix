import React, { useState, useContext, useEffect } from 'react';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
import DateRange from '../components/form/daterange';
import Button from '@material-ui/core/Button';
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
                Header: 'CLIENTE',
                accessor: 'org_name'
            },
            {
                Header: 'BARRA',
                accessor: 'client_barcode'
            },
            {
                Header: 'CUD',
                accessor: 'seg_code'
            },
            {
                Header: 'NUMERO GUIA',
                accessor: 'guide_number'
            },
            {
                Header: 'CODIGO SKU',
                accessor: 'sku_code'
            },
            {
                Header: 'SKU DESCRIPCION',
                accessor: 'sku_description'
            },
            {
                Header: 'FECHA PEDIDO',
                accessor: 'fecha_guia'
            },
            {
                Header: 'FECHA ENVIO',
                accessor: 'fecha_envio'
            },
            {
                Header: 'NOMBRE CONDUCTOR',
                accessor: 'driver_name'
            },
            {
                Header: 'TIPO VEHICULO',
                accessor: 'vehicle_type'
            },
            {
                Header: 'PLACA',
                accessor: 'plate_number'
            },
            {
                Header: 'PROVEEODR',
                accessor: 'provider'
            },
            {
                Header: 'ESTADO ENVIO',
                accessor: 'estado_envio'
            },
            {
                Header: 'DESTINATARIO',
                accessor: 'client_name'
            },
            {
                Header: 'TELEFONO 1',
                accessor: 'client_phone1'
            },
            {
                Header: 'TELEFONO 2',
                accessor: 'client_phone2'
            },
            {
                Header: 'DIRECCION',
                accessor: 'address'
            },
            {
                Header: 'DEPARTAMENTO',
                accessor: 'department'
            },
            {
                Header: 'DISTRITO',
                accessor: 'district'
            },
            {
                Header: 'PROVINCIA',
                accessor: 'province'
            },
            {
                Header: 'TIPO ZONA',
                accessor: 'zone_type'
            },
            {
                Header: 'FECHA ASIGNADO',
                accessor: 'fecha_asignado'
            },
            {
                Header: 'ULTFECHA ESTADO',
                accessor: 'ultfecha_estado'
            },
            {
                Header: 'ULT ESTADO',
                accessor: 'ult_estado'
            },
            {
                Header: 'OBSERVACIONES',
                accessor: 'motive'
            },
            {
                Header: 'VISITA 1',
                accessor: 'fecha_visita1'
            },
            {
                Header: 'RESULTADO 1',
                accessor: 'visita1_status'
            },
            {
                Header: 'VISITA 2',
                accessor: 'fecha_visita2'
            },
            {
                Header: 'RESULTADO 2',
                accessor: 'visita2_status'
            },
            {
                Header: 'VISITA 3',
                accessor: 'fecha_visita3'
            },
            {
                Header: 'RESULTADO 3',
                accessor: 'visita3_status'
            },
            {
                Header: 'CANT VISITAS',
                accessor: 'cantidad_visitas'
            },
            {
                Header: 'NRO IMAGENES',
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
                method: 'SP_REPORTE_CONTROL_SKU',
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
                titlemodule="Reporte Control SKU"
                HeadComponent={() =>
                    <div style={{ width: '100%' }}>
                        <DateRange
                            label="Filtrar Rango de Fecha"
                            dateRangeinit={dateRange}
                            setDateRangeExt={setdateRange}
                        />
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{marginLeft: '1rem'}}
                            onClick={fetchData}
                        >
                            BUSCAR
                        </Button>
                        <div className="col-3"></div>
                        {datatable.length > 0 &&
                            <div className="col-3" style={{ textAlign: 'right' }}>
                                <ButtonExport
                                    csvData={datatable}
                                    fileName="controlreport"
                                />
                            </div>
                        }

                    </div>}
                register={false}
                pageSizeDefault={20}
            />
        </Layout>
    );
}

export default LoadMassive;