import React, { useEffect, useContext, useState, useCallback } from 'react';
import TableVirtualized from '../../hooks/useTableVirtualized';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import triggeraxios from '../../config/axiosv2';
import assignmentContext from '../../context/assignment/assignmentContext';

const SelectVehicle = ({ openModal, setOpenModal, title, setdriver }) => {

    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);

    const [datagrid, setdatagrid] = useState([]);
    const [vehicle, setvehicle] = useState(null);
    const columnsVehicles = React.useMemo(
        () => [
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
            },
        ],
        []
    );
    const loaddetail = useCallback(async ({ continuezyx = true }) => {
        const datatosend = {
            method: "SP_VEHICLE_DRIVER",
            data: {}
        }
        setloadingglobal(true)
        const res = await triggeraxios('post', '/api/web/main/', datatosend)
        setloadingglobal(false)
        if (res.success && continuezyx) {
            setdatagrid(res.result.data.map(x => {
                return { ...x, status: 'PENDIENTE' }
            }));
        }
    }, [])

    useEffect(() => {
        setdatagrid([]);
        let continuezyx = true;
        loaddetail({ continuezyx })

        return () => continuezyx = false;
    }, []);

    useEffect(() => {
        if (openModal) {
            setvehicle(null)
        }
    }, [openModal])

    const handleclick = (v) => {
        setvehicle(v)
    }

    const handlerUpdateDriver = () => {
        if (vehicle){
            setdriver({...vehicle, drivername: vehicle.fullname})
        }
        setOpenModal(false);
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
                    columns={columnsVehicles}
                    keycheck="id_vehicle"
                    data={datagrid}
                    onlyrow={true}
                    selectOnlyRow={handleclick}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    color="primary"
                    onClick={handlerUpdateDriver}
                >
                    GUARDAR
                </Button>
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

export default SelectVehicle;