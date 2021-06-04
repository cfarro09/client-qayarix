import React, { useEffect, useContext, useState, useCallback } from 'react';
import TableVirtualized from '../../hooks/useTableVirtualized';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import triggeraxios from '../../config/axiosv2';

const datatosend = (type) => ({
    method: "SP_SEL_GUIDES",
    data: { type: type }
})

const AddGuide = ({ openModal, setOpenModal, title, datatable, setdatatable, type }) => {

    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);

    const [datagrid, setdatagrid] = useState([]);

    const columnsgrid = React.useMemo(
        () => [
            {
                Header: 'COD BARRAS CLIENTE',
                accessor: 'client_barcode'
            },
            {
                Header: 'NOMBRE CLIENTE',
                accessor: 'client_name'
            },
            {
                Header: 'DEPARTAMENTO',
                accessor: 'department'
            },
            {
                Header: 'PROVINCIA',
                accessor: 'province'
            },
            {
                Header: 'DISTRITO',
                accessor: 'district'
            },
            {
                Header: 'DIRECCIÓN',
                accessor: 'address'
            },
            {
                Header: 'COD SEGUIMIENTO',
                accessor: 'seg_code'
            },
            {
                Header: 'ESTADO',
                accessor: 'status'
            },
        ],
        []
    );

    const loaddetail = useCallback(async ({ continuezyx = true }) => {
        setloadingglobal(true)
        const res = await triggeraxios('post', '/api/web/main/', datatosend(type || "DISTRIBUCION"));
        setloadingglobal(false)
        if (res.success && continuezyx) {
            setdatagrid(res.result.data);
        }
    }, [])

    useEffect(() => {
        setdatagrid([]);
        let continuezyx = true;
        loaddetail({ continuezyx })

        return () => continuezyx = false;
    }, [])

    const processSelected = (rows) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const guides = datagrid.filter(x =>  rows.includes(x.id_guide)).map(x => ({...x, operation: 'ASIGNAR', id_shipping_order_detail: 0}));
            setdatatable([...datatable, ...guides]);
            setdatagrid(datagrid.filter(x => !rows.includes(x.id_guide)))
            setOpenModal(false);
        }
        setModalQuestion({ visible: true, question: `¿Está seguro de agregar las ${rows.length} guias?`, callback })
    }

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth='md'
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <TableVirtualized
                    titlemodule="Agregar Guia"
                    columns={columnsgrid}
                    keycheck="id_guide"
                    data={datagrid}
                    processSelected={processSelected}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    color="secondary"
                    style={{ marginLeft: '1rem' }}
                    onClick={() => setOpenModal(false)}
                >
                    Cerrar
                        </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddGuide;