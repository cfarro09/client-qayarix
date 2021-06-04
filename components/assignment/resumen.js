import React, { useContext } from 'react';
import assignmentContext from '../../context/assignment/assignmentContext';
import ResumenQuadrant from './resumenquadrant';
import TableZyx from '../../hooks/useTableCRUD';
import InputFormk from '../form/inputformik';
import SelectDomain from '../../hooks/useSelectDomain';

const Resumen = () => {
   
    const { dataVisible, quadrantguidesvehicles } = useContext(assignmentContext);
    
    return quadrantguidesvehicles.map(x => (
        <ResumenQuadrant
            key={x.idquadrant}
            quadrant={x}
        />
    ))
}

export default Resumen;