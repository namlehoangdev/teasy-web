import React from 'react';
import {Button, TextField, Grid, Typography, makeStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';
import {TEXT} from "../../consts/text-consts";


const useStyles = makeStyles(theme => ({
        '@global': {body: {backgroundColor: theme.palette.common.white}},
        submit: {width: '100%', height: '100%'},
        facebook: {
            ...theme.typography.button,
            ...theme.shape,
            padding: '6px 16px',
            backgroundColor: '#3B5998',
            color: theme.palette.common.white,
            width: '100%',
        },
        paper: {
            backgroundColor: theme.palette.common.white,
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        orText: {}
    }))
;


function AuthenticationCard(props) {
    const {onFacebookClick, onFacebookCallback} = props;
    const classes = useStyles();

    function handleFacebookCallBack(data) {
        onFacebookCallback && onFacebookCallback(data);
    }

    function handleFacebookLoginClick(data) {
        onFacebookClick && onFacebookClick(data)
    }

    return (
        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <TextField id="roomCode" name="roomCode" variant="outlined" fullWidth autoFocus
                               label={TEXT.roomCode}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                        {TEXT.enterRoom}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.orText} variant="body2" color="textSecondary"
                                align="center">hoặc</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <FacebookLogin
                        appId="1913479075393450" className={classes.submit}
                        autoLoad={false} disableMobileRedirect={true}
                        fields="name,email,picture"
                        callback={handleFacebookCallBack}
                        onClick={handleFacebookLoginClick}
                        icon="fa-facebook" cssClass={classes.facebook}
                        textButton={` ${TEXT.loginWithFacebook}`}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

AuthenticationCard.propTypes = {
    onFacebookCallback: PropTypes.func,
    onFacebookClick: PropTypes.func
}


export default AuthenticationCard;
