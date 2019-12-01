import React, {useEffect} from 'react';
import {
    Container,
    Grid,
    makeStyles,
    Paper,
    useTheme,
    TableCell,
    Toolbar,
    Typography,
    AppBar,
    Drawer,
    IconButton
} from "@material-ui/core";
import clsx from "clsx";
import {Folder as FolderIcon, Menu as MenuIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getPublicContests, getSharedContests, updateAllContestById, updateAllContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
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
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
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
}));

export default function PlaygroundCompetePage() {

    const classes = useStyles();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const {contests, sharedContestIds} = useSelector(state => state.playgroundReducer) || {};
    const dispatch = useDispatch();

    function renderAnswerBlock() {
        return 'answers';
        return null;
    }

    function renderTest() {
        return 'tests';
        return null;
    };

    return (<div className={classes.root}>
        <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: openDrawer})}>
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpenDrawer(true)}
                            edge="start" className={clsx(classes.menuButton, openDrawer && classes.hide)}>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap>Persistent drawer</Typography>
            </Toolbar>
        </AppBar>
        <Drawer className={classes.drawer} variant="persistent" anchor="left"
                open={openDrawer} classes={{paper: classes.drawerPaper}}>
            {renderAnswerBlock()}
        </Drawer>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Paper className={classes.paper}>
                    {renderTest()}
                </Paper>
            </Grid>
        </Container>
    </div>)
}
