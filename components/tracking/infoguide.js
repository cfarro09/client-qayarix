import React, { useContext, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import InputFormk from '../form/inputformik';
import trackingContext from '../../context/tracking/trackingContext'
import TableZyx from '../../hooks/useTableCRUD2';


const InfoContact = ({ classes }) => {

    const { id_guide, infoguide } = useContext(trackingContext);

    const columnsskus = React.useMemo(
        () => [
            {
                Header: 'CODIGO',
                accessor: 'code'
            },
            {
                Header: 'DESCRIPCION',
                accessor: 'description'
            },
            {
                Header: 'MARCA',
                accessor: 'brand'
            }
        ],
        []
    );

    return (
        <>
            {id_guide ? (
                <div>
                    <div className="row-zyx">
                        <InputFormk
                            name="address"
                            classname="col-6"
                            label="Dirección"
                            disabled={true}
                            valuedefault={infoguide?.address}
                        />
                        <InputFormk
                            name="client_barcode"
                            classname="col-3"
                            label="Cod. Barras"
                            disabled={true}
                            valuedefault={infoguide?.client_barcode}
                        />
                        <InputFormk
                            name="client_dni"
                            classname="col-3"
                            label="Cliente DNI"
                            disabled={true}
                            valuedefault={infoguide?.client_dni}
                        />
                    </div>
                    <div className="row-zyx">
                        <InputFormk
                            name="client_email"
                            classname="col-3"
                            label="Cliente Correo"
                            disabled={true}
                            valuedefault={infoguide?.client_email}
                        />
                        <InputFormk
                            name="client_phone1"
                            classname="col-3"
                            label="Teléfono"
                            disabled={true}
                            valuedefault={infoguide?.client_phone1}
                        />

                        <InputFormk
                            name="client_name"
                            classname="col-3"
                            label="Cliente"
                            disabled={true}
                            valuedefault={infoguide?.client_name}
                        />
                        <InputFormk
                            name="department"
                            classname="col-3"
                            label="Departamento"
                            disabled={true}
                            valuedefault={infoguide?.department}
                        />
                    </div>
                    <div className="row-zyx">
                        <InputFormk
                            name="province"
                            classname="col-3"
                            label="Provincia"
                            disabled={true}
                            valuedefault={infoguide?.province}
                        />
                        <InputFormk
                            name="district"
                            classname="col-3"
                            label="Distrito"
                            disabled={true}
                            valuedefault={infoguide?.district}
                        />
                        <InputFormk
                            name="org_name"
                            classname="col-3"
                            label="Organización"
                            disabled={true}
                            valuedefault={infoguide?.org_name}
                        />
                        <InputFormk
                            name="seg_code"
                            classname="col-3"
                            label="Cod Seguimiento"
                            disabled={true}
                            valuedefault={infoguide?.seg_code}
                        />
                    </div>
                    <div className="row-zyx">
                        <InputFormk
                            name="guide_number"
                            classname="col-3"
                            label="N° Guia"
                            disabled={true}
                            valuedefault={infoguide?.guide_number}
                        />
                    </div>
                    <div className="row-zyx">
                        <TableZyx
                            columns={columnsskus}
                            titlemodule='Contenido SKU'
                            data={infoguide.skus}
                            register={false}
                        />
                    </div>
                </div>
            ) : null}

        </>
    );
}

export default InfoContact;