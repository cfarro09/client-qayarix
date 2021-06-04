import React, { useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ReplyIcon from '@material-ui/icons/Reply';
import Typography from '@material-ui/core/Typography';
import trackingContext from '../../context/tracking/trackingContext'

const useStyles = makeStyles((theme) => ({
    rowinfo: {
        '& > *': {
            fontWeight: 'bold',
            marginLeft: theme.spacing(7),
        },
        '& > *:first-child': {
            marginLeft: 0
        },
    },
}));

const Message = ({ message, firstrow = false, lastmessage = true }) => {
    const classes = useStyles();

    const { setOpenModal, setMessageSelected } = useContext(trackingContext);

    const handleClick = () => {
        setOpenModal(true);
        setMessageSelected(message);
    }

    return (
        <>
            <Box p={1} mb={1} bgcolor={grey[100]}>
                {firstrow ? (
                    <div className={classes.rowinfo}>
                        <Typography variant="caption">Ticket: {message?.ticketnum}</Typography>
                        <Typography variant="caption">Estado: {message?.status}</Typography>
                        <Typography variant="caption">Último Agente: {message?.lastuser}</Typography>
                        <Typography variant="caption">Hora Cierre: {message?.datecloseticket}</Typography>
                    </div>
                ) :
                    (
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <div className={classes.rowinfo}>
                                
                                <Typography variant="caption">{lastmessage ? "Último Mensaje" : "Mensaje" }</Typography>
                            </div>
                            {(!message?.answered && message?.enablemessenger) && (
                                <div>
                                    <Fab 
                                        size="small" 
                                        aria-label="add"
                                        color="primary"
                                        onClick={handleClick}
                                    >
                                        <ReplyIcon size="small" color="action" />
                                    </Fab>
                                </div>
                            )}
                        </div>
                    )
                }
                <Box pl={2} pr={4} pt={message?.answered ? 2 : 0} pb={2} >
                    <Typography variant="body2">{message?.message}</Typography>
                    {message?.media && (
                        <div style={{textAlign: 'center'}}>
                            <img width="300" src={message.media}/>
                        </div>
                    )}
                </Box>
                <div className={classes.rowinfo}>
                    <Typography variant="caption">Facebook: {message?.externalname}</Typography>
                    <Typography variant="caption">Clasificación: {message?.classification}</Typography>
                    <Typography variant="caption">Respondido: {message?.answered ? "SI" : "NO"}</Typography>
                    <Typography variant="caption">{message?.datecreatedmessage}</Typography>
                </div>
            </Box>
        </>
    );
}

export default Message;