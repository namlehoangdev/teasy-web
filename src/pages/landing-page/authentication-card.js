import React, {useState} from 'react';
import {Button, IconButton, TextField, Grid, Typography, makeStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import {Facebook as FacebookIcon} from '@material-ui/icons';
import {TEXT} from "../../consts/text-consts";
import {useDispatch} from "react-redux";
import {getAnonymousContestMetadataByCode, updateEditingContest} from "../../actions";
import {useHistory} from "react-router";
import {PAGE_PATHS} from "../../consts";


const useStyles = makeStyles(theme => ({
        // '@global': {body: {backgroundColor: theme.palette.common.white}},
        submit: {width: '100%', height: '100%'},
        facebook: {
            backgroundColor: '#445EA9',
            color: theme.palette.common.white,
            width: '100%',
        },
        google: {
            ...theme.typography.button,
            ...theme.shape,
            width: '100%',
            justifyContent: 'center'
        },
        paper: {
            backgroundColor: theme.palette.background,
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        orText: {}
    }))
;


function AuthenticationCard(props) {
    const {onFacebookCallback, onGoogleSuccess, onGoogleFailure, onThirdPartyClick} = props;
    const [code, setCode] = useState('');
    const [codeHelperText, setCodeHelperText] = useState('');
    const [isError, setIsError] = useState(false);
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    function handleFacebookCallBack(data) {
        onFacebookCallback && onFacebookCallback(data);
    }

    function handleThirdPartyClick(data) {
        onThirdPartyClick && onThirdPartyClick(data);
    }

    function handleGoogleSuccess(data) {
        onGoogleSuccess && onGoogleSuccess(data);
    }

    function handleGoogleFailure(data) {
        onGoogleFailure && onGoogleFailure(data);
    }

    function handleCodeChange(event) {
        if (isError) {
            setIsError(false);
            setCodeHelperText("");
        }
        setCode(event.target.value);
    }

    function handleEnterRoomByCodePress() {
        if (!code || code.length === 0) {
            setIsError(true);
            setCodeHelperText('Mã phòng thi không hợp lệ');
        } else {
            const onGetContestSuccess = (response) => {
                dispatch(updateEditingContest(response));
                history.push({pathname: `${PAGE_PATHS.waiting}`});
            };
            const onGetContestError = (response) => {
                setIsError(true);
                setCodeHelperText('Mã phòng thi không đúng');
            };
            dispatch(getAnonymousContestMetadataByCode(code, onGetContestSuccess, onGetContestError))
        }
    }

    return (
        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <GoogleLogin
                        clientId="224551668607-ruki7e85h10fo8pjs3llnbhk16ah8chg.apps.googleusercontent.com"
                        onSuccess={handleGoogleSuccess}
                        onFailure={handleGoogleFailure}
                        className={classes.google}
                        cookiePolicy={'single_host_origin'}
                        buttonText={TEXT.loginWithGoogle}
                        onClick={handleThirdPartyClick}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <FacebookLogin
                        appId="1913479075393450"
                        autoLoad={false} disableMobileRedirect={true}
                        fields="name,email,picture"
                        callback={handleFacebookCallBack}
                        onClick={handleThirdPartyClick}
                        render={renderProps => (
                            <Button variant="contained" color="primary"
                                    size="large" className={classes.facebook}
                                    onClick={renderProps.onClick} startIcon={<FacebookIcon/>}>
                                {TEXT.loginWithFacebook}
                            </Button>)
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Typography className={classes.orText} variant="body2" color="textSecondary"
                                align="center">{TEXT.or}</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField id="roomCode" name="roomCode" variant="outlined" fullWidth
                               helperText={codeHelperText}
                               onChange={handleCodeChange}
                               error={isError}
                               label={TEXT.roomCode}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button type="submit" variant="contained" color="primary" className={classes.submit}

                            onClick={handleEnterRoomByCodePress}>
                        {TEXT.enterRoom}
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

AuthenticationCard.propTypes = {
    onFacebookCallback: PropTypes.func,
    onThirdPartyClick: PropTypes.func,
    onGoogleSuccess: PropTypes.func,
    onGoogleFailure: PropTypes.func
};


export default AuthenticationCard;
