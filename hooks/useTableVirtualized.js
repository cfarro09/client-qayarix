import React, { useState, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { FirstPage, LastPage, NavigateNext, NavigateBefore } from '@material-ui/icons';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, lighten } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import popupsContext from '../context/pop-ups/pop-upsContext';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import { optionsMenu } from './useTable';

import {
    useTable,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
} from 'react-table'
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    footerTable: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent: "space-between",
        },
        '& > div': {
            display: 'block',
            textAlign: 'center',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
                alignItems: "center",
            },
        }
    },
    root: {
        minHeight: '50px',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = ({ numSelected, processSelected, selected }) => {
    const classes = useStyles();

    return (
        numSelected > 0 && (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} seleccionados
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={() => processSelected(selected)}
                >PROCESAR
                </Button>
            </Toolbar>
        )
    );
};

function EnhancedTableHead({ onSelectAllClick, headerGroups, selectrow, numSelected, rowCount, workcheck, onlyrow }) {
    return (
        <TableHead>
            {headerGroups.map((headerGroup, index) => (
                <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>

                    {selectrow && <TableCell>{' '}</TableCell>}
                    
                    <TableCell padding="checkbox">
                        {(workcheck && !onlyrow) && (
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                onChange={onSelectAllClick}
                                inputProps={{ 'aria-label': 'select all desserts' }}
                            />
                        )}
                    </TableCell>
                    {headerGroup.headers.map((column, ii) => (
                        <TableCell
                            key={ii}
                        >
                            <Box
                                component="div"
                                {...column.getHeaderProps(column.getSortByToggleProps({ title: 'ordenar' }))}
                                style={{
                                    whiteSpace: 'nowrap',
                                    wordWrap: 'break-word',
                                    cursor: 'pointer'
                                }}
                            >
                                {column.render('Header')}
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? <ArrowDownwardIcon ml={1} style={{ fontSize: 15 }} color="action" />
                                        : <ArrowUpwardIcon ml={1} style={{ fontSize: 15 }} color="action" />
                                    : ''}
                            </Box>
                            <div>{column.canFilter && column.render('Filter')}</div>
                        </TableCell>
                    ))}
                    {selectrow && <TableCell>{' '}</TableCell>}
                </TableRow>
            ))}
        </TableHead>
    );
}


const TableZyx = ({ columns, titlemodule, fetchData, data, register, selectrow, deleterow, rowselected, HeadComponent = null, keycheck, processSelected, workcheck = true, onlyrow = false, selectOnlyRow = null }) => {
    const classes = useStyles();
    const selectColumnFilter = ({
        
        column: { setFilter, type },
    }) => {
        const [value, setValue] = useState('');
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const [operator, setoperator] = useState("contains");
        const handleCloseMenu = () => {
            setAnchorEl(null);
        };
        const handleClickItemMenu = (op) => {
            setAnchorEl(null);
            setoperator(op)
        };
        const handleClickMenu = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const keyPress = (e) => {
            if (e.keyCode == 13) {
                setFilter({ value, operator, type });
            }
        }

        useEffect(() => {
            if (type === "number")
                setoperator("equals");
        }, [type]);

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                    }
                    type={type === "number" ? "number" : "text"}
                    style={{ fontSize: '15px', minWidth: '100px' }}
                    size="small"
                    fullWidth
                    value={value}
                    onKeyDown={keyPress}
                    onChange={e => {
                        setValue(e.target.value || '');
                    }}
                />
                <div style={{ width: '12px' }} />
                <MoreVertIcon
                    style={{ cursor: 'pointer' }}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClickMenu}
                    color="action"
                    fontSize="small"
                />
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {type === "number" ?
                        optionsMenu.filter(x => x.type !== 'onlystring').map((option) => (
                            <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                                {option.value}
                            </MenuItem>
                        ))
                        :
                        optionsMenu.filter(x => x.type !== 'onlynumber').map((option) => (
                            <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                                {option.value}
                            </MenuItem>
                        ))}
                </Menu>
            </div>
        );
    }

    const filterCellValue = (rows, id, filterValue) => {
        const { value, operator, type } = filterValue;

        return rows.filter(row => {
            const cellvalue = row.values[id];
            if (type === "number") {
                switch (operator) {
                    case 'greater':
                        return cellvalue > value;
                    case 'greaterequal':
                        return cellvalue >= value;
                    case 'smaller':
                        return cellvalue < value;
                    case 'smallerequal':
                        return cellvalue <= value;
                    case 'noequals':
                        return cellvalue != value;
                    case 'equals':
                    default:
                        return cellvalue == value;
                }
            } else {
                switch (operator) {
                    case 'equals':
                        return cellvalue === value;
                    case 'noequals':
                        return cellvalue !== value;
                    case 'nocontains':
                        return !cellvalue.toLowerCase().includes(value.toLowerCase());
                    case 'empty':
                        return cellvalue == '' || cellvalue == null;
                    case 'noempty':
                        return cellvalue != '' && cellvalue != null;
                    case 'contains':
                    default:
                        return cellvalue.toLowerCase().includes(value.toLowerCase());
                }
            }
        });
    };
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: (props) => selectColumnFilter({ ...props, data }),
            filter: filterCellValue,
        }),
        []
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        preGlobalFilteredRows,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
            defaultColumn,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    useEffect(() => {
        let next = true;
        if (fetchData && next)
            fetchData(rowselected);

        return () => next = false;

    }, [fetchData])
    const { setOpenSnackBack } = useContext(popupsContext);
    const [selected, setSelected] = React.useState([]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = preGlobalFilteredRows.map((n) => n.original[keycheck]);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_, id) => {
        if (!workcheck) return;

        if (onlyrow) {
            setSelected([id]);
            if (selectOnlyRow) {
                selectOnlyRow(preGlobalFilteredRows.find(x => x.original[keycheck] === id).original);
            }
            return;
        }
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handlesetchecked = (id) => {
        if (!workcheck) return;
        let newSelected = [];
        const selectedIndex = selected.indexOf(id);

        if (selectedIndex === -1) {
            if (preGlobalFilteredRows.find(x => x.original[keycheck] === id)) {
                newSelected = newSelected.concat(selected, id);
                setSelected(newSelected);
            }
            else
                setOpenSnackBack(true, { success: false, message: 'No se encontró el registro' });
        } else {
            setOpenSnackBack(true, { success: false, message: 'Ya fue registrado' });
        }
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <Box component={Paper} px={2} pt={2} mx={1} mb={2} style={{ height: '100%' }}>
            <Box display="flex" justifyContent="space-between" mb={titlemodule ? 2 : 0}>
                {HeadComponent && <HeadComponent handleClick={handlesetchecked} />}
                {titlemodule &&
                    <Typography variant="h6" id="tableTitle" component="div">
                        {titlemodule}
                    </Typography>
                }
                <span>
                    {register && (
                        <Fab
                            size="small"
                            aria-label="add"
                            style={{ marginLeft: '1rem', backgroundColor: '#E0AD30' }}
                            onClick={() => selectrow(null)}
                        >
                            <AddIcon size="small" color="secondary" />
                        </Fab>
                    )}
                    {fetchData && (
                        <Fab
                            size="small"
                            aria-label="add"
                            color="primary"
                            style={{ marginLeft: '1rem' }}
                            onClick={() => fetchData && fetchData({})}
                        >
                            <RefreshIcon size="small" color="secondary" />
                        </Fab>
                    )}
                </span>
            </Box>
            {(workcheck && !onlyrow) && (
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    processSelected={processSelected}
                    selected={selected}
                />
            )}

            <TableContainer >
                <Box overflow="auto">
                    <Table width="90%" {...getTableProps()} aria-label="enhanced table" size="small" aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            workcheck={workcheck}
                            headerGroups={headerGroups}
                            selectrow={selectrow}
                            onSelectAllClick={handleSelectAllClick}
                            onlyrow={onlyrow}
                            rowCount={preGlobalFilteredRows.length}
                        />

                        <TableBody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                const idrowdetail = row.original[keycheck];
                                const isItemSelected = isSelected(idrowdetail);
                                const labelId = `enhanced-table-checkbox-${i}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(_) => handleClick(_, idrowdetail)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={idrowdetail}
                                        selected={isItemSelected}
                                        {...row.getRowProps()}>
                                        {selectrow && (
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="edit"
                                                    size="small"
                                                    onClick={() => selectrow(row.original)}
                                                >
                                                    <EditIcon
                                                        fontSize="inherit"
                                                        size="small"
                                                        color="secondary"
                                                    />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                        <TableCell padding="checkbox">
                                            {row.original.status === "PENDIENTE" && (
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            )}
                                        </TableCell>
                                        {row.cells.map(cell => {
                                            return (
                                                <TableCell {...cell.getCellProps()} align={typeof cell.value === "number" ? "right" : "left"}>
                                                    {cell.value?.length > 100 ? (
                                                        <Tooltip TransitionComponent={Zoom} title={cell.value}>
                                                            <Box m={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width={400}>
                                                                {cell.render('Cell')}
                                                            </Box>
                                                        </Tooltip>
                                                    )
                                                        :
                                                        <Box m={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width={1}>
                                                            {cell.render('Cell')}
                                                        </Box>
                                                    }
                                                </TableCell>)
                                        })}
                                        {deleterow && (
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        deleterow(row.original)
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        fontSize="inherit"
                                                        size="small"
                                                        color="secondary"
                                                    />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Box>
                <Box className={classes.footerTable}>
                    <Box>
                        <IconButton
                            onClick={() => gotoPage(0)} disabled={!canPreviousPage}
                            disabled={!canPreviousPage}
                        >
                            <FirstPage />
                        </IconButton>
                        <IconButton
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                        >
                            <NavigateNext />
                        </IconButton>
                        <IconButton
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                        >
                            <LastPage />
                        </IconButton>
                        <Box component="span" fontSize={14}>
                            Página <Box fontWeight="700" component="span">{pageIndex + 1}</Box> de <Box fontWeight="700" component="span">{pageOptions.length}</Box>
                        </Box >

                    </Box>
                    <Box>
                        Mostrando {page.length} registros de {preGlobalFilteredRows.length}
                    </Box>
                    <Box>
                        <Select
                            disableUnderline
                            style={{ display: 'inline-flex' }}
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value))
                            }}
                        >
                            {[10, 20, 50, 100].map(pageSize => (
                                <MenuItem key={pageSize} value={pageSize}>
                                    {pageSize}
                                </MenuItem >
                            ))}
                        </Select>
                        <Box fontSize={14} display="inline" style={{ marginRight: '1rem' }}>
                            Registros por Página
                        </Box>
                    </Box>
                </Box>
            </TableContainer>
        </Box>
    )
}

export default TableZyx;