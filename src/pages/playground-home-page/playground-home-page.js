import React, {useState, useEffect, useRef, forwardRef} from 'react';
import clsx from 'clsx';
import {
    makeStyles,
    useTheme,
    CssBaseline,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    Divider,
    ListItem,
    List,
    ListItemIcon,
    ListItemText,
    Fab,
    Avatar,
    Button,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem, Dialog, Slide
} from '@material-ui/core';
import {Route, Switch} from "react-router";
import {
    CreateContestPage,
    CreateQuestionPage, CreateTestPage, EditContestPage, EditQuestionPage, EditTestPage,
    PlaygroundAllContestsPage, PlaygroundCompetePage, PlaygroundContestResultsPage, PlaygroundSharedContestsPage
} from "../index";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ListAlt as ListAltIcon,
    LibraryBooks as LibraryBooksIcon,
    QuestionAnswer as QuestionAnswerIcon
} from '@material-ui/icons';
import {useSelector, useDispatch} from "react-redux";
import {useRouteMatch, useHistory} from "react-router-dom";
import {PAGE_PATHS} from "../../consts";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {setOpenAdminFullscreenDialog, setOpenPlaygroundFullscreenDialog} from "../../actions";

const drawerWidth = 240;

const options = ['Edit profile', 'Settings', 'Sign out'];

const useStyles = makeStyles(theme => ({
    root: {display: 'flex'},
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
    menuButton: {marginRight: theme.spacing(2)},
    hide: {display: 'none'},
    drawer: {width: drawerWidth, flexShrink: 0},
    drawerPaper: {width: drawerWidth},
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center'
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
    fab: {margin: theme.spacing(1)},
    extendedIcon: {marginRight: theme.spacing(1)},
    avatar: {
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarOptions: {
        position: 'absolute',
        top: theme.spacing(8),
        right: theme.spacing(0)
    },
    goback: {
        marginTop: 'auto'
    }
}));

// eslint-disable-next-line react/display-name
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PlaygroundHomePage() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const dispatch = useDispatch();
    const {path} = useRouteMatch();
    const {isOpenPlaygroundFullscreenDialog} = useSelector(state => state.playgroundReducer);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [appBarTitle, setAppBarTitle] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const {language} = useSelector(state => state.settingReducer);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedAvatarOptions, setSelectedAvatarOptions] = useState(0);
    const {profile} = useSelector(state => state.authReducer);

    useEffect(() => {
        setSelectedIndex(0);
        setAppBarTitle(listNavItemMap[0].name);
        history.push(`${path}/${PAGE_PATHS.allContests}`);
    }, []);


    const handleMenuItemClick = (event, index) => {
        setSelectedAvatarOptions(index);
        setOpen(false);
        console.log(profile.name)
    };

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };


    const listNavItemMap = [
        {key: 0, name: language.allContests, icon: <ListAltIcon/>, path: PAGE_PATHS.allContests},
        {key: 1, name: language.mySharedContests, icon: <LibraryBooksIcon/>, path: PAGE_PATHS.sharedContests},
        {key: 2, name: language.contestsHistory, icon: <QuestionAnswerIcon/>, path: PAGE_PATHS.contestResults}
    ];


    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };


    function handleNavButtonClick(event, item, index) {
        setSelectedIndex(index);
        setAppBarTitle(item.name);
        history.push(`${path}/${item.path}`);
    }


    function renderNavButton(item, index) {
        const {key, icon, name} = item;
        return (<ListItem button key={key}
                          selected={selectedIndex === index}
                          onClick={event => handleNavButtonClick(event, item, index)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={name}/>
        </ListItem>)
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: openDrawer})}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start"
                                className={clsx(classes.menuButton, openDrawer && classes.hide)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>{appBarTitle}</Typography>
                    <div className={classes.avatar}>
                        <Typography variant="h6" noWrap>{profile.name}</Typography>
                        <Button
                            color="primary"
                            size="small"
                            aria-owns={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        >
                            <Avatar alt="Remy Sharp"
                                    src='https://s3-media3.fl.yelpcdn.com/bphoto/2xPzBYm-wlXLv0WQksBA2Q/l.jpg'/>
                        </Button>
                        <Popper className={classes.avatarOptions} open={open} anchorEl={anchorRef.current} transition
                                disablePortal>
                            {({TransitionProps, placement}) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper id="menu-list-grow">
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList>
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option}
                                                        selected={index === selectedAvatarOptions}
                                                        onClick={event => handleMenuItemClick(event, index)}
                                                    >
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer className={classes.drawer} classes={{paper: classes.drawerPaper}}
                    variant="persistent" anchor="left" open={openDrawer}>
                <div className={classes.drawerHeader}>
                    <Avatar alt="Remy Sharp"
                            src='https://s3-media3.fl.yelpcdn.com/bphoto/2xPzBYm-wlXLv0WQksBA2Q/l.jpg'/>
                    <Typography variant="h6" noWrap align='left'>{language.appName}</Typography>
                    <IconButton size={'medium'} onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    {listNavItemMap.map(renderNavButton)}
                </List>
                <Fab size='small' variant="extended" aria-label="like" className={classes.goback}>
                    <ExitToAppIcon className={classes.extendedIcon}/>
                    Quay lại
                </Fab>
            </Drawer>
            <main className={clsx(classes.content, {[classes.contentShift]: openDrawer})}>
                <div className={classes.drawerHeader}/>
                <Switch>
                    <Route path={`${path}/${PAGE_PATHS.allContests}`} component={PlaygroundAllContestsPage}/>
                    <Route path={`${path}/${PAGE_PATHS.sharedContests}`} component={PlaygroundSharedContestsPage}/>
                    <Route path={`${path}/${PAGE_PATHS.contestResults}`} component={PlaygroundContestResultsPage}/>
                </Switch>
            </main>

            <Dialog fullScreen open={isOpenPlaygroundFullscreenDialog} TransitionComponent={Transition}
                    onClose={() => dispatch(setOpenPlaygroundFullscreenDialog(false))}>
                <Switch>
                    <Route path={`${path}/${PAGE_PATHS.compete}`} component={PlaygroundCompetePage}/>
                </Switch>
            </Dialog>
        </div>
    );
}

