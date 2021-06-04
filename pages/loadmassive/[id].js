import React, { useState, useContext, useEffect, useCallback  } from 'react';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import InputFormk from '../../components/form/inputformik';
import { useFormik } from 'formik';
import TableVirtualized from '../../hooks/useTableVirtualized';
import triggeraxios from '../../config/axiosv2';
// import UserOrganization from './userorganization';
import * as Yup from 'yup';
import Layout from '../../components/layout/layout';

const FormAux = ({ handleClick }) => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            barcode: ''
        },
        validationSchema: Yup.object({
            barcode: Yup.string().required('El mensaje es obligatorio')
        }),
        onSubmit: values => {
            handleClick(values.barcode)
        }
    });
    return (
        <form
            style={{ marginBottom: '1rem', display: 'block' }}
            noValidate
            className="row-zyx"
            style={{ width: '100%' }}
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
                style={{ marginLeft: '4px', width: 'auto' }}
            >
                BUSCAR
                </Button>
        </form>
    )
}

const LoadMassiveMain = () => {
    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);
    const [datadetail, setdatadetail] = useState([]);
    const [procesado, setprocesado] = useState(true);
    const router = useRouter();

    const loaddetail = useCallback(async ({id_massive_load, continuezyx = true}) => {
        const datatosend = {
            method: "SP_SEL_LOADS_DETAILS",
            data: {
                id_massive_load
            }
        }
        setloadingglobal(true)
        const res = await triggeraxios('post', '/api/web/main/', datatosend)
        setloadingglobal(false)
        if (res.success && continuezyx) {
            setdatadetail(res.result.data);
            setprocesado(["SIN FISICO", "PROCESADO"].includes(res.result.data[0].status));
        }
    }, [])


    useEffect(() => {
        setdatadetail([]);
        let continuezyx = true;
        if (router?.query?.id) {
            loaddetail({id_massive_load: router.query.id, continuezyx})
        }

        return () => continuezyx = false;
    }, [router])

    const columnsOrganization = React.useMemo(
        () => [
            {
                accessor: "status",
                Header: "ESTADO"
            },
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

    const processSelected = (selected) => {
        const callback = async () => {
            setOpenBackdrop(true)
            const data = datadetail.filter(x => !selected.includes(x.client_barcode)).map(x => x.id_load_detail);
            setModalQuestion({ visible: false })

            const id_massive_load = datadetail[0].id_massive_load;
            const res = await triggeraxios('post', '/api/web/massive_load/process', { id_massive_load, data });
            setOpenBackdrop(false)
            if (res.success) {
                if (res.result?.success) {
                    setOpenSnackBack(true, { success: true, message: 'La carga fue procesada satisfactoriamente.' });
                    // loaddetail({id_massive_load})
                    router.push('/loadmassive', `/loadmassive`)
                }
                else {
                    setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });
                }
            } else {
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });
            }
        }
        if(!procesado)
            setModalQuestion({ visible: true, question: `¿Está seguro procesar los ${selected.length} registros?`, callback })
        else 
            setOpenSnackBack(true, { success: false, message: 'Esta carga ya fue procesada.' });
    }

    return (
        <Layout>
            <TableVirtualized
                columns={columnsOrganization}
                workcheck={!procesado}
                keycheck="client_barcode"
                data={datadetail}
                HeadComponent={procesado ? null : FormAux}
                processSelected={processSelected}
            />
        </Layout>
    );
}

export default LoadMassiveMain;