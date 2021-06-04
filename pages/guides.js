import React, { useState, useContext } from 'react';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTable';
import popupsContext from '../context/pop-ups/pop-upsContext';
import triggeraxios from '../config/axiosv2';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from "@material-ui/core/Tooltip";

import ChangeStatusMain from '../components/guide/changestatus';

import {
    Delete as DeleteIcon,
    Build as BuildIcon
} from '@material-ui/icons';

const ITEM_HEIGHT = 48;

const Home = () => {
    const { setloadingglobal, setOpenBackdrop, setModalQuestion, setOpenSnackBack } = useContext(popupsContext);

    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);

    const [rowselected, setrowselected] = useState(null);
    const [loading, setloading] = useState(true);
    const [datafetch, setdatafetch] = useState({})
    const [datatable, setdatatable] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);

    const changestatus = (r) => {
        setrowselected(r);
        setOpenModalChangeStatus(true);
    }

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "id_guide",
                isComponent: true,
                Cell: props => {
                    if (props.cell.row.original.status !== 'PENDIENTE')
                        return null;

                    return (
                        <Tooltip title="Eliminar Guia">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => {
                                    removeguide(props.cell.row.original.id_guide);
                                }}
                            >
                                <DeleteIcon
                                    fontSize="inherit"
                                    size="small"
                                />
                            </IconButton>
                        </Tooltip>
                    )
                }
            },
            {
                Header: "",
                accessor: "id_massive_load",
                isComponent: true,
                Cell: props => {
                    if (props.cell.row.original.status === 'PENDIENTE')
                        return null;
                    const { status } = props.cell.row.original;
                    const [anchorEl, setAnchorEl] = React.useState(null);
                    const open = Boolean(anchorEl);
                    const handleClick = (event) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const handleClose = () => {
                        setAnchorEl(null);
                    };
                    return (
                        <>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size="small"
                                onClick={handleClick}
                            >
                                <BuildIcon
                                    fontSize="inherit"
                                    size="small"
                                />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                    },
                                }}
                            >
                                {(status === "ASIGNADO" || status === "CURSO") &&
                                    <MenuItem onClick={() => unassignguide(props.cell.row.original.id_guide)}>
                                        Desasignar
                                    </MenuItem>
                                }
                                {(["ENTREGADO", "NO ENTREGADO", "RECOLECCION COMPLETA", "NO RECOLECTADO", "RECOLECCION PARCIAL"].includes(status.toUpperCase())) &&
                                    <MenuItem onClick={() => changestatus(props.cell.row.original)}>
                                        Cambiar Estado
                                    </MenuItem>
                                }

                            </Menu>
                        </>
                    )
                }
            },
            {
                Header: 'N° Guia',
                accessor: 'guide_number'
            },
            {
                Header: 'N° Orden',
                accessor: 'order_number'
            },
            {
                Header: 'Cod Seguimiento',
                accessor: 'seg_code'
            },
            {
                Header: 'Cod. Alternativo',
                accessor: 'alt_code1'
            },
            {
                Header: 'Cod. Alternativo 2',
                accessor: 'alt_code2'
            },
            {
                Header: 'Fecha Cliente',
                accessor: 'client_date'
            },
            {
                Header: 'Cod barras Cliente',
                accessor: 'client_barcode'
            },
            {
                Header: 'Fecha Cliente 2',
                accessor: 'client_date2'
            },
            {
                Header: 'Peso total',
                accessor: 'total_weight'
            },
            {
                Header: 'Total Piezas',
                accessor: 'total_pieces'
            },
            {
                Header: 'DNI Cliente',
                accessor: 'client_dni'
            },
            {
                Header: 'Nombre Cliente',
                accessor: 'client_name'
            },
            {
                Header: 'Telefono Cliente',
                accessor: 'client_phone1'
            },
            {
                Header: 'Teléfono Cliente 2',
                accessor: 'client_phone2'
            },
            {
                Header: 'Teléfono Cliente 3',
                accessor: 'client_phone3'
            },
            {
                Header: 'Correo Cliente',
                accessor: 'client_email'
            },
            {
                Header: 'Estado',
                accessor: 'status'
            },
            {
                Header: 'Tipo',
                accessor: 'type'
            },
            {
                Header: 'Intento',
                accessor: 'attempt'
            },
            {
                Header: 'Creado por',
                accessor: 'created_by'
            },
            {
                Header: 'Fecha creado',
                accessor: 'date_created'
            },
            {
                Header: 'Modificado por',
                accessor: 'modified_by'
            },
            {
                Header: 'Fecha actualizada',
                accessor: 'date_updated'
            },
            {
                Header: 'Integración reportada',
                accessor: 'reportado_integracion'
            },
            {
                Header: 'Organización',
                accessor: 'org_name'
            },
            {
                Header: 'Dirección',
                accessor: 'address'
            },
            {
                Header: 'Deparatmento',
                accessor: 'department'
            },
            {
                Header: 'Provincia',
                accessor: 'province'
            },
            {
                Header: 'Distrito',
                accessor: 'district'
            },
        ],
        []
    );

    const removeguide = (id_guide) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_ELIMINAR_GUIA",
                data: { id_guide }
            }

            setOpenBackdrop(true);
            const res = await triggeraxios('post', '/api/web/main', dattosend);
            if (res.success) {
                setOpenSnackBack(true, { success: true, message: 'Guia eliminada satisfactoriamente.' });
                fetchData(datafetch);
            } else
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });

            setOpenBackdrop(false)
        }
        setModalQuestion({ visible: true, question: `¿Está seguro de eliminar la guia?`, callback })
    }

    const unassignguide = (id_guide) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_DESASIGNAR_GUIA",
                data: { id_guide }
            }

            setOpenBackdrop(true);
            const res = await triggeraxios('post', '/api/web/main', dattosend);
            if (res.success) {
                setOpenSnackBack(true, { success: true, message: 'Guia desasignada satisfactoriamente.' });
                fetchData(datafetch);
            } else
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });

            setOpenBackdrop(false)
        }
        setModalQuestion({ visible: true, question: `¿Está seguro de deasignar la guia?`, callback })
    }

    const updateData = () => {
        fetchData(datafetch);
    }

    const fetchData = React.useCallback(({ pageSize, pageIndex, filters, sorts, daterange }) => {
        setloadingglobal(true);
        setdatafetch({ pageSize, pageIndex, filters, sorts, daterange })
        const datatosend = {
            methodcollection: "SP_SEL_GUIDES_P",
            methodcount: "SP_SEL_GUIDES_PCOUNT",
            take: pageSize,
            skip: pageIndex,
            filters,
            sorts,
            origin: 'guide',
            daterange,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }

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
    }, []);

    return (
        <Layout>
            <TableZyx
                columns={columns}
                data={datatable}
                totalrow={totalrow}
                filterrange={true}
                loading={loading}
                pageCount={pageCount}
                fetchData={fetchData}
                titlemodule='Pedidos' 
            />
            <ChangeStatusMain
                title="Cambiar estado"
                openModal={openModalChangeStatus}
                setOpenModal={setOpenModalChangeStatus}
                rowselected={rowselected}
                fetchData={updateData}
            />
        </Layout>
    );
}

export default Home;