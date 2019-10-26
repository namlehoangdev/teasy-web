import React from 'react';
import {Button, Grid, makeStyles} from '@material-ui/core';
import {TEXT, PAGE_PATHS, LOGIN_MODE} from "../../consts";
import {useHistory} from "react-router";
import {updateLoginMode} from "../../actions";
import {useDispatch} from "react-redux";


const useStyles = makeStyles(theme => ({
        paper: {
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
        },
    }))
;


function ChoseRoleCard() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    function handleAdminPageClick() {
        dispatch(updateLoginMode(LOGIN_MODE.admin));
        history.push(PAGE_PATHS.admin);
    }

    function handlePlaygroundClick() {
        dispatch(updateLoginMode(LOGIN_MODE.playground));
        history.push(PAGE_PATHS.playground);
    }


    return (
        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Button fullWidth variant="contained" color="primary"
                            onClick={handleAdminPageClick}>
                        {TEXT.gotoAdmin}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Button fullWidth variant="contained" color="primary"
                            onClick={handlePlaygroundClick}>
                        {TEXT.gotoPlayground}
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}


export default ChoseRoleCard;
