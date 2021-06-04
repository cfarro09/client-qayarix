import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import InfoGuide from './infoguide';
import Tracking from './tracking';
import Images from './images';
import trackingContext from '../../context/tracking/trackingContext'

function TabPanel({ children, value, index, ...other }) {

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} pb={0} style={{
                    display: 'block', overflowY: 'auto',
                    maxHeight: '73vh'
                }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    flexform: {
        display: 'flex!important',
        justifyContent: "space-between!important",
        width: '100%!important',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            marginLeft: 0,
            width: '23ch',
        },
        '& > .morewidth': {
            width: '27ch',
        },
        '& > .firstrowinput': {
            width: '25ch',
        },
        '& > .avatarinput': {
            width: '7ch',
        },
        '& .container-full-width': {
            width: '100%',
            display: 'block'
        },
        [theme.breakpoints.down('sm')]: {
            '& > *, .firstrowinput, .morewidth': {
                width: '100%',
            },
        },
    },
    flex: {
        display: 'flex!important',
        justifyContent: "space-between!important",
    },
}));

const DetailContact = () => {
    const classes = useStyles();
    const { id_guide } = useContext(trackingContext);
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Paper className={classes.root} elevation={0}>
            {id_guide ? (
                <>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="INFORMACIÓN DE LA GUIA" {...a11yProps(0)} />
                        <Tab label="TRACKING" {...a11yProps(1)} />
                        <Tab label="IMAGENES" {...a11yProps(1)} />
                    </Tabs>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <InfoGuide
                                classes={classes}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <Tracking
                                classes={classes}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={2} dir={theme.direction}>
                            <Images
                                classes={classes}
                            />
                        </TabPanel>
                    </SwipeableViews>
                </>
            ) : null
            }

        </Paper>
    );
}

export default DetailContact;