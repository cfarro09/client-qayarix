import React, { useContext, useCallback, useState, useEffect } from 'react';
import assignmentContext from '../../context/assignment/assignmentContext';
import CheckDistrict from './checkdistrict';
import SelectMulti from '../../hooks/useMultiSelectFunction';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import FormGroup from '@material-ui/core/FormGroup';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import InputFormk from '../form/inputformik';
import Accordion from '@material-ui/core/Accordion';
import SelectFunction from '../../hooks/useSelectFunction';
import Button from '@material-ui/core/Button';

const FilterDistricts = () => {
    const { setModalQuestion } = useContext(popupsContext);
    const { dataDistritcs, firstdistrict, setQuadrants, dataquadrant, selectQuadrant, quadrantselected,selectMarkerGlobal } = useContext(assignmentContext);
    const [numquadrant, setnumquadrant] = useState(0);

    useEffect(() => {
        let continuezyx = true;
        (() => {
            if (continuezyx) {
                let quadrants = [];
                for (let i = 1; i < numquadrant + 1; i++) {
                    quadrants.push({
                        description: `${firstdistrict} CUADRANTE N° ${i}`,
                        idquadrant: `${firstdistrict}_${i}`
                    })
                }
                setQuadrants(quadrants);
            }
        })();
        return () => continuezyx = false;
    }, [numquadrant])

    const callbackInput = useCallback((number, setValue) => {
        const numberclean = parseInt(number);
        if (numberclean < 0 || numberclean > 10) {
            setValue("0");
            setnumquadrant(0);
        } else {
            setnumquadrant(numberclean);
        }
    }, [])

    const callbackQuadrant = useCallback(({ newValue }) => {
        if (newValue) {
            selectQuadrant(newValue.idquadrant);
        } else {
            selectQuadrant('');
        }
    }, [])

    const ttt = dataDistritcs.filter(x => !!x.selected).map(x => x.description).join(', ');
    return (
        <div className="row-zyx">
            <Accordion className="col-3" style={{ marginBottom: '5px' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{ttt.trim() ? ttt : 'Distritos'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ maxHeight: '200px', marginBottom: '5px', width: '100%', overflowY: 'auto' }}>
                        <FormGroup>
                            {dataDistritcs.map(item => (
                                <CheckDistrict
                                    key={item.district}
                                    district={item}
                                />
                            ))}
                        </FormGroup>
                    </div>
                </AccordionDetails>
            </Accordion>
            <div className="col-3">
                <InputFormk
                    disabled={firstdistrict ? false : true}
                    name="countcuadrant"
                    label="N° Cuadrantes"
                    type="number"
                    callback={callbackInput}
                />
            </div>
            <div className="col-3">
                <SelectFunction
                    title="Cuadrantes"
                    disabled={firstdistrict ? false : true}
                    datatosend={dataquadrant}
                    optionvalue="idquadrant"
                    optiondesc="description"
                    callback={callbackQuadrant}
                />
            </div>
            {(dataquadrant.length === 1 && quadrantselected) &&
                <div className="col-3">
                    <Button
                        type="button"
                        color="secondary"
                        variant="contained"
                        onClick={selectMarkerGlobal}
                    >
                        SELECCIONAR TODOS
                </Button>
                </div>
            }
        </div>
    );
}

export default FilterDistricts;