import React, { useContext, useEffect } from 'react';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import authContext from '../../context/auth/authContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getConfig from 'next/config'
import Collapse from '@material-ui/core/Collapse';

import {
    ChevronLeft,
    Dashboard,
    ChevronRight,
    CloudUpload,
    Build,
    SystemUpdateAlt,
    Business,
    Explore,
    FormatListBulleted,
    DirectionsCar,
    AccountCircle,
    LocalShipping,
    AssignmentInd,
    Timeline,
    ExpandLess,
    ExpandMore,
    Assessment,
    PermMedia
} from '@material-ui/icons/';

const listreport = ['/reportcontrol', '/reporttower', '/reportcontrolsku', "/reportcontrolprovider"];
const listreportpickup = ['/reportcontrolpickup', '/reporttowerpickup', '/reportcontrolskupickup', "/reportcontrolproviderpickup", "/reportpickup"];
const listpickup = ['/bulkloadpickup', '/loadmassivepickup', '/loadmassivepickup/[id]', '/assignmentpickup', '/shippingpickup'];
const listdistribucion = ['/bulkload', '/loadmassive', '/loadmassive/[id]', '/assignment', '/shipping'];

const Aside = ({ open, setOpen, classes, theme }) => {

    const [openReport, setOpenReport] = React.useState(false);
    const [openReportPickup, setOpenReportPickup] = React.useState(false);
    const [openDistribucion, setOpenDistribucion] = React.useState(false);
    const [openrecojo, setOpenrecojo] = React.useState(false);

    const router = useRouter();
    const { user } = useContext(authContext);

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (router) {
            if (listreport.includes(router.pathname))
                setOpenReport(true)
            if (listreportpickup.includes(router.pathname))
                setOpenReportPickup(true)
            else if (listdistribucion.includes(router.pathname))
                setOpenDistribucion(true)
            else if (listpickup.includes(router.pathname))
                setOpenrecojo(true)
        }
    }, [router])

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight color="primary" /> : <ChevronLeft color="primary" />}
                </IconButton>
            </div>
            <Divider />
            {user?.role_name === "CONSULTOR" ? (
                <List>
                    <Link href="/tracking" >
                        <ListItem button key="tracking" className={router.pathname === '/tracking' ? classes.activelink : null}>
                            <ListItemIcon><Timeline style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="Tracking" />
                        </ListItem>
                    </Link>


                    <Link href="/dashboard" >
                        <ListItem button key="dashboard" className={router.pathname === '/dashboard' ? classes.activelink : null}>
                            <ListItemIcon><Dashboard style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="Indicadores Distr." />
                        </ListItem>
                    </Link>

                    <Link href="/dashboardpickup" >
                        <ListItem button key="dashboardpickup" className={router.pathname === '/dashboardpickup' ? classes.activelink : null}>
                            <ListItemIcon><Dashboard style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="Indicadores Recojo" />
                        </ListItem>
                    </Link>







                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setOpenReport(!openReport)}>
                            <ListItemIcon><Assessment style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="R. Disitribución" />
                            {openReport ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                        </ListItem>
                        <Collapse in={openReport} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/reportcontrol" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrol" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrol' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reporttower" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reporttower" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reporttower' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Torre Control" />
                                    </ListItem>
                                </Link>
                            </List>
                        </Collapse>
                    </List >



                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setOpenReportPickup(!openReportPickup)}>
                            <ListItemIcon><Assessment style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="R. Recolección" />
                            {openReportPickup ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                        </ListItem>
                        <Collapse in={openReportPickup} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/reportcontrolpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrolpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrolpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reporttowerpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reporttowerpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reporttowerpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Torre Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reportpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Recolección" />
                                    </ListItem>
                                </Link>
                            </List>
                        </Collapse>
                    </List >
                </List>
            ) : (
                <>
                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setOpenDistribucion(!openDistribucion)}>
                            <ListItemIcon><LocalShipping style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="Distribución" />
                            {openDistribucion ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                        </ListItem>
                        <Collapse in={openDistribucion} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/bulkload">
                                    <ListItem button key="bulkload" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={router.pathname === '/bulkload' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Carga Masiva" />
                                    </ListItem>
                                </Link>
                                <Link href="/loadmassive">
                                    <ListItem button key="loadmassive" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={['/loadmassive', '/loadmassive/[id]'].includes(router.pathname) ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Cargas" />
                                    </ListItem>
                                </Link>
                                <Link href="/assignment">
                                    <ListItem button key="assignment" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={router.pathname === '/assignment' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Asignación" />
                                    </ListItem>
                                </Link>
                                <Link href="/shipping">
                                    <ListItem button key="shipping" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={router.pathname === '/shipping' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Ordenes enviadas" />
                                    </ListItem>
                                </Link>
                            </List>
                        </Collapse>

                        <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setOpenrecojo(!openrecojo)}>
                            <ListItemIcon><LocalShipping style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="Recolección" />
                            {openrecojo ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                        </ListItem>
                        <Collapse in={openrecojo} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/bulkloadpickup">
                                    <ListItem button key="bulkloadpickup" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={router.pathname === '/bulkloadpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Carga Masiva" />
                                    </ListItem>
                                </Link>
                                <Link href="/loadmassivepickup">
                                    <ListItem button key="loadmassivepickup" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={['/loadmassivepickup', '/loadmassivepickup/[id]'].includes(router.pathname) ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Cargas" />
                                    </ListItem>
                                </Link>
                                <Link href="/assignmentpickup">
                                    <ListItem button key="assignmentpickup" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={router.pathname === '/assignmentpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Asignación" />
                                    </ListItem>
                                </Link>
                                <Link href="/shippingpickup">
                                    <ListItem button key="shippingpickup" style={{ paddingBottom: '5px', paddingTop: '5px', paddingLeft: theme.spacing(9) }} className={router.pathname === '/shippingpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="Ordenes enviadas" />
                                    </ListItem>
                                </Link>
                            </List>
                        </Collapse>
                    </List >


                    <Divider />
                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <Link href="/tracking" >
                            <ListItem button key="tracking" className={router.pathname === '/tracking' ? classes.activelink : null}>
                                <ListItemIcon><Timeline style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Tracking" />
                            </ListItem>
                        </Link>
                        <Link href="/template" >
                            <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="plantillas" className={router.pathname === '/template' ? classes.activelink : null}>
                                <ListItemIcon><Build style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Plantillas" />
                            </ListItem>
                        </Link>
                        <Link href="/vehicle" >
                            <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="vehicle" className={router.pathname === '/vehicle' ? classes.activelink : null}>
                                <ListItemIcon><DirectionsCar style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Vehiculos" />
                            </ListItem>
                        </Link>
                        <Link href="/provider" >
                            <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="Proveedor" className={router.pathname === '/provider' ? classes.activelink : null}>
                                <ListItemIcon><AssignmentInd style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Proveedor" />
                            </ListItem>
                        </Link>
                        {user?.role_name === "SUPER ADMIN" && (
                            <>
                                <Link href="/domain" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="domain" className={router.pathname === '/domain' ? classes.activelink : null}>
                                        <ListItemIcon><FormatListBulleted style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                        <ListItemText style={{ color: 'white' }} primary="Dominios" />
                                    </ListItem>
                                </Link>
                                <Link href="/corporation" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="corporacion" className={router.pathname === '/corporation' ? classes.activelink : null}>
                                        <ListItemIcon><Business style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                        <ListItemText style={{ color: 'white' }} primary="Mi Corporación" />
                                    </ListItem>
                                </Link>
                                <Link href="/user" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="user" className={router.pathname === '/user' ? classes.activelink : null}>
                                        <ListItemIcon><AccountCircle style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                        <ListItemText style={{ color: 'white' }} primary="Usuario" />
                                    </ListItem>
                                </Link>
                            </>
                        )}
                    </List>
                    <Divider />
                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <Link href="/dashboard" >
                            <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="dashboard" className={router.pathname === '/dashboard' ? classes.activelink : null}>
                                <ListItemIcon><Dashboard style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Indicadores Distr." />
                            </ListItem>
                        </Link>
                        <Link href="/dashboardpickup" >
                            <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="dashboardpickup" className={router.pathname === '/dashboardpickup' ? classes.activelink : null}>
                                <ListItemIcon><Dashboard style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Indicadores Recojo" />
                            </ListItem>
                        </Link>
                        <Link href="/imagemonitoring" >
                            <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="imagemonitoring" className={router.pathname === '/imagemonitoring' ? classes.activelink : null}>
                                <ListItemIcon><PermMedia style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                                <ListItemText style={{ color: 'white' }} primary="Monitoreo de imágenes" />
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setOpenReport(!openReport)}>
                            <ListItemIcon><Assessment style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="R. Disitribución" />
                            {openReport ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                        </ListItem>
                        <Collapse in={openReport} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/reportcontrol" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrol" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrol' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reporttower" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reporttower" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reporttower' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Torre Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reportcontrolsku" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrolsku" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrolsku' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control SKU" />
                                    </ListItem>
                                </Link>
                                <Link href="/reportcontrolprovider" >
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrolprovider" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrolprovider' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control Proveedor" />
                                    </ListItem>
                                </Link>
                            </List>
                        </Collapse>
                    </List >



                    <List style={{ paddingBottom: '5px', paddingTop: '5px' }}>
                        <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setOpenReportPickup(!openReportPickup)}>
                            <ListItemIcon><Assessment style={{ color: theme.palette.primary.light }} /></ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="R. Recolección" />
                            {openReportPickup ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                        </ListItem>
                        <Collapse in={openReportPickup} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/reportcontrolpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrolpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrolpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reporttowerpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reporttowerpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reporttowerpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Torre Control" />
                                    </ListItem>
                                </Link>
                                <Link href="/reportcontrolskupickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrolskupickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrolskupickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control SKU" />
                                    </ListItem>
                                </Link>
                                <Link href="/reportcontrolproviderpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportcontrolproviderpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportcontrolproviderpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Control Proveedor" />
                                    </ListItem>
                                </Link>
                                <Link href="/reportpickup">
                                    <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button key="reportpickup" style={{ paddingLeft: theme.spacing(9) }} className={router.pathname === '/reportpickup' ? classes.activelink : null}>
                                        <ListItemText style={{ color: 'white' }} primary="R. Recolección" />
                                    </ListItem>
                                </Link>
                            </List>
                        </Collapse>
                    </List >
                </>
            )}

        </Drawer >
    );
}

export default Aside;