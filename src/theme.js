import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = (primary,  secondary) => createMuiTheme({
  palette: {
    primary: {
      main: primary || "#da042e",
    },
    secondary: {
      main: secondary || "#010025",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
