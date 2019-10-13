import React from 'react';
import './create-test-page.scss'
import {AppBar, Button, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {Close as CloseIcon} from "@material-ui/icons";
import {TEXT} from "../../consts";
import {useHistory, useRouteMatch} from "react-router";
import {useDispatch} from "react-redux";
import {setOpenAdminFullscreenDialog} from "../../actions";

const useStyles = makeStyles(theme => ({
    appBar: {position: 'relative',},
    title: {marginLeft: theme.spacing(2), flex: 1,},
}));

export default function CreateTestPage() {
    const {path} = useRouteMatch();
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    function handleClose() {
        history.goBack();
        dispatch(setOpenAdminFullscreenDialog(false));
    }

    return (<div>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>{`${TEXT.create} ${TEXT.test}`}</Typography>
                <Button color="inherit" onClick={handleClose}>{TEXT.save}</Button>
            </Toolbar>
        </AppBar>
    </div>);
}
