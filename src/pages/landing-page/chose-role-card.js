import React, {useEffect} from 'react';
import {Button, Grid, makeStyles} from '@material-ui/core';
// import {useDispatch, useSelector} from "react-redux";
import FacebookLogin from 'react-facebook-login';
import {TEXT} from "../../consts/text-consts";


const useStyles = makeStyles(theme => ({
        '@global': {
            body: {
                backgroundColor: theme.palette.common.white,
            },
        },
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
    //const dispatch = useDispatch();
    useEffect(() => {
        //promotionId && dispatch(readPromotion(promotionId));
    }, []);


    return (
        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Button fullWidth variant="contained" color="primary">
                        {TEXT.gotoAdmin}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Button fullWidth variant="contained" color="primary">
                        {TEXT.gotoPlayground}
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}


export default ChoseRoleCard;
