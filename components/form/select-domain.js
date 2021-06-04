import React, { useEffect, useState } from 'react';
import triggeraxios from '../../config/axiosv2';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import axios from "axios";

const SelectDomain = (domainname, valueselected = "", namefield = "", formik = false) => {

    const [options, setOptions] = useState([]);
    const [loading, setloading] = useState(true);
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const setHardValue = (valuetoset) => {
        setInputValue('');
        setValue(null);
        if (valuetoset) {
            const optionfind = options.find(o => o.domainvalue === valuetoset);
            if (optionfind) {
                setInputValue(optionfind.domaindesc);
                setValue(optionfind);
            }
        }
    }

    useEffect(() => {
        const source = axios.CancelToken.source();

        (async () => {
            const datatosend = {
                method: "UFN_DOMAIN_LST_VALORES",
                data: {
                    domainname
                }
            }
            const res = await triggeraxios('post', '/api/web/main/', datatosend, null, source);
            if (res.success && res.result instanceof Array) {
                setOptions(res.result);
                setHardValue(valueselected)
            }
            setloading(false);
        })();

        return () => {
            source.cancel();
        }
    }, []);

    const Select = ({ title }) => (
        <Autocomplete
            size="small"
            value={value}
            inputValue={inputValue}
            onChange={(_, newValue) => {
                if (formik && newValue) {
                    const event = { target: { name: namefield, value: newValue.domainvalue } };
                    formik.handleChange(event);
                }
                setValue(newValue);
            }}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            getOptionLabel={option => option ? option.domaindesc : ''}
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
    return [Select, value, inputValue];
}

export default SelectDomain;