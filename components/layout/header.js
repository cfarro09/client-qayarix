import React, { useState, useContext, useEffect } from 'react';

import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import authContext from '../../context/auth/authContext';
import popupsContext from '../../context/pop-ups/pop-upsContext';

const Header = ({ classes, open, setOpen }) => {

    const { user, signout, infosys } = useContext(authContext);
    const { loading, setOpenBackdrop } = useContext(popupsContext);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const openprofile = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseSesion = () => {
        setAnchorEl(null);
        signout()
    };

    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                >
                    <MenuIcon color="secondary" />
                </IconButton>
                <div className={classes.title}>
                    <h1 style={{ margin: 0, padding: 0 }}>{infosys.sys_company_name}</h1>
                </div>

                <div style={{ display: 'flex' }}>
                    <Button
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        text="hola"
                        color="inherit"
                        startIcon={<AccountCircle />}

                    >{user ? `${user.firstname} ${user.lastname}` : ''}
                    </Button>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openprofile}
                        onClose={handleClose}
                    >
                        {/* <MenuItem>Cambiar contraseña</MenuItem> */}
                        <MenuItem onClick={handleCloseSesion}>Cerrar Sesión</MenuItem>
                    </Menu>
                </div>

            </Toolbar>
            {loading && (<LinearProgress color="secondary" />)}
        </AppBar>

    );
}

export default Header;