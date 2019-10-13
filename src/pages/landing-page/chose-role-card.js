import React, {useEffect} from 'react';
import {Button, Grid, makeStyles} from '@material-ui/core';
// import {useDispatch, useSelector} from "react-redux";
import {TEXT, PATH} from "../../consts";
import {useHistory} from "react-router";


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
    useEffect(() => {
        //promotionId && dispatch(readPromotion(promotionId));
    }, []);

    function handleAdminPageClick() {
        history.push(PATH.admin);
    }

    function handlePlaygroundClick() {
        history.push(PATH.playground);
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
