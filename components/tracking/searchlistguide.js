import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import triggeraxios from '../../config/axiosv2';
import trackingContext from '../../context/tracking/trackingContext'
import popupsContext from '../../context/pop-ups/pop-upsContext';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const optionsFilterBy = [
	{ description: 'Codigo de Barras', value: 'client_barcode' },
	{ description: 'Codigo de Seguimiento', value: 'seg_code' },
	{ description: 'N° de Guia', value: 'guide_number' },
	{ description: 'DNI Cliente', value: 'client_dni' },
]

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		marginTop: '1rem'

	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

const requestdata = (client_barcode, filterBy) => (
	{
		method: "SP_SEL_GUIDE_BY_BARCODE",
		data: {
			client_barcode,
			filterBy
		}
	}
)
const SearchGuide = ({ }) => {

	const { setOpenBackdrop, setOpenSnackBack, setModalQuestion } = useContext(popupsContext);
	const { guides, addguide } = useContext(trackingContext);
	const [filterby, setfilterby] = useState({ description: 'Codigo de Barras', value: 'client_barcode' });
	const classes = useStyles();
	const [textsearch, settextsearch] = useState('');

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const searchbarcode = async () => {
		const listposibles = textsearch.split(",");
		
		listposibles.forEach(async textsearch => {
			const textcleaned = textsearch.trim();
			if (guides.some(x => x[filterby.value] === textcleaned)) {
				setOpenSnackBack(true, { success: false, message: `El ${filterby.description} ya fue consultado.` });
				return;
			}
			if (textcleaned) {
				setOpenBackdrop(true);
				const res = await triggeraxios('post', '/api/web/main/', requestdata(textcleaned, filterby.value));

				if (res.success) {
					if (res.result.data && res.result.data.length > 0) {
						addguide(res.result.data);
						settextsearch("");
					} else {
						setOpenSnackBack(true, { success: false, message: `No se encontró ese ${filterby.description}.` });
					}
				}
				setOpenBackdrop(false);
			}
		});

	}

	const handlersubmit = (e) => {
		e.preventDefault();
		searchbarcode();
	}

	return (
		<Paper component="form" onSubmit={handlersubmit} className={classes.root}>
			<InputBase
				className={classes.input}
				placeholder={`Buscar por codigo de ${filterby.description}`}
				inputProps={{ 'aria-label': 'buscar guideo' }}
				value={textsearch}
				onChange={e => settextsearch(e.target.value)}
			/>
			<IconButton type="button" onClick={searchbarcode} className={classes.iconButton} aria-label="search">
				<SearchIcon />
			</IconButton>
			<IconButton type="button" onClick={handleClick} className={classes.iconButton} aria-label="filterby">
				<MoreVertIcon
					aria-label="more"
					aria-controls="long-menu"
					aria-haspopup="true"
				/>
			</IconButton>
			<Menu
				id="long-menu"
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						maxHeight: 48 * 4.5,
						width: '25ch',
					},
				}}
			>
				{optionsFilterBy.map((option) => (
					<MenuItem key={option.value} selected={option.value === filterby.value} onClick={() => {
						handleClose();
						setfilterby(option);
					}}>
						{option.description}
					</MenuItem>
				))}
			</Menu>
		</Paper>
	);
}

export default SearchGuide;