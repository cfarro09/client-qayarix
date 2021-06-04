import React, { useEffect, useState } from 'react';
import triggeraxios from '../config/axiosv2';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import axios from "axios";

const UseSelectDomain = ({title, domainname, valueselected = "", namefield = "", formik = false, classname = null, disabled = false, callback}) => {
    
    const [options, setOptions] = useState([]);
    const [loading, setloading] = useState(true);
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const setHardValue = (dataoptions, valuetoset) => {
        setInputValue('');
        setValue(null);
        if (valuetoset) {
            const optionfind = dataoptions.find(o => o.domain_value === valuetoset);
            if (optionfind) {
                setInputValue(optionfind.domain_description);
                setValue(optionfind);

                if (callback)
                    callback({newValue: optionfind})
            }
        }
    }

    useEffect(() => {
        const source = axios.CancelToken.source();

        (async () => {
            if (typeof domainname === "string") {
                const datatosend = { 
                    method: "SP_SEL_DOMAIN",
                    data: {
                        domain_name: domainname,
                        status: 'ACTIVO'
                    }
                }
                const res = await triggeraxios('post', '/api/web/main/', datatosend, null, source);
                if (res.success && res.result.data instanceof Array) {
                    setOptions(res.result.data);
                    setHardValue(res.result.data, valueselected)
                }
                setloading(false);
            } else if (domainname instanceof Array){
                setloading(false);
                setOptions(domainname);
                setHardValue(domainname, valueselected)
            }
        })();

        return () => {
            source.cancel();
        }
    }, []);

    return (
        <Autocomplete
            className={classname}
            size="small"
            value={value}
            inputValue={inputValue}
            disabled={disabled}
            onChange={(_, newValue) => {
                if (formik) {
                    const event = { target: { name: namefield, value: (newValue ? newValue.domain_value : '') } };
                    formik.handleChange(event);
                    
                }
                setValue(newValue);
                if (callback)
                    callback({newValue});
            }}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            getOptionLabel={option => option ? option.domain_description : ''}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={title}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    )
    
}

export default UseSelectDomain;