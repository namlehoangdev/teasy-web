import React, { useState } from 'react';
import clsx from 'clsx';
import {
  makeStyles, useTheme, CssBaseline, Typography,
  AppBar, Toolbar, IconButton, Drawer, Divider,
  ListItem, List, ListItemIcon, ListItemText, Fab, Popover
} from '@material-ui/core';
import { Route, Switch } from "react-router";
import {
  AdminContestsPage, AdminQuestionsPage, AdminTestsPage,
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
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { PAGE_PATHS } from "../../consts";
import { setOpenAdminFullscreenDialog } from "../../actions";
import settingReducer from '../../reducers/setting-reducer';
import PlaygroundAllContestsPage from '../playground-all-contests-page';
import PlaygroundContestsHistoryPage from '../playground-contests-history-page';
import PlaygroundMySharedContestsPage from '../playground-my-shared-contests-page';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: { display: 'flex' },
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
  menuButton: { marginRight: theme.spacing(2) },
  hide: { display: 'none' },
  drawer: { width: drawerWidth, flexShrink: 0 },
  drawerPaper: { width: drawerWidth },
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
  fab: { margin: theme.spacing(1) },
  extendedIcon: { marginRight: theme.spacing(1) }
}));


export default function PlaygroundHomePage() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const isOpenAdminFullscreenDialog = useSelector(state => state.adminReducer.isOpenAdminFullscreenDialog);
  console.log(isOpenAdminFullscreenDialog);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [appBarTitle, setAppBarTitle] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [createPopAnchorEl, setCreatePopAnchorEl] = useState(null);
  const openCreatePop = Boolean(createPopAnchorEl);
  const createPopID = openCreatePop ? 'create-pop-id' : null;
  const { language } = useSelector(state => state.settingReducer)


  const listCreateButtonMap = [
    { key: 0, name: `${language.create} ${language.contest}`, path: PAGE_PATHS.allContests },
    { key: 1, name: `${language.create} ${language.test}`, path: PAGE_PATHS.mySharedContests },
    { key: 2, name: `${language.create} ${language.question}`, path: PAGE_PATHS.contestsHistory },
  ];

  const listNavItemMap = [
    { key: 0, name: language.allContests, icon: <ListAltIcon />, path: PAGE_PATHS.allContests },
    { key: 1, name: language.mySharedContests, icon: <LibraryBooksIcon />, path: PAGE_PATHS.mySharedContests },
    { key: 2, name: language.contestsHistory, icon: <QuestionAnswerIcon />, path: PAGE_PATHS.contestsHistory }
  ];


  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  function handleCreateItemClick(event, item) {
    dispatch(setOpenAdminFullscreenDialog(true));
    setCreatePopAnchorEl(null);
    setAppBarTitle(item.name);
    history.push(`${path}/${item.path}`);
  }

  function handleNavButtonClick(event, item, index) {
    setSelectedIndex(index);
    setAppBarTitle(item.name);
    history.push(`${path}/${item.path}`);
  }

  function renderCreateButton(item, index) {
    const { key, name } = item;
    return (<ListItem key={key} button
      onClick={event => handleCreateItemClick(event, item, index)}>
      <ListItemText primary={name} />
    </ListItem>)
  }

  function renderNavButton(item, index) {
    const { key, icon, name } = item;
    return (<ListItem button key={key}
      selected={selectedIndex === index}
      onClick={event => handleNavButtonClick(event, item, index)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: openDrawer })}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start"
            className={clsx(classes.menuButton, openDrawer && classes.hide)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>{appBarTitle}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer className={classes.drawer} classes={{ paper: classes.drawerPaper }}
        variant="persistent" anchor="left" open={openDrawer}>
        <div className={classes.drawerHeader}>
          <Typography variant="h6" noWrap align='left'>{language.appName}</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {listNavItemMap.map(renderNavButton)}
        </List>
      </Drawer>
      <main className={clsx(classes.content, { [classes.contentShift]: openDrawer })}>
        <div className={classes.drawerHeader} />
        <Switch>
          <Route path={`${path}/${PAGE_PATHS.allContests}`} component={PlaygroundAllContestsPage} />
          <Route path={`${path}/${PAGE_PATHS.mySharedContests}`} component={PlaygroundMySharedContestsPage} />
          <Route path={`${path}/${PAGE_PATHS.contestsHistory}`} component={PlaygroundContestsHistoryPage} />
        </Switch>
      </main>
    </div>
  );
}

