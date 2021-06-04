import React from 'react';
import Layout from '../components/layout/layout'

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import ListGuide from '../components/tracking/listguide';
import DetailGuide from '../components/tracking/detailguide';
import TrackingState from '../context/tracking/trackingState';

const Tracking = () => {

    return (
        <Layout>
            <TrackingState>
                <Box display="flex" style={{ height: '100%', maxHeight: '82vh' }}>
                    <Box width="40%" mr={2} display="grid" p={0} style={{ gridTemplateRows: 'auto auto auto auto 1fr' }}>
                        <ListGuide />
                    </Box>
                    <Box width="60%" my={2} mr={2} p={0} >
                        <DetailGuide />
                    </Box>
                </Box>
            </TrackingState>
        </Layout>
    );
}

export default Tracking;