import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import clsx from 'clsx';
import {
    FirstPage,
    LastPage,
    NavigateNext,
    NavigateBefore,
    MoreVert as MoreVertIcon,
    Refresh as RefreshIcon,
    Add as AddIcon
} from '@material-ui/icons';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { optionsMenu } from './useTable';
import ButtonExport from '../components/form/buttonexport';
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
} from 'react-table'

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
    trdynamic: {
        '&:hover': {
            boxShadow: '0 11px 6px -9px rgb(84 84 84 / 78%)',
            "& $containerfloat": {
                visibility: 'visible'
            }
        },
    },
    containerfloat: {
        borderBottom: 'none',
        padding: '4px 24px 4px 16px',
        backgroundColor: 'white',
        marginTop: '1px',
        position: 'absolute',
        zIndex: 9999,
        left: 0,
        visibility: 'hidden'
    }
}));

const TableZyx = ({
    columns,
    titlemodule,
    fetchData,
    data,
    register,
    selectrow,
    HeadComponent = null,
    pageSizeDefault = 20
}) => {


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
            if (!cellvalue)
                return false;
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
                        return cellvalue ? cellvalue.toString().toLowerCase().includes(value.toLowerCase()) : cellvalue;
                }
            }
        });
    };
    const classes = useStyles();
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
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: pageSizeDefault },
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
            fetchData();

        return () => next = false;

    }, [fetchData])

    return (
        <Box style={{ height: '100%' }}>
            <Box display="flex" justifyContent="space-between" mb={titlemodule ? 2 : 0} ml={1}>
                {titlemodule &&
                    <Typography variant="h6" id="tableTitle" component="div">
                        {titlemodule}
                    </Typography>
                }
                <span>
                    {register && (
                        <Tooltip title="Registrar">
                            <Fab
                                size="small"
                                aria-label="add"
                                style={{ marginLeft: '1rem', backgroundColor: '#E0AD30' }}
                                onClick={() => selectrow(null)}
                            >
                                <AddIcon size="small" color="secondary" />
                            </Fab>
                        </Tooltip>
                    )}
                    {fetchData && (
                        <Tooltip title="Refrescar">
                            <Fab
                                size="small"
                                aria-label="add"
                                color="primary"
                                style={{ marginLeft: '1rem' }}
                                onClick={() => fetchData && fetchData({})}
                            >
                                <RefreshIcon size="small" color="secondary" />
                            </Fab>
                        </Tooltip>
                    )}
                    <Tooltip title="Descargar">
                        <span style={{ marginLeft: '1rem' }}>
                            <ButtonExport
                                csvData={data}
                                fileName={`report${titlemodule}`}
                                columnsexport={columns.filter(x => (!x.isComponent && x.activeOnHover))}
                            />
                        </span>
                    </Tooltip>
                </span>
            </Box>
            {HeadComponent && <HeadComponent />}
            <TableContainer style={{position: "relative"}}>
                <Box overflow="auto" >
                    <Table width="90%" {...getTableProps()} aria-label="enhanced table" size="small" aria-labelledby="tableTitle">
                        <TableHead>
                            {headerGroups.map((headerGroup, index) => (
                                <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ? 
                                        <th width="0px"></th> :
                                        <TableCell key={ii}>
                                            {column.isComponent ?
                                                column.render('Header')
                                                : (
                                                    <>
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
                                                        <div>{!column.NoFilter && column.render('Filter')}</div>
                                                    </>
                                                )
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {page.map((row, index) => {
                                prepareRow(row)
                                return (
                                    <TableRow 
                                        {...row.getRowProps()} 
                                        className={classes.trdynamic}
                                        key={"columnas" + index}
                                    >
                                        {row.cells.map((cell, i) =>
                                        <>
                                            <TableCell {...cell.getCellProps()} align={typeof cell.value === "number" ? "right" : "left"} 
                                            className={clsx({
                                                [classes.containerfloat]: headerGroups[0].headers[i].activeOnHover},
                                            )}
                                            >
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
                                            </TableCell>
                                            </>
                                        )}
                                        {/* <div className={classes.containerfloat}>ICONOS CHINGONES</div> */}
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
                            Registros por página
                        </Box>
                    </Box>
                </Box>
            </TableContainer>
        </Box>
    )
}

export default TableZyx;