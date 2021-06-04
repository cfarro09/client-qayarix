import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const InputSimple = ({ name, label, type, classname = null, disabled = false, valuedefault = null, callback }) => {
    const [value, setvalue] = useState(valuedefault ?? "");
    if (type === "password") {

        const [showPassword, setShowPassword] = React.useState(false);

        const handleMouseDownPassword = (event) => {
            event.preventDefault();
        };

        const handleClickShowPassword = () => {
            setShowPassword(!showPassword);
        };
        
        return (
            <TextField
                variant="outlined"
                disabled={disabled}
                name={name}
                className={classname}
                label={label}
                size="small"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={value}
                onChange={e => {
                    if (callback)
                        callback(e.target.value)
                    setvalue(e.target.value)
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        )
    } else {
        return (
            <TextField
                name={name}
                disabled={disabled}
                label={label}
                className={classname}
                variant="outlined"
                size="small"
                value={value}
                onChange={e => {
                    if (callback)
                        callback(e.target.value)
                    setvalue(e.target.value)
                }}

            />
        );
    }
}

export default InputSimple;