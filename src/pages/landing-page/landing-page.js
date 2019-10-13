import React, {useEffect, useState, useRef} from 'react';
import {Paper, Link, Grid, Box, Typography, makeStyles, LinearProgress, Button} from '@material-ui/core';
// import {useDispatch, useSelector} from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {TEXT} from "../../consts/text-consts";
import Logo from "../../components/logo/logo";
import AuthenticationCard from "./authentication-card";
import ChoseRoleCard from "./chose-role-card";
import {disabledStyleWrapper} from "../../utils";


const useStyles = makeStyles(theme => ({
        root: {
            backgroundColor: theme.palette.background.default,
            height: '100vh',
            display: 'inline-block',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(2)
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
        backBtn: {position: 'absolute', bottom: theme.spacing(2), left: theme.spacing(4)}
    }))
;

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://fb.com//phanmemtienichsinhvien"> {TEXT.appName} </Link>{' '}
            {new Date().getFullYear()} {'.'}
        </Typography>
    );
}


function LandingPage() {
    //const promotionId = (match.params && match.params.id) || null;
    // const promotionsMap = useSelector(state => state.promotions.promotionsMap || {});
    const [isCardLoading, setCardLoading] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const sliderRef = useRef(null);
    const classes = useStyles();
    //const dispatch = useDispatch();
    useEffect(() => {
        //promotionId && dispatch(readPromotion(promotionId));
    }, []);

    function handleFacebookCallback(data) {
        // console.log(data);
        setCardLoading(false);
        if (data && data.accessToken) {
            sliderRef.current.slickGoTo(1)
        }
    }

    function handleFacebookClick(data) {
        setCardLoading(true);
        console.log(data);
    }

    function handleGoBack() {
        sliderRef.current.slickGoTo(0)
    }

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
            <Typography component="h1" variant="h1" align="center" color="textPrimary" className={classes.logo}>
                {TEXT.appName}
            </Typography>
            <Grid item xs={12} sm={8} md={5} elevation={6} className={classes.description}>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    {TEXT.appDescription}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} className={classes.paper}>
                {isCardLoading && <LinearProgress/>}
                <Slider ref={sliderRef} {...settings} style={disabledStyleWrapper(isCardLoading)}>
                    <AuthenticationCard onFacebookCallback={handleFacebookCallback}
                                        onFacebookClick={handleFacebookClick}/>
                    <ChoseRoleCard onGoBack={handleGoBack}/>
                </Slider>
                {slideIndex === 1 && <Button
                    onClick={handleGoBack}
                    color="primary" className={classes.backBtn}>{TEXT.goBack}</Button>}
            </Grid>
            <Box align='center' mt={5}> <Copyright/> </Box>
        </Grid>
    )
}


export default LandingPage;
