import React, { useEffect, useContext, useCallback, useState } from 'react';
import triggeraxios from '../../config/axiosv2';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import assignmentContext from '../../context/assignment/assignmentContext';
import FilterDistricts from './filterdistricts';
import MapAssignment from './mapassignment';
import CoordinatesModal from './coordinates';
import Vehicles from './vehicles';
import CounterMarker from './countermarker';
import Resumen from './resumen';
import ScanBarCode from './scanbarcode';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TableZyx from '../../hooks/useTableCRUD';

const datatosend = {
    method: "SP_SEL_GUIDES",
    data: { type: 'DISTRIBUCION' }
}
const getSteps = () => ['Seleccionar Guias', 'Asignar a un Chofer', 'Confirmar'];

const AssignmentMain = () => {
    const steps = getSteps();

    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);
    const { setDataAssignment, selectBarCode, activeStep, quadrantselected } = useContext(assignmentContext);

    // const [openModalCoordinates, setOpenModalCoordinates] = useState(false);
    // const [rowselected, setrowselected] = useState(null);

    const loaddetail = useCallback(async () => {
        setloadingglobal(true)
        setDataAssignment()
        setloadingglobal(false)

    }, [])

    const handlescanbarcode = async (values) => {
        if (!quadrantselected) {
            setOpenSnackBack(true, { success: false, message: 'Tiene que seleccionar un cuadrante para asignar la guia.' });
            return;
        }
        setOpenBackdrop(true);
        const res = await selectBarCode(values);
        setOpenBackdrop(false);
        if (res) {
            setOpenSnackBack(true, { success: false, message: res });
        }
    }

    useEffect(() => {
        let continuezyx = true;
        loaddetail({ continuezyx });
        return () => continuezyx = false;
    }, [])

    return (
        <>
            <Box style={{ height: '100%' }}>
                <Box display="flex" justifyContent="space-between" mb={1} ml={1}>
                    <Typography variant="h6" id="tableTitle" component="div">
                        Asignaciones
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <CounterMarker />
                {activeStep === 0 && (
                    <>
                        <ScanBarCode
                            handleClick={handlescanbarcode}
                            quadrantselected={quadrantselected}
                            textaux="El codigo de barras es obligatorio"
                        />
                        <FilterDistricts />
                        <MapAssignment />
                    </>
                )}
                {activeStep === 1 && <Vehicles />}
                {activeStep === 2 && <Resumen />}
            </Box>

            {/* {activeStep === 0 && (
                <>
                    <TableZyx
                        columns={columnsDataWithoutCoordinates}
                        titlemodule='Guias sin coordenadas'
                        data={dataWithoutCoordinates}
                        selectrow={selectGuide}
                    />
                    <CoordinatesModal
                        openModal={openModalCoordinates}
                        setOpenModal={setOpenModalCoordinates}
                        rowselected={rowselected}
                    />
                </>
            )} */}
        </>
    );
}

export default AssignmentMain;