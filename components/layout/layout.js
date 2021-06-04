import { useState, useContext } from 'react';
import Head from 'next/head';
import Aside from './aside';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
// import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './header';
import { Global, css } from '@emotion/core';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import getConfig from 'next/config'
import authContext from '../../context/auth/authContext';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    containermainopen: {
        [theme.breakpoints.down('sm')]: {
            maxWidth: `60vw`,
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: `calc(100vw - ${drawerWidth}px - 49px)`,
        },
    },
    containermainclose: {
        [theme.breakpoints.down('sm')]: {
            maxWidth: `100vw`,
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: `calc(100vw - 49px)`,
        },
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.secondary.light,
    },
    hide: {
        display: 'none',
    },
    drawerOpen: {
        backgroundColor: theme.palette.secondary.light,
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: theme.palette.secondary.light,
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
        marginTop: theme.spacing(1)
    },
    containerLogin: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
    },
    activelink: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '& svg': {
            color: `white!important`
        },
        '& span': {
            color: 'white',
            fontWeight: 'bold',
        }
    }
}));

const Layout = ({ children }) => {
    const { user, infosys } = useContext(authContext);
    const router = useRouter();

    const classes = useStyles();
    const theme = useTheme();

    const { openDrawer, setOpenDrawer } = useContext(popupsContext);

    return (
        <>
            <Global
                styles={css`
                    html,body{
                        margin:0;
                    }
                    body{
                        margin:0;
                        padding:0;
                    }
                    footer {
                        width: 100%;
                        height: 50px;
                        border-top: 1px solid #eaeaea;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        }

                    footer img {
                        margin-left: 0.5rem;
                    }

                    footer a {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .logo {
                        height: 1em;
                    }
                    .containercon {
                        min-height: 90vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .row-zyx {
                        display: flex;
                        flex-wrap: wrap;
                        /* margin-bottom: ${theme.spacing(2)}px!important; */
                    }
                    .row-zyx > * {
                        width: 100%;
                        margin-right: 0;
                    }

                    .rowflex-zyx {
                        display: flex;
                        justify-content: space-between;
                    }
                    .row-zyx > .col-2, .row-zyx > .col-3, .row-zyx > .col-4, .row-zyx > .col-6, .row-zyx > .col-9 {
                        margin-bottom: ${theme.spacing(2)}px
                    }
                    @media (min-width: 768px) {
                        .row-zyx {
                            margin-bottom: 0!important;
                        }
                        .row-zyx > .col-2, .row-zyx > .col-3, .row-zyx > .col-4, .row-zyx > .col-6, .row-zyx > .col-9 {
                            width: calc(50% - ${theme.spacing(1)}px);
                            margin-right: ${theme.spacing(1)}px;
                            margin-bottom: ${theme.spacing(2)}px
                        }
                        .row-zyx > .col-4:last-child, .row-zyx > .col-6:last-child, .row-zyx > .col-3:last-child, .row-zyx > .col-2:last-child {
                            margin-right: 0px;
                        }
                    }
                    @media (min-width: 992px) {
                        .row-zyx {
                            margin-bottom: ${theme.spacing(1)}px!important;
                        }
                        .row-zyx > .col-9 {
                            width: calc(75% - ${theme.spacing(1)}px);
                            margin-right: ${theme.spacing(1)}px;
                            margin-bottom: ${theme.spacing(1)}px
                        }
                        .row-zyx > .col-3 {
                            width: calc(25% - ${theme.spacing(1)}px);
                            margin-right: ${theme.spacing(1)}px;
                            margin-bottom: ${theme.spacing(1)}px
                        }
                        .row-zyx > .col-2 {
                            width: calc(16.6% - ${theme.spacing(1)}px);
                            margin-right: ${theme.spacing(1)}px;
                            margin-bottom: ${theme.spacing(1)}px
                        }
                        .row-zyx > .col-4 {
                            width: calc(33.3% - ${theme.spacing(1)}px);
                            margin-right: ${theme.spacing(1)}px;
                            margin-bottom: ${theme.spacing(1)}px
                        }
                        .row-zyx > .col-3:last-child {
                            margin-right: 0px
                        }
                        .row-zyx > .col-2:last-child {
                            margin-right: 0px
                        }
                    }
                `}
            />
            <Head>
                <title>{infosys.sys_company_name}</title>
            </Head>

            <div className={classes.root}>
                {['/sign-in', '/sign-up'].indexOf(router.pathname) !== -1 ?
                    (
                        <Container component="main" maxWidth="xs" className={classes.containerLogin}>
                            <div>
                                {children}
                            </div>
                        </Container>
                    ) : (user !== undefined &&
                        (

                            <>
                                <Header
                                    classes={classes}
                                    open={openDrawer}
                                    setOpen={setOpenDrawer}
                                />

                                <Aside
                                    open={openDrawer}
                                    setOpen={setOpenDrawer}
                                    classes={classes}
                                    theme={theme}
                                />

                                <main className={clsx(classes.content, {
                                    [classes.contentShift]: openDrawer,
                                })}>
                                    <div className={classes.toolbar} />

                                    <div className='containercon'>
                                        <Box
                                            component='div' style={{ flex: 1 }}
                                            className={clsx({
                                                [classes.containermainopen]: openDrawer,
                                                [classes.containermainclose]: !openDrawer,
                                            })} >
                                            {children}
                                        </Box>
                                        <Box component="footer" px={2} pt={1} bgcolor="white">
                                            <a
                                                href="https://zyxmeapp.com/zyxme/app"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Powered by{' '}
                                                <img src={infosys.sys_company_img} alt="Zyxme" className="logo" />
                                            </a>
                                        </Box>
                                    </div>

                                </main>
                            </>
                        ))
                }
            </div>
        </>
    );
}

export default Layout;