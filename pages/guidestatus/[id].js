import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import triggeraxios from '../../config/axiosv2';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    root: {
        width: "60%",
        marginLeft: 'auto', 
        marginRight: 'auto',
        maxWidth: '95%'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 5,
    },
    backgroundpending: {
        backgroundColor: '#e1e1e1',
        padding: '10px 10px'
    },
    backgroundactive: {
        backgroundColor: '#459a29',
        padding: '10px 20px'
    }
});


const LoadMassiveMain = () => {
    const router = useRouter();
    const classes = useStyles();

    const [guide, setguide] = useState(null);
    const { setOpenBackdrop, setOpenSnackBack, setloadingglobal, setModalQuestion } = useContext(popupsContext);

    const loaddetail = useCallback(async ({ id_guide, continuezyx = true }) => {
        setOpenBackdrop(true);
        const res = await triggeraxios('get', `api/web/guide/status/${id_guide}`);
        setOpenBackdrop(false);
        if (res.success && continuezyx) {
            const gg = res.result.data[0];
            
            gg.auxstatus = gg.last_status_motive ? "FINAL" : "PENDIENTE";
            gg.background = true;

            setguide(res.result.data[0]);
        }
    }, [])

    useEffect(() => {
        let continuezyx = true;
        if (router?.query?.id) {
            loaddetail({ id_guide: router.query.id, continuezyx })
        }

        return () => continuezyx = false;
    }, [router])

    return (
        
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#e1e1e1' }}>
                <Card className={classes.root}>
                    <CardContent>
                        <div style={{textAlign: 'center'}}>
                        <img src="/logotipo.png" width="200" />
                        </div>
                        {guide ? (
                            <div >
                                <Typography variant="h6" color="textSecondary">
                                    DETALLE DEL PEDIDO
                                </Typography>
                                <Typography className={classes.title} color="textSecondary">
                                    Cliente: {guide.client_name}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary">
                                    Direccion de entrega: {guide.address}
                                </Typography>
                                <Typography variant="subtitle2" className={classes.title} color="textSecondary">
                                    {guide.department} {guide.province} {guide.district}
                                </Typography>
                                <div className={clsx({
                                            [classes.backgroundpending]: guide.background,
                                            [classes.backgroundactive]: !guide.background,
                                            })}>
                                    <Typography variant="subtitle2" >
                                        ESTADO {guide.auxstatus}
                                    </Typography>
                                </div>

                                <Typography className={classes.title} color="textSecondary">
                                    PRODUCTO {guide.last_status}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary">
                                    PRODUCTO {guide.last_status_motive}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary">
                                    PRODUCTO {guide.last_status_date}
                                </Typography>
                            </div>
                        ) : null}

                    </CardContent>
                </Card>
        </div>
    );
}

export default LoadMassiveMain;