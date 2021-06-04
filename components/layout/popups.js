import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar'; import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import popupsContext from '../../context/pop-ups/pop-upsContext'
import Lightbox from 'react-image-lightbox';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 999999999,
        color: '#fff',
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PopUps = () => {
    const classes = useStyles();

    const { auxiliarSnackbar, openSnackbar, ligthBox, setLightBox, openBackdrop, setOpenSnackBack, modalquestion, setModalQuestion } = useContext(popupsContext);

    const handleCloseSnackbar = () => {
        setOpenSnackBack(false, auxiliarSnackbar)
    };

    const handleCloseQuestion = () => {
        if (modalquestion.callbackcancel)
            modalquestion.callbackcancel();
        setModalQuestion({ visible: false, question: '', callback: null })
    }

    const handleExeQuestion = () => {
        if (modalquestion.callback)
            modalquestion.callback();
    }
    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                key={'topright'}
            >
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={auxiliarSnackbar.success ? "success" : "error"}>
                    {auxiliarSnackbar.message}
                </MuiAlert>
            </Snackbar>

            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                open={modalquestion.visible}
                TransitionComponent={Transition}
                keepMounted
                style={{ zIndex: 99999 }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Confirmación</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {modalquestion.question}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseQuestion} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleExeQuestion} color="primary">
                        Seguir
                    </Button>
                </DialogActions>
            </Dialog>
            {ligthBox.open && (
                
                <Lightbox
                    reactModalStyle={{ overlay: { zIndex: 2000 } }}
                    mainSrc={ligthBox.images[ligthBox.index]}
                    nextSrc={ligthBox.images[(ligthBox.index + 1) % ligthBox.images.length]}
                    prevSrc={ligthBox.images[(ligthBox.index + ligthBox.images.length - 1) % ligthBox.images.length]}
                    onCloseRequest={() => setLightBox({ open: false, index: 0 })}
                    onMovePrevRequest={() => setLightBox({ ...ligthBox, index: (ligthBox.index + ligthBox.images.length - 1) % ligthBox.images.length })}
                    onMoveNextRequest={() => setLightBox({ ...ligthBox, index: (ligthBox.index + 1) % ligthBox.images.length })}
                />
            )}
        </>
    );
}

export default PopUps;