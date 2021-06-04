import React, { useState, useContext } from 'react';
import triggeraxios from '../config/axiosv2';
import TableZyx from '../hooks/useTableCRUD2';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Layout from '../components/layout/layout';
import TemplateModal from '../components/viewtemplate/templatemain';
import IconButton from '@material-ui/core/IconButton';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@material-ui/icons';

const Template = () => {

    const { setloadingglobal, setModalQuestion } = useContext(popupsContext);

    const [openModal, setOpenModal] = useState(false);
    const [rowselected, setrowselected] = useState(null);
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
            {
                Header: 'FECHA CREACION',
                accessor: 'date_created'
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

    const deleterow = React.useCallback(async (row) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const datatosend = {
                method: "SP_INS_TEMPLATE",
                data: {
                    ...row,
                    status: 'ELIMINADO'
                }
            }
            setloadingglobal(true)
            await triggeraxios('post', '/api/web/main', datatosend);
            fetchData({});
            setloadingglobal(false);
        }

        setModalQuestion({ visible: true, question: `¿Está seguro de eliminar el registro?`, callback })
    })

    const fetchData = React.useCallback(async () => {
        setloadingglobal(true);
        const datatosend = {
            method: "SP_SEL_TEMPLATE",
            data: { status: null, type: null }
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

    return (
        <Layout>
            <TableZyx
                columns={columns}
                titlemodule='Plantillas de Carga'
                data={datatable}
                fetchData={fetchData}
                register={true}
                selectrow={selectrow}
            />
            <TemplateModal
                title="Plantilla"
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchDataUser={fetchData}
                rowselected={rowselected}
            />
        </Layout>
    );
}

export default Template;