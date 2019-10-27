import React, {forwardRef, useState, useEffect} from 'react';
import clsx from 'clsx';
import {
    makeStyles, useTheme, CssBaseline, Typography,
    AppBar, Toolbar, IconButton, Drawer, Divider,
    ListItem, List, ListItemIcon, ListItemText, Fab, Popover, Dialog, Slide
} from '@material-ui/core';
import {TEXT} from "../../consts/text-consts";
import {Route, Switch} from "react-router";
import {
    AdminContestsPage, AdminQuestionsPage, AdminTestsPage,
    CreateContestPage, CreateQuestionPage, CreateTestPage,
    EditContestPage, EditQuestionPage, EditTestPage,
} from "../index";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ListAlt as ListAltIcon,
    LibraryBooks as LibraryBooksIcon,
    QuestionAnswer as QuestionAnswerIcon,
    Add as AddIcon
} from '@material-ui/icons';
import {useSelector, useDispatch} from "react-redux";
import {useRouteMatch, useHistory} from "react-router-dom";
import {PAGE_PATHS} from "../../consts";
import {openCreateQuestionDialog, setOpenAdminFullscreenDialog} from "../../actions";
import {disabledStyleWrapper} from "../../utils";
import EditingQuestionDialog from "../../components/question-dialog/editing-question-dialog";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {display: 'flex'},
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
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
        justifyContent: 'flex-end'
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
    extendedIcon: {marginRight: theme.spacing(1)}
}));

const listCreateButtonMap = [
    {key: 0, name: `${TEXT.create} ${TEXT.contest}`, icon: <ListAltIcon/>, path: PAGE_PATHS.createContest},
    {key: 1, name: `${TEXT.create} ${TEXT.test}`, icon: <LibraryBooksIcon/>, path: PAGE_PATHS.createTest},
    {key: 2, name: `${TEXT.create} ${TEXT.question}`, icon: <QuestionAnswerIcon/>, path: PAGE_PATHS.createQuestion},
];

const listNavItemMap = [
    {key: 0, name: TEXT.contest, icon: <ListAltIcon/>, path: PAGE_PATHS.contest},
    {key: 1, name: TEXT.test, icon: <LibraryBooksIcon/>, path: PAGE_PATHS.tests},
    {key: 2, name: TEXT.question, icon: <QuestionAnswerIcon/>, path: PAGE_PATHS.questions}
];

// eslint-disable-next-line react/display-name
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function AdminHomePage() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const dispatch = useDispatch();
    const {path} = useRouteMatch();
    const {isOpenAdminFullscreenDialog} = useSelector(state => state.adminReducer);
    const [currentFullscreenPath, setCurrentFullscreenPath] = useState('');
    const [openDrawer, setOpenDrawer] = useState(true);
    const [appBarTitle, setAppBarTitle] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [createPopAnchorEl, setCreatePopAnchorEl] = useState(null);
    const openCreatePop = Boolean(createPopAnchorEl);
    const createPopID = openCreatePop ? 'create-pop-id' : null;

    history.listen((location, action) => {
        if (action === 'POP') {
            switch (currentFullscreenPath) {
                case PAGE_PATHS.createQuestion:
                case PAGE_PATHS.createTest:
                case PAGE_PATHS.createContest:
                case PAGE_PATHS.editTest:
                case PAGE_PATHS.editContest:
                case PAGE_PATHS.editQuestion:
                    dispatch(setOpenAdminFullscreenDialog(false));
            }
        }
    });

    useEffect(() => {
        const item = listNavItemMap[0];
        setSelectedIndex(item.key);
        setAppBarTitle(item.name);
        history.push(`${path}/${item.path}`);
    }, []);


    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    function handleCreateItemClick(event, item) {
        if (item.key === 2) {
            setCreatePopAnchorEl(null);
            dispatch(openCreateQuestionDialog());
            return;
        }
        dispatch(setOpenAdminFullscreenDialog(true));
        setCreatePopAnchorEl(null);
        setCurrentFullscreenPath(item.path);
        history.push(`${path}/${item.path}`);
    }

    function handleNavButtonClick(event, item, index) {
        setSelectedIndex(index);
        setAppBarTitle(item.name);
        history.push(`${path}/${item.path}`);
    }

    function renderCreateButton(item, index) {
        const {key, name, icon} = item;
        return (<ListItem key={key} button
                          onClick={event => handleCreateItemClick(event, item, index)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={name}/>
        </ListItem>)
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
                </Toolbar>
            </AppBar>
            <Drawer className={classes.drawer} classes={{paper: classes.drawerPaper}}
                    variant="persistent" anchor="left" open={openDrawer}>
                <div className={classes.drawerHeader}>
                    <Typography variant="h6" noWrap align='left'>{TEXT.appName}</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <div>
                        <Fab variant="extended" aria-label="delete" className={classes.fab}
                             onClick={(event) => setCreatePopAnchorEl(event.currentTarget)}>
                            <AddIcon className={classes.extendedIcon}/> {TEXT.create}
                        </Fab>
                        <Popover id={createPopID} open={openCreatePop} anchorEl={createPopAnchorEl}
                                 onClose={() => setCreatePopAnchorEl(null)}
                                 anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                                 transformOrigin={{vertical: 'top', horizontal: 'left'}}>
                            {listCreateButtonMap.map(renderCreateButton)}
                        </Popover>
                    </div>
                    {listNavItemMap.map(renderNavButton)}
                </List>
            </Drawer>
            <main className={clsx(classes.content, {[classes.contentShift]: openDrawer})}>
                <div className={classes.drawerHeader}/>
                <Switch>
                    <Route path={`${path}/${PAGE_PATHS.questions}`} component={AdminQuestionsPage}/>
                    <Route path={`${path}/${PAGE_PATHS.tests}`} component={AdminTestsPage}/>
                    <Route path={`${path}/${PAGE_PATHS.contest}`} component={AdminContestsPage}/>
                </Switch>
            </main>

            <Dialog fullScreen open={isOpenAdminFullscreenDialog} TransitionComponent={Transition}
                    onClose={() => dispatch(setOpenAdminFullscreenDialog(false))}>
                <Switch>
                    <Route path={`${path}/${PAGE_PATHS.createQuestion}`} component={CreateQuestionPage}/>
                    <Route path={`${path}/${PAGE_PATHS.createTest}`} component={CreateTestPage}/>
                    <Route path={`${path}/${PAGE_PATHS.createContest}`} component={CreateContestPage}/>
                    <Route path={`${path}/${PAGE_PATHS.editQuestion}`} component={EditQuestionPage}/>
                    <Route path={`${path}/${PAGE_PATHS.editTest}`} component={EditTestPage}/>
                    <Route path={`${path}/${PAGE_PATHS.editContest}`} component={EditContestPage}/>
                </Switch>
            </Dialog>
            <EditingQuestionDialog/>
        </div>
    );
}

