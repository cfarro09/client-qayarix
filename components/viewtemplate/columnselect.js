import React from 'react';
import InputSimple from '../form/inputsimple';
import { useTheme } from '@material-ui/core/styles';
import SwitchZyx from '../../hooks/useSwitch'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const ColumnSelect = ({ r, setselectedcolumns, setoptionscolumn }) => {

    const theme = useTheme();

    const handlerdelete = () => {
        setselectedcolumns(p => p.filter(x => x.columnbd !== r.columnbd));
        setoptionscolumn(p => p.map(x => {
            return {
                ...x,
                selected: x.columnbd === r.columnbd ? false : x.selected
            }
        }));
    }

    const handlerswitch = checked => {
        setselectedcolumns(p => p.map(x => {
            return {
                ...x,
                obligatory: x.columnbd === r.columnbd ? checked : x.obligatory
            }
        }));
    }

    const handlertext = text => {
        setselectedcolumns(p => p.map(x => {
            return {
                ...x,
                keyexcel: x.columnbd === r.columnbd ? text : (x.keyexcel ?? "")
            }
        }));
    }

    return (
        <div className="row-zyx" style={{ marginBottom: theme.spacing(1) }}>
            <div className="col-3" style={{ display: 'flex', alignItems: 'center' }}>{r.columnbddesc}</div>
            <InputSimple
                classname="col-3"
                callback={handlertext}
                valuedefault={r.keyexcel}
                name="headerexcel"
                label="Titulo Excel"
            />
            <span className="col-3" style={{ textAlign: 'center' }}>
                <SwitchZyx
                    namefield="obligatory"
                    disabled={r.obligatorycolumn}
                    callback={handlerswitch}
                    valueselected={r.obligatory}
                />

            </span>
            <span className="col-3" style={{ display: 'flex', alignItems: 'center' }}>
                {!r.obligatorycolumn && (
                    <IconButton
                        aria-label="delete"
                        onClick={handlerdelete}
                        size="small"
                    >
                        <DeleteIcon
                            fontSize="inherit"
                            size="small"
                            color="secondary"
                        />
                    </IconButton>
                )}
            </span>
        </div>
    );
}

export default ColumnSelect;