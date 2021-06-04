import React, { useState, useContext } from 'react';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
import authContext from '../context/auth/authContext';
import { useRouter } from 'next/router'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Description as DescriptionIcon
} from '@material-ui/icons';

const ITEM_HEIGHT = 48;

const LoadMassive = () => {
    const router = useRouter();
    const { user } = useContext(authContext);

    const { setloadingglobal, setOpenBackdrop, setOpenSnackBack, setModalQuestion } = useContext(popupsContext);

    const [datatable, setdatatable] = useState([]);

    const columns = React.useMemo(
        () => [
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
                                selectrow(props.cell.row.original);
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
                Header: "",
                accessor: "exportpdf",
                isComponent: true,
                Cell: props => {
                    if (props.cell.row.original.status === 'PENDIENTE')
                        return null;
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
                                <DescriptionIcon
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
                                <MenuItem onClick={() => handlerReport(props.cell.row.original, 'CARGO')}>
                                    Hoja de Cargo
                                </MenuItem>
                                <MenuItem onClick={() => handlerReport(props.cell.row.original, 'MARATHON')}>
                                    Hoja Etiquetas
                                </MenuItem>
                            </Menu>
                        </>
                    )
                }
            },
            {
                Header: 'ID carga',
                accessor: 'id_massive_load'
            },
            {
                Header: 'REGISTRADO POR',
                accessor: 'created_by'
            },
            {
                Header: 'N° REGISTROS',
                accessor: 'number_records',
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
                Header: "",
                accessor: "deletedetail",
                isComponent: true,
                Cell: props => {
                    if (!user || user.role_name !== "SUPER ADMIN")
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
        [user]
    );
    const deleterow = (row) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_DEL_MASSIVE_LOAD",
                data: { id_massive_load: row.id_massive_load }
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
            method: "SP_SEL_MASSIVE_LOADS",
            data: { type: "RECOLECCION" }
        }
        const res = await triggeraxios('post', '/api/web/main/', datatosend)
        if (res.success) {
            if (res.result.data instanceof Array)
                setdatatable(res.result.data.map(x => ({ ...x, exportpdf: '', editdetail: '', deletedetail: '' })));
            else
                console.error("Result is not array");
        }
        setloadingglobal(false)
    }, []);

    const selectrow = (row) => {
        router.push('/loadmassivepickup/[id]', `/loadmassivepickup/${row.id_massive_load}`)
    }

    const handlerReport = async (row, type) => {
        setOpenBackdrop(true);
        const url = type === "MARATHON" ? '/api/web/massive_load/print/marathon' : '/api/web/massive_load/print/cargo';
        const res = await triggeraxios('post', url, { id_massive_load: row.id_massive_load })
        if (res.success) {
            window.open(res.result.data.hoja_ruta);
        } else {
            setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' })
        }
        setOpenBackdrop(false)
    }

    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Cargas Insertadas'
                data={datatable}
                fetchData={fetchData}
                register={false}
            />
        </Layout>
    );
}

export default LoadMassive;