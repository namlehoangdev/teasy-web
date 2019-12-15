import React from "react";
import {makeStyles} from "@material-ui/core";
import {zeroPad} from "react-countdown-now";

const useStyles = makeStyles(theme => ({
    countDownContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row'
    },
    countDownBox: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(1)
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1,
        textAlign: 'center'
    },
}));

export default function CountdownRenderer(props) {
    const {total, days, hours, minutes, seconds} = props;
    const classes = useStyles();
    return (
        <div className={classes.countDownContainer}>
            {days && days > 0 && (<div className={classes.countDownBox}>
                <span className={classes.numberCountDown}>{days}</span>
                <span className={classes.labelCountDown}>ngày</span>
            </div>)}
            <div className={classes.countDownBox}>
                <span className={classes.numberCountDown}>{zeroPad(hours)}</span>
                <span className={classes.labelCountDown}>giờ</span>
            </div>
            <div className={classes.countDownBox}>
                <span className={classes.numberCountDown}>{zeroPad(minutes)}</span>
                <span className={classes.labelCountDown}>phút</span>
            </div>
            <div className={classes.countDownBox}>
                <span className={classes.numberCountDown}>{zeroPad(seconds)}</span>
                <span className={classes.labelCountDown}>giây</span>
            </div>
        </div>
    )
}
