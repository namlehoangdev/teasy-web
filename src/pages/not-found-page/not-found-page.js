import React from 'react';
import {Button, Grid, IconButton, makeStyles, Paper, Typography} from "@material-ui/core";
import {ChevronLeft as ChevronLeftIcon} from "@material-ui/icons";
import {LOGIN_MODE, PAGE_PATHS, TEXT} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {setOpenAdminFullscreenDialog} from "../../actions";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#111D24',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        height: '100vh'
    },
    paper: {
        padding: theme.spacing(2)
    },
    title: {
        fontWeight: 'bold'
    }
}));

export default function NotFoundPage() {
    const {loginMode} = useSelector(state => state.authReducer);
    const history = useHistory();
    const classes = useStyles();

    function handleGoBack() {
        switch (loginMode) {
            case LOGIN_MODE.admin:
                history.replace(PAGE_PATHS.admin);
                break;
            case LOGIN_MODE.playground:
                history.replace(PAGE_PATHS.admin);
                break;
            default :
                history.replace(PAGE_PATHS.landing);
        }
    }

    return (<Grid container component="main" className={classes.root}>
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h6" align="left" color="textPrimary" className={classes.title}>
                {TEXT.yourPageNotExist}
            </Typography>
            <Typography component="p" align="center" color="textPrimary">
                {TEXT.notFoundNote}
            </Typography>
            <Button className={classes.button} startIcon={<ChevronLeftIcon/>} onClick={handleGoBack}>
                {TEXT.goBack}
            </Button>
        </Paper>
    </Grid>);
}
