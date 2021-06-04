import React, { useState, useContext, useEffect, useRef } from 'react';
import List from '@material-ui/core/List';
import ItemGuide from './itemguide';
import SearchListGuide from './searchlistguide';
import Box from '@material-ui/core/Box';

import trackingContext from '../../context/tracking/trackingContext'
import popupsContext from '../../context/pop-ups/pop-upsContext';

import DateRange from '../form/daterange';

const ListContact = () => {
    const { guides } = useContext(trackingContext);

    return (
        <>
            <SearchListGuide
            />
            <List bgcolor="white" width={1} component="nav" style={{ overflowY: 'auto' }}>
                {guides.map(guide => (
                    <ItemGuide
                        key={guide.id_guide}
                        guide={guide}
                    />
                ))}
            </List>
        </>

    );
}

export default ListContact;