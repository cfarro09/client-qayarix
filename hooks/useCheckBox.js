import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const CheckBox = ({ valueselected = false, namefield, formik, disabled = false, callback }) => {

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
        <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            disabled={disabled}
        />
    );
}

export default CheckBox;