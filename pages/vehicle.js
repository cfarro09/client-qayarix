import React, { useState, useContext } from 'react';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTableCRUD2';
import VehicleMain from '../components/vehicle/vehiclemain';
import triggeraxios from '../config/axiosv2';
import popupsContext from '../context/pop-ups/pop-upsContext';

import IconButton from '@material-ui/core/IconButton';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
const Vehicle = () => {

    const { setloadingglobal, setModalQuestion, setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);
    const [openModal, setOpenModal] = useState(false);
    const [datatable, setdatatable] = useState([]);
    const [rowselected, setrowselected] = useState(null);

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "editdetail",
                activeOnHover: true,
                Cell: props => {
                    return (
                        <div>
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
                        </div>
                    )
                }
            },
            {
                Header: 'MARCA V.',
                accessor: 'brand'
            },
            {
                Header: 'MODEL V.',
                accessor: 'model'
            },
            {
                Header: 'N° PLACA',
                accessor: 'plate_number'
            },
            {
                Header: 'SOAT V.',
                accessor: 'soat'
            },
            {
                Header: 'TIPO V.',
                accessor: 'vehicle_type'
            },
            {
                Header: 'NOMBRE CHOFER',
                accessor: 'fullname'
            },
            {
                Header: 'N° DOC',
                accessor: 'doc_number'
            },
            {
                Header: 'EMAIL',
                accessor: 'email'
            },
            {
                Header: 'CELULAR',
                accessor: 'phone'
            }

        ],
        []
    );

    const fetchData = React.useCallback(async () => {
        setloadingglobal(true);
        const datatosend = {
            method: "SP_VEHICLE_DRIVER",
            data: { status: null }
        }
        const res = await triggeraxios('post', '/api/web/main/', datatosend)
        if (res.success) {
            if (res.result.data instanceof Array)
                setdatatable(res.result.data.map(x => ({ ...x, editdetail: '', deletedetail: '' })));
            else
                console.error("Result is not array");
        }
        setloadingglobal(false)
    }, []);

    const selectrow = (row) => {
        setOpenModal(true);
        setrowselected(row);
    }
    const deleterow = (row) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_INS_VEHICLE_DRIVER",
                header: {
                    data: {
                        ...row,
                        status: 'ELIMINADO'
                    }
                },
                details: {
                    data: [{
                        ...row,
                        status: 'ELIMINADO'
                    }]
                }
            }

            setOpenBackdrop(true);
            const res = await triggeraxios('post', '/api/web/main/simpleTransaction', dattosend);
            if (res.success) {
                setOpenSnackBack(true, { success: true, message: 'Transacción ejecutada satisfactoriamente.' });
                fetchData();
            } else {
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });
            }

            setOpenBackdrop(false)
        }

        setModalQuestion({ visible: true, question: `¿Está seguro de de borrar el vehiculo?`, callback })
    }
    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Vehiculo - Chofer'
                data={datatable}
                fetchData={fetchData}
                register={true}
                selectrow={selectrow}
            />
            <VehicleMain
                title="Vehiculo - Chofer"
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchDataUser={fetchData}
                rowselected={rowselected}
            />
        </Layout>
    );
}

export default Vehicle;