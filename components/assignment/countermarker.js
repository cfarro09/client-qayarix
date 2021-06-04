import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import assignmentContext from '../../context/assignment/assignmentContext';

const CounterMarker = () => {
    const theme = useTheme();
    const { activeStep, changeStep, dataVisible, quadrantguidesvehicles, quadrantguides } = useContext(assignmentContext);
    const countselected = dataVisible.filter(x => !!x.selected);
    const [content, setcontent] = useState("");

    const disabled = activeStep === 1 ? !(quadrantguidesvehicles.every(x => !!x.id_vehicle)) : false;

    useEffect(() => {
        let ccc = "";
        for (const [idquadrant, guides] of Object.entries(quadrantguides)) {
            const numberguides = [];
            if (guides.length) {
                guides.forEach(x => {
                    if (!numberguides.includes(x.guide_number)) 
                        numberguides.push(x.guide_number)
                });
                ccc += `${idquadrant.split("_")[0]} N° ${idquadrant.split("_")[1]} - Cantidad Guias: ${numberguides.length} - Cantidad Bultos: ${guides.length}\n`;
            }
        }
        setcontent(ccc);
    }, [quadrantguides])

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.palette.secondary.light, marginBottom: '1rem', padding: '10px', minHeight: '56px' }}>
            <div style={{ color: 'white', whiteSpace: 'break-spaces', fontSize: '20px' }}>
                {content}
            </div>
            {countselected.length !== 0 &&
                <div>
                    <Button color="primary" disabled={activeStep === 0} onClick={() => changeStep(-1)} >
                        REGRESAR
                        </Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={disabled}
                        onClick={() => changeStep(+1)}
                    >
                        {activeStep === 2 ? 'FINALIZAR' : 'SIGUIENTE'}
                    </Button>
                </div>
            }
        </div>
    )

}

export default CounterMarker;