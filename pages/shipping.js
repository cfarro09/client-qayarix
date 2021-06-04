import React, { useState, useContext } from 'react';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
// import DescriptionIcon from '@material-ui/icons/Description';
import ShippingMain from '../components/shipping/shippingmain';
import IconButton from '@material-ui/core/IconButton';

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Description as DescriptionIcon
} from '@material-ui/icons';
// import LoadMassiveMain from '../components/loadmassive/loadmassivemain';

const LoadMassive = () => {
    const { setloadingglobal, setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);
    const [openModal, setopenModal] = useState(false);
    const [rowselected, setrowselected] = useState(null);

    const [datatable, setdatatable] = useState([]);

    const exportpdf = async (row) => {
        setOpenBackdrop(true);
        const res = await triggeraxios('post', '/api/web/shipping/print/hoja_ruta', { id_shipping_order: row.id_shipping_order })
        if (res.success) {
            window.open(res.result.data.hoja_ruta);
        } else {
            setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' })
        }
        setOpenBackdrop(false)
    }

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "exportpdf",
                isComponent: true,
                Cell: props => {
                    if (props.cell.row.original.status === 'RECHAZADO')
                        return null;
                    return (
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => exportpdf(props.cell.row.original)}
                        >
                            <DescriptionIcon
                                fontSize="inherit"
                                size="small"
                            />
                        </IconButton>
                    )
                }
            },
            {
                Header: "",
                accessor: "editdetail",
                isComponent: true,
                Cell: props => {
                    return (
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                                setopenModal(true);
                                setrowselected(props.cell.row.original);
                            }}
                        >
                            <EditIcon
                                fontSize="inherit"
                                size="small"
                            />
                        </IconButton>
                    )
                }
            },
            {
                Header: 'ID OFERTA',
                accessor: 'id_shipping_order'
            },
            {
                Header: 'CUADRANTE',
                accessor: 'quadrant_name'
            },
            {
                Header: 'PROVEEDOR',
                accessor: 'provider_name'
            },
            {
                Header: 'CONDUCTOR',
                accessor: 'drivername'
            },

            {
                Header: 'PLACA VEHICULO',
                accessor: 'plate_number'
            },
            {
                Header: 'N° GUIAS',
                accessor: 'nro_guias',
                type: 'number'
            },
            {
                Header: 'N° BULTOS',
                accessor: 'number_guides',
                type: 'number'
            },
            {
                Header: 'ESTADO',
                accessor: 'status'
            },
            {
                Header: 'FECHA CREACION',
                accessor: 'date_created'
            },
            {
                Header: 'REGISTRADO POR',
                accessor: 'created_by'
            },
            {
                Header: "",
                accessor: "deletedetail",
                isComponent: true,
                Cell: props => {
                    if (['CURSO', 'FINALIZADO'].includes(props.cell.row.original.status))
                        return null;
                    return (
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => deleterow(props.cell.row.original)}
                        >
                            <DeleteIcon
                                fontSize="inherit"
                                size="small"
                            />
                        </IconButton>
                    )
                }
            },
        ],
        []
    );

    const deleterow = (row) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_ELIMINAR_ENVIO",
                data: { id_shipping_order: row.id_shipping_order }
            }

            setOpenBackdrop(true);
            const res = await triggeraxios('post', '/api/web/main', dattosend);
            if (res.success) {
                setOpenSnackBack(true, { success: true, message: 'Carga eliminada satisfactoriamente.' });
                fetchData();
            } else 
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });

            setOpenBackdrop(false)
        }

        setModalQuestion({ visible: true, question: `¿Está seguro de eliminar el registro?`, callback })
    }

    const fetchData = React.useCallback(async () => {
        setloadingglobal(true);
        const datatosend = {
            method: "SP_SEL_SHIPPING_ORDERS",
            data: { status: null, type: "DISTRIBUCION" }
        }
        const res = await triggeraxios('post', '/api/web/main/', datatosend)
        if (res.success) {
            if (res.result.data instanceof Array)
                setdatatable(res.result.data.map(x => ({ ...x, deletedetail: '', exportpdf: '', editdetail: '', drivername: `${x.first_name} ${x.last_name}` })));
            else
                console.error("Result is not array");
        }
        setloadingglobal(false)
    }, []);

    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Envíos'
                data={datatable}
                fetchData={fetchData}
                register={false}
            />
            <ShippingMain
                title="Envio"
                typeofi={"DISTRIBUCION"}
                openModal={openModal}
                rowselected={rowselected}
                setOpenModal={setopenModal}
                fetchData={fetchData}
            />
        </Layout>
    );
}

export default LoadMassive;