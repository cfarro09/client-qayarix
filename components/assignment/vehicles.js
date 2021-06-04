import React, { useEffect, useContext, useState, useCallback } from 'react';
import TableVirtualized from '../../hooks/useTableVirtualized';
import triggeraxios from '../../config/axiosv2';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import assignmentContext from '../../context/assignment/assignmentContext';
import TableZyx from '../../hooks/useTableCRUD2';
import IconButton from '@material-ui/core/IconButton';
import SelectVehicle from './selectvehicles';
import {
    Edit as EditIcon,
} from '@material-ui/icons';

const Vehicles = () => {

    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);
    const { quadrantguidesvehicles, setQuadrantVehicle, quadrantguides } = useContext(assignmentContext);
    const [openmodal, setopenmodal] = useState(false);
    const [quadrantselected, setquadrantselected] = useState(null);

    const columnsquadrants = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "idquadrant",
                isComponent: true,
                Cell: props => {
                    if (props.cell.row.original.status === 'RECHAZADO')
                        return null;
                    return (
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                                setopenmodal(true)
                                setquadrantselected(props.cell.row.original)
                            }}
                        >
                            <EditIcon
                                fontSize="inherit"
                                size="small"
                                color="secondary"
                            />
                        </IconButton>
                    )
                }
            },
            {
                Header: 'Cuadrante',
                accessor: 'name'
            },
            {
                Header: 'N° Guias',
                accessor: 'countguides'
            },
            {
                Header: 'Placa',
                accessor: 'plate_number'
            },
            {
                Header: 'Conductor',
                accessor: 'driver'
            },
        ],
        []
    );

    useEffect(() => {
        let continuezyx = true;

        const arrayquadrants = [];
        for (const [idquadrant, guides] of Object.entries(quadrantguides)) {
            if (guides.length) {
                arrayquadrants.push({
                    idquadrant,
                    countguides: guides.length,
                    guides,
                    name: `${idquadrant.split("_")[0]} CUADRANTE N° ${idquadrant.split("_")[1]}`,
                    id_vehicle: 0,
                    id_driver: 0,
                    plate_number: '',
                    driver: ''
                });

                setQuadrantVehicle(arrayquadrants);
            }
        }
        
        return () => continuezyx = false;
    }, [])
    
    return (
        <>
            <TableZyx
                columns={columnsquadrants}
                titlemodule='Cuadrantes'
                data={quadrantguidesvehicles}
                register={false}
            />
            <SelectVehicle
                title="Seleccionar Vehiculo"
                openModal={openmodal}
                setOpenModal={setopenmodal}
                quadrant={quadrantselected}
                quadrants={quadrantguidesvehicles}
                setquadrants={setQuadrantVehicle}
            />
        </>
    );
}

export default Vehicles;