import React, { useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import triggeraxios from '../../config/axiosv2';
import Box from '@material-ui/core/Box';
import trackingContext from '../../context/tracking/trackingContext'
import popupsContext from '../../context/pop-ups/pop-upsContext';
import { object } from 'yup';

const requestdatainfo = id_guide => ({
    method: "SP_SEL_GUIDE_INFO",
    data: { id_guide }
});

const requestdatatracking = id_guide => ({
    method: "SP_SEL_GUIDE_TRACKING",
    data: { id_guide }
});
const requestdataimages = id_guide => ({
    method: "SP_SEL_IMG_GUIDES",
    data: { id_guide }
});

const ItemGuide = ({ guide }) => {

    const { setOpenBackdrop, setOpenSnackBack, setModalQuestion } = useContext(popupsContext);
    const { selectguide, id_guide } = useContext(trackingContext);

    const handleselect = async () => {

        const data = {
            id_guide: guide.id_guide,
            attempts: []
        }
        setOpenBackdrop(true);
        await Promise.all([
            triggeraxios('post', '/api/web/main/', requestdatainfo(guide.id_guide)).then(r => data.infoguide = { ...r.result.data[0], skus: r.result.data.map(x => ({ code: x.sku_code, description: x.sku_description, brand: x.sku_brand })) }),
            triggeraxios('post', '/api/web/main/', requestdatatracking(guide.id_guide)).then(r => {
                const listdata = r.result.data.map(x => ({...x, attempt: x.attempt === 0 ? 1 : x.attempt})).filter(x => !/DESPACHADO|PENDIENTE|DESPACHO ACEPTADO/gi.test(x.status));
                const ooaux = listdata.reduce((repeated, item) => {
                    repeated[item.attempt] = item.id_shipping_order;
                    return repeated;
                }, {});
                
                for (const [key, value] of Object.entries(ooaux)) {
                    data.attempts.push({desc: `Visita ${key}`, attempt: key, id_shipping_order: value})
                }
                const lastattempt = data.attempts[data.attempts.length - 1];
                data.tracking = listdata;
                data.id_shipping_order = lastattempt.id_shipping_order;
                data.attempt = lastattempt.attempt;
                data.trackingselected = listdata.filter(x => x.attempt == lastattempt.attempt)
            }),
            triggeraxios('post', '/api/web/main/', requestdataimages(guide.id_guide)).then(r => data.images = r.result.data)
        ]);
        selectguide(data);
        setOpenBackdrop(false)
    }

    return (
        <>
            <ListItem
                button
                selected={guide.id_guide === id_guide}
                onClick={handleselect}
            >
                <ListItemText

                    primary={<span style={{display: 'flex'}}><Typography type="body2">{guide.client_barcode}</Typography><Typography type="body2" style={{ marginLeft: '5px', color: (guide.type || "DISTRIBUCION") === "DISTRIBUCION" ? "red" : "blue" }}>{"(" + (guide.type || "DISTRIBUCION") + ")"}</Typography></span>}


                    // primary={guide.client_barcode + }
                    secondary={guide.client_name}
                />

                <Box my="auto">
                    <Typography
                        component="div"
                        variant="caption"
                        color="textPrimary"
                    >
                        {guide.last_status_date.split(" ")[0]}
                    </Typography>
                    <Typography
                        component="div"
                        variant="caption"
                        color="textPrimary"
                    >
                        {guide.last_status_date.split(" ")[1]}
                    </Typography>
                </Box>
                <Box ml={3} my="auto" width={100}>
                    <Typography
                        component="div"
                        variant="caption"
                        color="textPrimary"
                    >
                        {guide.quadrant_name}
                    </Typography>
                    <Typography
                        component="div"
                        variant="caption"
                        color="textPrimary"
                        style={{fontWeight: 'bold'}}
                    >
                        {guide.last_status}
                    </Typography>
                </Box>
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}

export default ItemGuide;