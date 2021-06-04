import React, { useContext } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import trackingContext from '../../context/tracking/trackingContext'
import { makeStyles } from '@material-ui/core/styles';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import IconButton from '@material-ui/core/IconButton';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Tooltip from "@material-ui/core/Tooltip";
import triggeraxios from '../../config/axiosv2';
import {
    Delete as DeleteIcon,
} from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        maxHeight: 650,
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
}));

const Images = () => {
    const classes = useStyles();
    const { images, id_shipping_order, removeimage } = useContext(trackingContext);

    const { setLightBox, setModalQuestion, setOpenBackdrop, setOpenSnackBack } = useContext(popupsContext);

    const callbackremove = (oo) => {
        const callback = async () => {
            setModalQuestion({ visible: false });
            const dattosend = {
                method: "SP_ELIMINAR_IMAGEN",
                data: oo
            }

            setOpenBackdrop(true);
            const res = await triggeraxios('post', '/api/web/main', dattosend);
            
            if (res.success) {
                removeimage(oo);
                setOpenSnackBack(true, { success: true, message: 'Imagen eliminada satisfactoriamente.' });
            } else
                setOpenSnackBack(true, { success: false, message: 'Hubo un error, vuelva a intentarlo' });

            setOpenBackdrop(false)
        }

        setModalQuestion({ visible: true, question: `¿Está seguro de eliminar la imagen?`, callback })
    }

    return (
        <div className={classes.root}>
            <GridList cellHeight={160} className={classes.gridList} cols={3}>
                {images.filter(x => x.id_shipping_order === id_shipping_order).map((image, index) => (
                    <GridListTile
                        key={image.url}
                        cols={1}
                    >
                        <img
                            src={image.url}
                            alt={image.date_created}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setLightBox({ open: true, index, images: images.filter(y => y.id_shipping_order === id_shipping_order).map(z => z.url) })}
                        />
                        <GridListTileBar
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            titlePosition="top"
                            actionIcon={
                                <Tooltip title="Eliminar esta imagen">
                                    <IconButton 
                                        className={classes.icon}
                                        onClick={() => callbackremove({id_shipping_order, url: image.url})}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

export default Images;