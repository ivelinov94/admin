import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#562AFF',
        },
        secondary: {
            main: '#01E1C6',
        },
        error: {
            main: red.A400,
        },
        text: {
            primary: "#101828",
            secondary: "#667085",
            disabled: "#98A2B3",
        },
    },
});
export default theme;
