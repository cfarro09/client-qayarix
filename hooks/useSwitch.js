import React, {useState} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwitchZyx = ({title, valueselected = false, namefield, formik, disabled = false, callback}) => {

    const [checked, setchecked] = useState(valueselected)

    const handleChange = (e) => {
        setchecked(e.target.checked);
        
        if (callback)
            callback(e.target.checked);

        const event = { target: { name: namefield, value: e.target.checked } };
        if (formik)
            formik.handleChange(event);
    }

    return (
        <FormControlLabel
            control={
                <Switch
                    disabled={disabled}
                    checked={checked} 
                    onChange={handleChange} 
                    name={namefield} />
            }
            label={title}
        />
    );
}
 
export default SwitchZyx;