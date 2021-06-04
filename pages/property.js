import React, { useState, useContext, useEffect } from 'react';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTableCRUD2';
import PropertyModal from '../components/property/propertymain';
import triggeraxios from '../config/axiosv2';
import popupsContext from '../context/pop-ups/pop-upsContext';

import IconButton from '@material-ui/core/IconButton';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@material-ui/icons';

const selproperty = {
    method: "SP_SEL_PROPERTIES",
    data: {
        name: null,
        status: 'ACTIVO'
    }
}

const Property = () => {
    const { setloadingglobal, setModalQuestion, setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);

    const [openModal, setOpenModal] = useState(false);
    const [datatable, setdatatable] = useState([]); 
    const [rowselected, setrowselected] = useState(null);

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
                Header: 'Propiedad',
                accessor: 'name',
                type: 'string',
            },
            {
                Header: 'Valor',
                accessor: 'value',
                type: 'string',
            },
            {
                Header: "",
                accessor: "deletedetail",
                isComponent: true,
                Cell: props => (
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
            },
        ],
        []
    );
    
    const fetchData = React.useCallback(async () => {
        setloadingglobal(true);
       
        const res = await triggeraxios('post', '/api/web/main/', selproperty)
        if (res.success) {
            if (res.result.data instanceof Array) 
                setdatatable(res.result.data);
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
            const datatosend = {
                method: "SP_INS_PROPERTIES",
                data: {
                    ...row,
                    status: 'ELIMINADO'
                }
            }

            setOpenBackdrop(true);
            const res = await triggeraxios('post', '/api/web/main', datatosend);
            if (res.success) {
                setOpenSnackBack(true, { success: true, message: 'La propiedad se eliminó satisfactoriamente.' });
                fetchData();
            } else {
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });
            }

            setOpenBackdrop(false)
        }

        setModalQuestion({ visible: true, question: `¿Está seguro de eliminar la propiedad ${row.name}?`, callback })
    }

    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Propiedades'
                data={datatable}
                fetchData={fetchData}
                register={true}
                selectrow={selectrow}
            />
            <PropertyModal 
                title="Propiedad"
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchData={fetchData}
                rowselected={rowselected}
            />
        </Layout>
    );
}
 
export default Property;