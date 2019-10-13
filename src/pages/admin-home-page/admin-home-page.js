import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {
    makeStyles, useTheme, CssBaseline, Typography,
    AppBar, Toolbar, IconButton, Drawer, Divider,
    ListItem, List, ListItemIcon, ListItemText, Fab, Popover
} from '@material-ui/core';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import {BrowserRouter, NavLink, Link} from "react-router-dom";
import {useRouteMatch, useHistory} from "react-router-dom";

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
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const listItemMap = [
    {key: 0, name: TEXT.conTest, icon: <ListAltIcon/>, link: 'contests'},
    {key: 1, name: TEXT.test, icon: <LibraryBooksIcon/>, link: 'tests'},
    {key: 2, name: TEXT.question, icon: <QuestionAnswerIcon/>, link: 'questions'}

];

export default function PersistentDrawerLeft() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(1);
    let {path, url} = useRouteMatch();
    const history = useHistory();


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function handleNavButtonClick(event, item, index) {
        setSelectedIndex(index);
        history.push(`${path}/${item.link}`);
    }

    function renderNavButton(item, index) {
        const {key, icon, name} = item;

        return (<ListItem button key={key}
                          selected={selectedIndex === index}
                          onClick={event => handleNavButtonClick(event, item, index)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name}/>
            </ListItem>
        )
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: open})}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start"
                                className={clsx(classes.menuButton, open && classes.hide)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>Persistent drawer</Typography>
                </Toolbar>
            </AppBar>
            <Drawer className={classes.drawer} classes={{paper: classes.drawerPaper}} variant="persistent" anchor="left"
                    open={open}>
                <div className={classes.drawerHeader}>
                    <Typography variant="h6" noWrap align='left'>{TEXT.appName}</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>

                <List>
                    <Fab variant="extended" aria-label="delete" className={classes.fab}>
                        <AddIcon className={classes.extendedIcon}/> {TEXT.addNew}
                    </Fab>
                    <Popover
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        The content of the Popover.
                    </Popover>
                    {listItemMap.map(renderNavButton)}
                </List>
            </Drawer>
            <main className={clsx(classes.content, {[classes.contentShift]: open})}>
                <div className={classes.drawerHeader}/>
                <Switch>
                    <Route path={`${path}/create/question`} component={CreateQuestionPage}/>
                    <Route path={`${path}/create/test"`} component={CreateTestPage}/>
                    <Route path={`${path}/create/contest`} component={CreateContestPage}/>
                    <Route path={`${path}/edit/question`} component={EditQuestionPage}/>
                    <Route path={`${path}/edit/test`} component={EditTestPage}/>
                    <Route path={`${path}/edit/contest`} component={EditContestPage}/>
                    <Route path={`${path}/questions`} component={AdminQuestionsPage}/>
                    <Route path={`${path}/tests`} component={AdminTestsPage}/>
                    <Route path={`${path}/contests`} component={AdminContestsPage}/>
                </Switch>
            </main>
        </div>
    );
}

