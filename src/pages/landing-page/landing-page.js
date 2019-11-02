import React, { useEffect, useState, useRef } from 'react';
import { Paper, Link, Grid, Box, Typography, makeStyles, LinearProgress, Button, ButtonGroup, Grow, Popper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { TEXT } from "../../consts/text-consts";
import AuthenticationCard from "./authentication-card";
import ChoseRoleCard from "./chose-role-card";
import { disabledStyleWrapper } from "../../utils";
import { postLoginByThirdParty } from "../../actions";
import { THIRD_PARTY } from "../../consts";
import { showMiniLoading } from "../../actions/ui-effect-actions";
import { ToggleButton } from '@material-ui/lab';
import { Brightness7 as Brightness7Icon, Brightness4 as Brightness4Icon, ArrowDropDown as ArrowDropDownIcon } from '@material-ui/icons';
import { updateThemeMode } from '../../actions/setting-actions';

const options = ['VN', 'EN']


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    display: 'inline-block',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  paper: {
    marginRight: 'auto',
    marginLeft: 'auto',
    position: 'relative'
  },
  logo: {
    margin: theme.spacing(2),
    color: theme.palette.primary.main,
    fontFamily: 'logofont'
  },
  backBtn: { position: 'absolute', bottom: theme.spacing(2), left: theme.spacing(4) },
  themeSetting: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(11),
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    borderColor: 'rgba(25, 118, 210, 0.5)',
  },
  languageSetting: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  languageOptions: {
    position: 'absolute',
    top: theme.spacing(7),
    right: theme.spacing(2),
  },
  iconTheme: {

  },
  setting: {
    width: '100%',
    height: theme.spacing(5)
  }
}))
  ;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://fb.com/phanmemtienichsinhvien"> {TEXT.appName} </Link>{' '}
      {new Date().getFullYear()} {'.'}
    </Typography>
  );
}


function LandingPage() {
  //const promotionId = (match.params && match.params.id) || null;
  const { isShowMiniLoading } = useSelector(state => state.uiEffectReducer);
  const { token } = useSelector(state => state.authReducer);
  const { isDark } = useSelector(state => state.settingReducer);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();


  useEffect(() => {
    //promotionId && dispatch(readPromotion(promotionId));
  }, []);


  function handleFacebookCallback(data) {
    if (data && data.accessToken) {
      console.log(data);
      dispatch(postLoginByThirdParty({ ...data, thirdParty: THIRD_PARTY.facebook }));
    }
  }

  function handleGoogleSuccess(data) {
    console.log('google login success: ', data);
    dispatch(postLoginByThirdParty({ ...data, thirdParty: THIRD_PARTY.google }));
  }

  function handleGoogleFailure(data) {
    console.log('google login failure: ', data);
  }

  function handleThirdPartyClick(data) {
    dispatch(showMiniLoading());
    console.log(data);
  }

  function handleGoBack() {
    sliderRef.current && sliderRef.current.slickGoTo(0)
  }

  if (token) {
    sliderRef.current && sliderRef.current.slickGoTo(1)
  }

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  const settings = {
    infinite: false,
    speed: 500,
    initialSlide: 0,
    arrows: false,
    swipe: false,
    beforeChange: (current, next) => {
      setSlideIndex(next)
    }
  };


  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={12} sm={8} md={5} elevation={6} className={classes.setting}>
        <ToggleButton
          className={classes.themeSetting}
          value="check"
          selected={isDark}
          onChange={() => {
            dispatch(updateThemeMode({ isDark: !isDark }))
          }}
        >
          {isDark === true ? <Brightness4Icon color="primary" /> : <Brightness7Icon color="primary" />}
        </ToggleButton>
        <Button className={classes.languageSetting} variant="outlined" color={"primary"} onClick={handleToggle}>{options[selectedIndex]}</Button>
        <Popper className={classes.languageOptions} open={open} anchorEl={anchorRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
      <Typography component="h1" variant="h1" align="center" color="textPrimary" className={classes.logo}>
        {TEXT.appName}
      </Typography>
      <Grid item xs={12} sm={8} md={5} elevation={6} className={classes.description}>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          {TEXT.appDescription}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} className={classes.paper}>
        {isShowMiniLoading && <LinearProgress />}
        <Slider ref={sliderRef} {...settings} style={disabledStyleWrapper(isShowMiniLoading)}>
          <AuthenticationCard onFacebookCallback={handleFacebookCallback}
            onThirdPartyClick={handleThirdPartyClick}
            onGoogleSuccess={handleGoogleSuccess}
            onGoogleFailure={handleGoogleFailure}
          />
          <ChoseRoleCard onGoBack={handleGoBack} />
        </Slider>
        {slideIndex === 1 && <Button
          onClick={handleGoBack}
          color="primary" className={classes.backBtn}>{TEXT.goBack}</Button>}
      </Grid>
      <Box align='center' mt={5}> <Copyright /> </Box>
    </Grid>
  )
}


export default LandingPage;
