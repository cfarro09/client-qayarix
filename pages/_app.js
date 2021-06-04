import React, { useContext } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ThemeProvider, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import AuthState from '../context/auth/authState';
import PopUps from '../components/layout/popups';
import PopUpsState from '../context/pop-ups/pop-upsState';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-image-lightbox/style.css'; // theme css file
import authContext from '../context/auth/authContext';

export default function MyApp({ Component, pageProps }) {

    // const { infosys } = useContext(authContext);
    // console.log(infosys);
    

    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const ProtectRoute = ({ children }) => {
        const { tologged, infosys } = useContext(authContext);

        const { sys_company_color_primary, sys_company_color_secondary } = infosys;

        if (tologged.isloading || (!tologged.logged && ['/sign-in', '/sign-up'].indexOf(window.location.pathname) === -1) || (tologged.logged && (window.location.pathname === '/sign-in'))) {
            return (
                <Backdrop open={true} style={{ zIndex: theme().zIndex.drawer + 999999999, color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        return (
            <MuiThemeProvider theme={theme(sys_company_color_primary, sys_company_color_secondary)}>
                {children}
            </MuiThemeProvider>
        )
            ;
    };

    return (
        <React.Fragment>

            {/* <ThemeProvider theme={theme()}> */}

            <AuthState>
                <PopUpsState>
                    <ProtectRoute>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </ProtectRoute>
                    <PopUps />
                </PopUpsState>
            </AuthState>
        </React.Fragment >
    );
}