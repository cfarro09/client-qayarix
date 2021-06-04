import React, { useState, useContext, useEffect } from 'react';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTableCRUD';
import UserModal from '../components/user/usermain';
import triggeraxios from '../config/axiosv2';
import popupsContext from '../context/pop-ups/pop-upsContext';

const User = () => {

    const { setloadingglobal, setModalQuestion, setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);

    const [openModal, setOpenModal] = useState(false);
    const [datatable, setdatatable] = useState([]); 
    const [rowselected, setrowselected] = useState(null);

    const columns = React.useMemo(
        () => [
            {
                Header: 'NOMBRE',
                accessor: 'first_name',
                type: 'string',
            },
            {
                Header: 'APELLIDO',
                accessor: 'last_name',
                type: 'string',
            },
            {
                Header: 'USUARIO',
                accessor: 'username',
                type: 'string',
            },
            {
                Header: 'CORREO ELECTRONICO',
                accessor: 'user_email',
                type: 'string',
            },
            {
                Header: 'TIPO DOC',
                accessor: 'doc_type',
                type: 'string',
            },
            {
                Header: 'ROL',
                accessor: 'role_name',
                type: 'string',
            },
            {
                Header: 'N° DOC',
                accessor: 'doc_number',
                type: 'string',
            },
            {
                Header: 'ESTADO',
                accessor: 'status',
                type: 'string',
            },
        ],
        []
    );
    
    const fetchData = React.useCallback(async () => {
        setloadingglobal(true);
        const datatosend = {
            method: "SP_SEL_USER",
            data: {
                status: null
            }
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

    const deleteuser = (row) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_INS_USER",
                header: {
                    data: {
                        ...row,
                        password: '',
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

        setModalQuestion({ visible: true, question: `¿Está seguro de de borrar al usuario ${row.user_email}?`, callback })
    }

    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Usuarios'
                data={datatable}
                fetchData={fetchData}
                register={true}
                setOpenModal={setOpenModal}
                selectrow={selectrow}
                deleterow={deleteuser}
            />
            <UserModal 
                title="Usuario"
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchDataUser={fetchData}
                rowselected={rowselected}
            />
        </Layout>
    );
}
 
export default User;