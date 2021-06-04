import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../form/inputformik';
import UseSelectDomain from '../../hooks/useSelectDomain';
import { useFormik } from 'formik';
import SelectFunction from '../../hooks/useSelectFunction';
import TableZyx from '../../hooks/useTableCRUD';
import TableVirtualized from '../../hooks/useTableVirtualized';
import triggeraxios from '../../config/axiosv2';
// import UserOrganization from './userorganization';
import * as Yup from 'yup';

const FormAux = () => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            barcode: ''
        },
        validationSchema: Yup.object({
            barcode: Yup.string().required('El mensaje es obligatorio')
        }),
        onSubmit: values => {
            console.log(values);
        }
    });
    return (
        <form
            style={{ marginLeft: '6px' }}
            noValidate
            onSubmit={formik.handleSubmit}
        >
            <InputFormk
                classname="col-3"
                name="barcode"
                label="Codigo Barra"
                formik={formik}
            />
            <Button
                type="submit"
                color="secondary"
                variant="contained"
                style={{ marginLeft: '4px' }}
            >
                GUARDAR
            </Button>
        </form>
    )
}

const LoadMassiveMain = ({ title, openModal, setOpenModal, rowselected }) => {
    const { setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);
    const [datadetail, setdatadetail] = useState([]);



    const columnsOrganization = React.useMemo(
        () => [
            {
                accessor: "seg_code",
                Header: "CODIGO SEGUIMIENTO"
            },
            {
                accessor: "alt_code1",
                Header: "CODIGO ALTERNATIVO 1"
            },
            {
                accessor: "alt_code2",
                Header: "CODIGO ALTERNATIVO 2"
            },
            {
                accessor: "client_date",
                Header: "FECHA CLIENTE"
            },
            {
                accessor: "client_barcode",
                Header: "CODIGO BARRAS CLIENTE"
            },
            {
                accessor: "client_dni",
                Header: "DNI CLIENTE"
            },
            {
                accessor: "client_name",
                Header: "NOMBRE CLIENTE"
            },
            {
                accessor: "client_phone1",
                Header: "TELEFONO CLIENTE"
            },
            {
                accessor: "client_email",
                Header: "CORREO CLIENTE"
            },
            {
                accessor: "client_address",
                Header: "DIRECCIÓN CLIENTE"
            },
            {
                accessor: "department",
                Header: "DEPARTAMENTO"
            },
            {
                accessor: "district",
                Header: "DISTRITO"
            },
            {
                accessor: "province",
                Header: "PROVINCIA"
            },
            {
                accessor: "sku_code",
                Header: "CODIGO SKU"
            },
            {
                accessor: "sku_weight",
                Header: "PESO SKU"
            },
            {
                accessor: "sku_pieces",
                Header: "PIEZAS SKU"
            },
            {
                accessor: "sku_size",
                Header: "TAMAÑO SKU"
            },
            {
                accessor: "box_code",
                Header: "CODIGO CAJA"
            },
        ],
        []
    );

    useEffect(() => {
        setdatadetail([]);
        let continuezyx = true;

        (async () => {
            if (rowselected && openModal) {
                const datatosend = {
                    method: "SP_SEL_LOADS_DETAILS",
                    data: {
                        id_massive_load: rowselected.id_massive_load,
                    }
                }
                const res = await triggeraxios('post', '/api/web/main/', datatosend)
                if (res.success && continuezyx) {
                    setdatadetail(res.result.data);
                }
            }
        })();

        return () => continuezyx = false;
    }, [openModal])


    const handleClick = () => setOpenModal(false);

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth={true}
                maxWidth='md'
                onClose={handleClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title} - {rowselected ? "Editar" : "Registrar"}</DialogTitle>

                <DialogContent>
                    <div style={{ marginBottom: '1rem' }}>
                        <FormAux />
                    </div>
                    {/* <TableVirtualized 
                        columns={columnsOrganization}
                        data={datadetail}
                        rowselected={rowselected}
                        fetchData={fetchData}
                    /> */}
                    <TableZyx
                        columns={columnsOrganization}
                        data={datadetail}
                    />
                </DialogContent>


                <DialogActions>
                    <Button
                        color="primary"
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
        </>
    );
}

export default LoadMassiveMain;