import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputFormk from '../form/inputformik';
import SelectFunction from '../../hooks/useSelectFunction';

const dataFilter = [
    { filterby: 'client_barcode', description: 'Codigo de barras' },
    { filterby: 'seg_code', description: 'CUD' },
    { filterby: 'alt_code1', description: 'Codigo alt 1' },
]

const ScanBarCode = ({ handleClick, textaux, quadrantselected }) => {
    const [filterby, setfilterby] = useState('client_barcode');


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            client_barcode: '',
            // filterby: 'client_barcode'
        },
        validationSchema: Yup.object({
            client_barcode: Yup.string().required(textaux),
            // filterby: Yup.string().required('Ese necesariooo'),
        }),
        onSubmit: values => {
            if (filterby) {
                const { client_barcode } = values
                handleClick({ client_barcode, filterby });
                formik.resetForm();
            }
        }
    });
    return (
        <div style={{ marginBottom: '1rem' }}>
            <form
                noValidate
                className="row-zyx"
                style={{ width: '100%' }}
                onSubmit={formik.handleSubmit}
            >
                <InputFormk
                    classname="col-3"
                    name="client_barcode"
                    label="Codigo Barra"
                    disabled={quadrantselected ? false : true}
                    formik={formik}
                />
                <SelectFunction
                    title="Buscar por"
                    datatosend={dataFilter}
                    classname="col-3"
                    optionvalue="filterby"
                    optiondesc="description"
                    valueselected="client_barcode"
                    callback={({ newValue }) => newValue ? setfilterby(newValue.filterby) : setfilterby('')}
                // valueselected={formik.values.filterby}
                // namefield="filterby"
                // formik={formik}
                />
                <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    style={{ marginLeft: '4px', width: 'auto', maxHeight: '40px' }}
                >
                    BUSCAR
            </Button>
            </form>
        </div>
    )
}

export default ScanBarCode;