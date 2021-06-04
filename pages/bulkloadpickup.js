import React, { useState, useContext, useEffect, useCallback } from 'react';
import Layout from '../components/layout/layout';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import SelectFunction from '../hooks/useSelectFunction';
import triggeraxios from '../config/axiosv2';
import * as XLSX from 'xlsx';
import TableZyx from '../hooks/useTableCRUD';
import popupsContext from '../context/pop-ups/pop-upsContext';

const BulkLoad = () => {

    const { setOpenSnackBack, setOpenBackdrop } = useContext(popupsContext);

    const [valuefile, setvaluefile] = useState('')
    const [isload, setisload] = useState(false);
    const [templates, settemplates] = useState([]);
    const [templateselected, settemplateselected] = useState(null);
    const [template, settemplate] = useState(null);

    const [datatable, setdatatable] = useState({
        columns: [],
        rows: []
    })

    const handlerselecttemplate = useCallback(({ newValue }) => {
        if (newValue) {
            settemplate(newValue);
            settemplateselected(JSON.parse(newValue.json_detail));
        } else {
            settemplateselected(null);
        }
    });

    const handlerinsertload = async () => {
        setOpenBackdrop(true);
        const res = await triggeraxios('post', '/api/web/collect/load', { id_corporation: template.id_corporation, id_organization: template.id_organization, data: datatable.rows })
        setOpenBackdrop(false);
        if (res.success) {
            setOpenSnackBack(true, { success: true, message: 'La carga fue insertada satisfactoriamente.' });
            setisload(false);
            setdatatable({
                columns: [],
                rows: {}
            });
        } else {
            setOpenSnackBack(true, { success: false, message: res.msg });
        }
    }

    const handleChange = (files) => {
        const selectedFile = files[0];

        var reader = new FileReader();

        reader.onload = (e) => {
            console.time("aux1");
            var data = e.target.result;
            let workbook = XLSX.read(data, { type: 'binary' });
            const wsname = workbook.SheetNames[0];
            const ws = workbook.Sheets[wsname];

            let rowsx = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[wsname]
            );
            console.timeEnd("aux1");
            const listtransaction = [];

            try {
                console.time("aux2");
                if (rowsx instanceof Array) {
                    for (let i = 0; i < rowsx.length; i++) {
                        const r = rowsx[i];

                        const datarow = {};

                        for (const [key, value] of Object.entries(r)) {
                            const keycleaned = key;

                            const dictionarykey = templateselected.find(k => keycleaned.toLocaleLowerCase() === k.keyexcel.toLocaleLowerCase());

                            if (dictionarykey) {
                                if (dictionarykey.obligatory && !value) {
                                    throw `La fila ${i}, columna ${key} está vacia.`;
                                }

                                datarow[dictionarykey.columnbd] = value;
                            }
                        }
                        let columnerror = "";
                        const completed = templateselected.filter(x => x.obligatory === true).every(j => {
                            if (datarow[j.columnbd])
                                return true
                            columnerror = j.keyexcel;
                            return false
                        });

                        if (!completed)
                            throw `La fila ${i + 1}, no tiene las columnas obligatorias(${columnerror}).`;

                        listtransaction.push(datarow);
                    }
                }
                console.timeEnd("aux2");
                console.time("aux3");
                let columnstoload = [];
                templateselected.forEach(k => columnstoload.push({ Header: k.keyexcel.toLocaleUpperCase(), accessor: k.columnbd }));
                setdatatable({
                    columns: columnstoload,
                    rows: listtransaction
                })
                console.timeEnd("aux3");
                setisload(true);
            } catch (e) {
                setOpenSnackBack(true, { success: false, message: e });
                setdatatable({
                    columns: [],
                    rows: []
                })
                setisload(false);
            }
            setvaluefile('');
        };
        reader.readAsBinaryString(selectedFile)
    }

    useEffect(() => {
        (async () => {
            const datatosend = {
                method: "SP_SEL_TEMPLATE",
                data: { id_corporation: null, id_organization: null, status: 'ACTIVO', type: 'RECAUDACION' }
            }
            const res = await triggeraxios('post', '/api/web/main/', datatosend)
            if (res.success) {
                if (res.result.data instanceof Array)
                    settemplates(res.result.data)
                else
                    console.error("Result is not array");
            }
        })();
    }, [])

    return (
        <Layout>

            <Box display="flex" ml={1} mb={1}>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '200px', marginRight: '1rem' }}>
                        <SelectFunction
                            title="Plantilla"
                            datatosend={templates}
                            optionvalue="json_detail"
                            optiondesc="description"
                            callback={handlerselecttemplate}
                        />
                    </div>
                    {templateselected && (
                        <>
                            <input
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                id="raised-button-file"
                                type="file"
                                value={valuefile}
                                style={{ display: 'none' }}
                                onChange={(e) => handleChange(e.target.files)}
                            />
                            <label htmlFor="raised-button-file">
                                <Button color="secondary" component="span" variant="contained">
                                    SUBIR EXCEL
                                </Button>
                            </label>
                        </>
                    )}

                    {isload &&
                        <Button
                            color="primary"
                            component="span"
                            variant="contained"
                            style={{ marginLeft: '1rem' }}
                            onClick={handlerinsertload}
                        >
                            PROCESAR
                        </Button>
                    }
                </div>
            </Box>
            {isload && (
                <TableZyx
                    columns={datatable.columns}
                    data={datatable.rows}
                />
            )}

        </Layout>
    );
}

export default BulkLoad;