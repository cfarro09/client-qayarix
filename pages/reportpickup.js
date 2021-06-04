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
                Header: 'fecha_pedido',
                accessor: 'fecha_pedido'
            },
            {
                Header: 'cliente',
                accessor: 'cliente'
            },
            {
                Header: 'nro_placa',
                accessor: 'nro_placa'
            },
            {
                Header: 'address',
                accessor: 'address'
            },
            {
                Header: 'seg_code',
                accessor: 'seg_code'
            },
            // {
            //     Header: 'tipo_servicio',
            //     accessor: 'tipo_servicio'
            // },
            {
                Header: 'client_name',
                accessor: 'client_name'
            },
            {
                Header: 'salida_cd',
                accessor: 'salida_cd'
            },
            {
                Header: 'llegada_cliente',
                accessor: 'llegada_cliente'
            },
            {
                Header: 'cumplimiento',
                accessor: 'cumplimiento'
            },
            {
                Header: 'observaciones',
                accessor: 'observaciones'
            },
            {
                Header: 'estado',
                accessor: 'estado'
            },
            {
                Header: 'fotos',
                accessor: 'fotos'
            },

        ],
        []
    );

    
    const fetchData = async () => {
        const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
        const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
        if (startdate) {
            const datarequest = {
                method: 'SP_REPORTE_RECOLECCION',
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

    return (
        <Layout>
            <TableZyx
                columns={columns}
                data={datatable}
                titlemodule="Reporte Recoleccion"
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