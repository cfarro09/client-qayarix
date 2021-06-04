import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const InputFormk = ({ name, label, formik, type = "text", classname = null, disabled = false, valuedefault = null, callback = null}) => {
    const [valuex, setValuex] = useState("");
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
                value={!valuedefault ? (formik?.values?.[name] || "") : valuedefault}
                onChange={ e => {
                    if (callback)
                        callback(e.target.value)
                    formik?.handleChange(e);
                }}
                onBlur={formik?.handleBlur}
                error={formik?.errors[name] ? true : false}
                helperText={formik?.errors[name]}
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
                autoComplete="off"
                className={classname}
                type={type}
                fullWidth
                variant="outlined"
                size="small"
                value={!valuedefault ? (formik ? formik?.values?.[name] || "" : valuex) : valuedefault}
                onChange={ e => {
                    if (formik)
                        formik.handleChange(e);
                    else 
                        setValuex(e.target.value)
                    if (callback)
                        callback(e.target.value, setValuex);
                    
                }}
                onBlur={formik?.handleBlur}
                error={formik?.errors[name] ? true : false}
                helperText={formik?.errors[name]}
            />
        );
    }
}

export default InputFormk;