import React, { useState, useContext } from 'react';
import Layout from '../components/layout/layout'
import TableZyx from '../hooks/useTable';
import popupsContext from '../context/pop-ups/pop-upsContext';
import Box from '@material-ui/core/Box';
import triggeraxios from '../config/axiosv2';

import Paper from '@material-ui/core/Paper';

const Home = () => {
    
    return (
        <Layout>
            <Box component={Paper} px={2} pt={2} mx={2} mb={2} style={{ height: '80vh' }}>
                <h2>¡BIENVENIDO!</h2>
            </Box>
        </Layout>
    );
}

export default Home;