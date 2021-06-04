import React, { useState, useContext } from 'react';
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
                Header: 'NRO GUIA',
                accessor: 'guide_number'
            },

            {
                Header: 'FECHA PEDIDO',
                accessor: 'fecha_guia'
            },

            {
                Header: 'ULT ESTADO',
                accessor: 'ult_estado'
            },

            {
                Header: 'FECHA ASIGNADO',
                accessor: 'fecha_asignado'
            },

            {
                Header: 'ESTADO ENVIO',
                accessor: 'envio_estado'
            },

            {
                Header: 'ESTADO PEDIDO',
                accessor: 'detalle_estado'
            },

            {
                Header: 'OBSERVACIONES',
                accessor: 'observaciones'
            },


        ],
        []
    );

    const fetchData = async () => {
        const startdate = dateRange.length > 0 ? dateRange[0].startDate : "";
        const enddate = dateRange.length > 0 ? dateRange[0].endDate : "";
        if (startdate) {
            const datarequest = {
                method: 'SP_REPORTE_TORRE_CONTROL',
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
                titlemodule="Reporte Torre Control"
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