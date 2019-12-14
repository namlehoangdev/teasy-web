import React, {useState, useEffect} from 'react';
import {Button, Grid, IconButton, makeStyles, Paper, Table, TableCell, TableRow, Typography} from "@material-ui/core";
import {ChevronLeft as ChevronLeftIcon} from "@material-ui/icons";
import {LOGIN_MODE, PAGE_PATHS, TEXT} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {setOpenAdminFullscreenDialog} from "../../actions";
import {isoToLocalDateString, msToTime} from "../../utils";
import moment from "moment";
import Countdown from "react-countdown-now";

const useStyles = makeStyles(theme => ({
    root: {
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
    },
    countDownContainer: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'row'
    },
    countDownBox: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
        ...theme.shape,
        borderWidth: theme.spacing(1),
        borderColor: theme.palette.primary.main
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1
    }
}));

// function StartButtonWrapper(props) {
//     const {onMount, onClick} = props;
//     useEffect(() => {
//         onMount && onMount();
//     }, []);
//
//     function handleClick() {
//         onClick && onClick();
//     }
//
//     return <Button variant="contained" color="primary" onClick={handleClick}>Tham gia thi</Button>
// }


export default function PlaygroundWaitingRoomPage() {
    const {competingContest} = useSelector(state => state.playgroundReducer);
    const {
        name, description, startAt, createdAt, isPublic,
        code, isSecured, duration, password, permittedUsers, ownerName, test
    } = competingContest;
    const classes = useStyles();

    useEffect(() => {

    }, []);


    // function renderCountDown({total, days, hours, minutes, seconds}) {
    //     return (
    //         <div className={classes.countDownContainer}>
    //             <div className={classes.countDownBox}>
    //                 <span className={classes.numberCountDown}>{days}</span>
    //                 <span className={classes.labelCountDown}>ngày</span>
    //             </div>
    //             <div className={classes.countDownBox}>
    //                 <span className={classes.numberCountDown}>{hours}</span>
    //                 <span className={classes.labelCountDown}>giờ</span>
    //             </div>
    //             <div className={classes.countDownBox}>
    //                 <span className={classes.numberCountDown}>{minutes}</span>
    //                 <span className={classes.labelCountDown}>phút</span>
    //             </div>
    //             <div className={classes.countDownBox}>
    //                 <span className={classes.numberCountDown}>{seconds}</span>
    //                 <span className={classes.labelCountDown}>giây</span>
    //             </div>
    //         </div>
    //     )
    // }

    function renderStartContestButton() {
        return null;
        // const diff = moment(startAt).diff(moment.utc(), 'ms');
        // console.log('diff: ', diff);
        // if (diff > 0) {
        //     return (<Countdown autoStart={true} date={Date.now() + diff} renderer={renderCountDown}
        //                        onStart={() => setEndCountDown(false)} onComplete={() => setEndCountDown(true)}/>);
        // }
        // return (
        //     <StartButtonWrapper onMoun={() => setEndCountDown(true)} onClick={() => handleStartContestClick(item)}/>)
    }

    return (<Grid container component="main" className={classes.root}>
        <Paper className={classes.paper}>
            <Typography gutterBottom variant="h6" component="h2" color="primary">Chi tiết</Typography>
            <Table size="small">
                <TableRow>
                    <TableCell className={classes.detailCell}>Tên cuộc thi</TableCell>
                    <TableCell className={classes.detailCell}>{name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Mô tả</TableCell>
                    <TableCell className={classes.detailCell}>{description}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Trạng thái</TableCell>
                    <TableCell className={classes.detailCell}>{isPublic ? 'công khai' : 'riêng tư'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Người tạo</TableCell>
                    <TableCell className={classes.detailCell}>{ownerName}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Thời gian bắt đầu</TableCell>
                    <TableCell
                        className={classes.detailCell}>{isoToLocalDateString(startAt)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Diễn ra trong</TableCell>
                    <TableCell className={classes.detailCell}>{msToTime(duration)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Ngày tạo</TableCell>
                    <TableCell className={classes.detailCell}>{isoToLocalDateString(createdAt)}</TableCell>
                </TableRow>
            </Table>
            {renderStartContestButton()}
        </Paper>
    </Grid>);
}
