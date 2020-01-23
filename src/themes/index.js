import darkTheme from './dark-theme';
import defaultTheme from './default-theme';
import {createMuiTheme} from "@material-ui/core";

 

export default {
    default: createMuiTheme(defaultTheme),
    dark: createMuiTheme(darkTheme)
};
