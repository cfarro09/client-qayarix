import React, { useState, useContext } from 'react';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTableCRUD';
import CorporationMain from '../components/corporation/corporationmain';
import triggeraxios from '../config/axiosv2';
import popupsContext from '../context/pop-ups/pop-upsContext';

const Corporation = () => {

    const { setloadingglobal, setModalQuestion, setOpenBackdrop, setOpenSnackBack  } = useContext(popupsContext);

    const [openModal, setOpenModal] = useState(false);
    const [datatable, setdatatable] = useState([]); 
    const [rowselected, setrowselected] = useState(null);

    const columns = React.useMemo(
        () => [
            {
                Header: 'NOMBRE',
                accessor: 'name'
            },
            {
                Header: 'DESCRIPCION',
                accessor: 'description'
            },
            {
                Header: 'ESTADO',
                accessor: 'status'
            },
        ],
        []
    );
    
    const fetchData = React.useCallback(async () => {
        setloadingglobal(true);
        const datatosend = {
            method: "SP_SEL_CORPORATIONS",
            data: { status: null }
        }
        const res = await triggeraxios('post', '/api/web/main/', datatosend)
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
    const deletecorporation = (row) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_INS_CORPORATION",
                header: {
                    data: {
                        ...row,
                        status: 'ELIMINADO'
                    }
                },
                details: {
                    data: []
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

        setModalQuestion({ visible: true, question: `¿Está seguro de de borrar la corporación ${row.name}?`, callback })
    }
    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Mi Corporación'
                data={datatable}
                fetchData={fetchData}
                register={true}
                setOpenModal={setOpenModal}
                selectrow={selectrow}
                deleterow={deletecorporation}
            />
            <CorporationMain
                title="Corporación"
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchDataUser={fetchData}
                rowselected={rowselected}
            />
        </Layout>
    );
}
 
export default Corporation;