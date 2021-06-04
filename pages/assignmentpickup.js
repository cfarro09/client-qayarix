import React, { useState, useEffect, useContext, useCallback } from 'react';
import Layout from '../components/layout/layout';
import AssignmentMain from '../components/assignment/main';
import AssignmentState from '../context/assignment/assignmentState';

const Assignment = () => {
    return (
        <Layout>
            <AssignmentState
                type="RECOLECCION"
            >
                <AssignmentMain />
            </AssignmentState>
        </Layout>
    );
}

export default Assignment;