import React, { useContext } from 'react';
import { Marker } from 'google-maps-react';
import assignmentContext from '../../context/assignment/assignmentContext';



const MarkerZyx = (props) => {

    const defaultIcon = {
        url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|0bce11|40|_|%E2%80%A2', // url
        scaledSize: new google.maps.Size(20, 30), // scaled size
    };
    const highlightedIcon = {
        url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|ea4335|40|_|%E2%80%A2', // url
        scaledSize: new google.maps.Size(20, 30), // scaled size
    };

    const { item } = props;
    const { selectMarker } = useContext(assignmentContext);


    // const [selected, setSelected] = useState(false);

    const handlerClickMarker = () => {
        selectMarker({...item, selected: !item.selected});
    }

    return (
        <Marker
            {...props}
            title={item.address}
            name={item.client_name}
            onClick={handlerClickMarker}
            icon={item.selected ? defaultIcon : highlightedIcon}
            position={{ lat: item.latitude, lng: item.longitude }} />
    );
}

export default MarkerZyx;