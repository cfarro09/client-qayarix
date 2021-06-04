import React, { useContext } from 'react';
import assignmentContext from '../../context/assignment/assignmentContext';
import TableZyx from '../../hooks/useTableCRUD';
import InputFormk from '../form/inputformik';
import SelectDomain from '../../hooks/useSelectDomain';

const Resumen = ({ quadrant }) => {
    const columnasguias = React.useMemo(
        () => [
            {
                Header: 'COD SEGUIMIENTO',
                accessor: 'seg_code'
            },
            {
                Header: 'COD BARRAS',
                accessor: 'client_barcode'
            },
            {
                Header: 'COD ALTERNATIVO 1',
                accessor: 'alt_code1'
            },
            {
                Header: 'COD ALTERNATIVO 2',
                accessor: 'alt_code2'
            },
            {
                Header: 'NOMBRE CLIENTE',
                accessor: 'client_name'
            },
            {
                Header: 'DNI CLIENTE',
                accessor: 'client_dni'
            },
            {
                Header: 'TLF CLIENTE',
                accessor: 'client_phone1'
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
                Header: 'FECHA PROCESADA',
                accessor: 'date_updated'
            },
        ],
        []
    );
    return (
        <>
            <TableZyx
                // titlemodule={`${quadrant.name} - Guias`}
                HeadComponent={() => (
                    <div style={{ width: '100%'}}>
                        <div className="row-zyx">
                            <InputFormk
                                name="name"
                                valuedefault={quadrant.name}
                                disabled={true}
                                classname="col-3"
                                label="Cuadrante"
                            />
                            <InputFormk
                                name="plate_number"
                                valuedefault={quadrant.plate_number}
                                disabled={true}
                                classname="col-3"
                                label="N° Placa"
                            />
                            <InputFormk
                                name="driver"
                                valuedefault={quadrant.driver}
                                disabled={true}
                                classname="col-3"
                                label="Conductor"
                            />
                        </div>
                    </div>
                )}
                columns={columnasguias}
                data={quadrant.guides}
            />
        </>
    );
}

export default Resumen;