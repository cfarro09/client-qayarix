import React, { useContext, useCallback, useState, useEffect } from 'react';
import trackingContext from '../../context/tracking/trackingContext'
import SelectFunction from '../../hooks/useSelectFunction';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import authContext from '../../context/auth/authContext';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import RepeatIcon from '@material-ui/icons/Repeat';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        flexGrow: 1,
    },
    paper: {
    },
}));

const getSteps = () => ['PROCESADO', 'ASIGNADO', 'EN CURSO'];

const Tracking = () => {
    const steps = getSteps();
    const classes = useStyles();

    const initialaux = React.useRef(false);

    const { id_guide, attempts, tracking, updateattempt, attempt, trackingselected } = useContext(trackingContext);
    const { user } = useContext(authContext);
    const [lasttracking, setlasttracking] = useState({});
    const [trackingselectedaux, settrackingselectedaux] = useState(trackingselected);

    const callback = useCallback(({ newValue }) => {
        if (initialaux.current)
            updateattempt(newValue)
        initialaux.current = true;
    }, []);

    useEffect(() => {
        let newtrackingselect = []
        if (trackingselected[0].status !== "PROCESADO") {
            newtrackingselect = [tracking[0], ...trackingselected];
        } else {
            newtrackingselect = trackingselected;
        }
        settrackingselectedaux(newtrackingselect);
        setlasttracking(newtrackingselect[newtrackingselect.length - 1]);

    }, [trackingselected])


    return (
        <>
            <div className="row-zyx">
                <SelectFunction
                    title="Visitas"
                    datatosend={attempts}
                    classname="col-3"
                    optionvalue="attempt"
                    optiondesc="desc"
                    namefield="attempt"
                    valueselected={attempt}
                    descfield="desc"
                    callback={callback}
                />
            </div>
            {user?.role_name !== "CONSULTOR" && (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Datos de Envío</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ display: 'block', width: '100%' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>N° Envío: {lasttracking?.id_shipping_order}</div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>Cliente: {lasttracking?.org_name}</div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>Fecha de la Orden: {lasttracking?.date_order_shipping?.substring(0, 10)}</div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>Placa: {lasttracking?.plate_number}</div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>Proveedor: {lasttracking?.provider_name}</div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>Doc Conductor: {lasttracking?.doc_number}</div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <div className={classes.paper}>Conductor: {lasttracking?.driver_name}</div>
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

            )}
            <div>
                <Timeline align="alternate">
                    <TimelineItem>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                {trackingselectedaux[3]?.date_created}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color={trackingselectedaux[3] ? "primary" : "grey"}>
                                <DoneIcon />
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper style={{ padding: '6px 16px' }}>
                                <Typography variant="h6" component="h1" color={trackingselectedaux[3] ? "textPrimary" : "textSecondary"}>
                                    {trackingselectedaux[3] ? trackingselectedaux[3].status : "ENTREGADO"}
                                </Typography>
                                <Typography>{trackingselectedaux[3]?.motive}</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                {trackingselectedaux[2]?.date_created}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color={trackingselectedaux[2] ? "primary" : "grey"}>
                                <DoneIcon />
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper style={{ padding: '6px 16px' }}>
                                <Typography variant="h6" component="h1" color={trackingselectedaux[2] ? "textPrimary" : "textSecondary"}>EN CURSO</Typography>
                                <Typography>{trackingselectedaux[2]?.motive}</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                {trackingselectedaux[1]?.date_created}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color={trackingselectedaux[1] ? "primary" : "grey"}>
                                <DoneIcon />
                            </TimelineDot>
                            <TimelineConnector className={classes.secondaryTail} />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper style={{ padding: '6px 16px' }}>
                                <Typography variant="h6" component="h1" color={trackingselectedaux[1] ? "textPrimary" : "textSecondary"}>ASIGNADO</Typography>
                                <Typography>{trackingselectedaux[1]?.motive}</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                {trackingselectedaux[0]?.date_created}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="primary">
                                <DoneIcon />
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper style={{ padding: '6px 16px' }}>
                                <Typography variant="h6" component="h1">
                                    PROCESADO
                                </Typography>
                                <Typography>{trackingselectedaux[0].motive}</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
            </div>
        </>
    );
}

export default Tracking;