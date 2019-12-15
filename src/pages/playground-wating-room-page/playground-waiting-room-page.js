import React, {useState, useEffect} from "react";
import {
    Button,
    Grid,
    TextField,
    Container,
    Box,
    makeStyles,
    Paper,
    Table,
    TableCell,
    TableBody,
    TableRow,
    Typography
} from "@material-ui/core";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {isoToLocalDateString, msToTime} from "../../utils";
import moment from "moment";
import Countdown from "react-countdown-now";
import {CountdownRenderer} from "../../components";
import {setOpenPlaygroundFullscreenDialog} from "../../actions";
import {PAGE_PATHS} from "../../consts";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2),
        height: "100vh"
    },
    paper: {
        padding: theme.spacing(2)
    },
    title: {
        fontWeight: "bold"
    },
    countDownContainer: {
        marginTop: theme.spacing(4),
        display: "flex",
        flexDirection: "row"
    },
    countDownBox: {
        display: "flex",
        flexDirection: "column",
        marginLeft: "auto",
        marginRight: "auto",
        ...theme.shape,
        borderWidth: theme.spacing(1),
        borderColor: theme.palette.primary.main
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1
    },
    bottom: {
        marginTop: theme.spacing(3),
        display: 'flex'
    }
}));


export default function PlaygroundWaitingRoomPage() {
    const {competingContest} = useSelector(state => state.playgroundReducer);
    const {
        id,
        name,
        description,
        startAt,
        createdAt,
        isPublic,
        code,
        isSecured,
        duration,
        password,
        permittedUsers,
        ownerName,
        test
    } = competingContest;
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const [displayName, setDisplayName] = useState('');
    const [errorText, setErrorText] = useState('');

    function handleStartContestClick() {
        if (!displayName || displayName.length === 0 || displayName.length < 3) {
            setErrorText('Vui lòng điền tên hiển thị dự thi có đồ dài lớn hơn 3');
        } else {
            dispatch(setOpenPlaygroundFullscreenDialog(true));
            history.push({
                pathname: `${PAGE_PATHS.playground}/${PAGE_PATHS.compete}`,
                state: {contestId: id, isAnonymous: true, displayName: displayName}
            });
        }
    }

    function handleDisplayNameChange(event) {
        if (errorText !== '') {
            setErrorText('');
        }
        setDisplayName(event.target.value);
    }

    function renderCountDown(props) {
        return <CountdownRenderer {...props} />;
    }

    function renderStartContestButton() {
        const diff = moment(startAt).diff(moment.utc(), "ms");
        console.log("diff: ", diff);
        if (diff > 0) {
            return (<Countdown autoStart={true} date={Date.now() + diff} renderer={renderCountDown}/>);
        }

        return (<Button fullWidth variant="contained" color="primary" onClick={handleStartContestClick}>Tham gia
            thi</Button>)
    }

    return (
        <Grid container component="main" className={classes.root}>
            <Paper className={classes.paper}>
                <Typography gutterBottom variant="h6" component="h2" color="primary">
                    Chi tiết
                </Typography>
                <Table size="small">
                    <TableBody>
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
                            <TableCell className={classes.detailCell}>
                                {isPublic ? "công khai" : "riêng tư"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.detailCell}>Người tạo</TableCell>
                            <TableCell className={classes.detailCell}>{ownerName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.detailCell}>
                                Thời gian bắt đầu
                            </TableCell>
                            <TableCell className={classes.detailCell}>
                                {isoToLocalDateString(startAt)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.detailCell}>Diễn ra trong</TableCell>
                            <TableCell className={classes.detailCell}>
                                {msToTime(duration)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.detailCell}>Ngày tạo</TableCell>
                            <TableCell className={classes.detailCell}>
                                {isoToLocalDateString(createdAt)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Box mt={3}>
                    <TextField value={displayName} onChange={handleDisplayNameChange}
                               fullWidth
                               helperText={errorText}
                               label="Tên dự thi" variant="outlined"
                               error={errorText !== ''}/>
                </Box>
                <Box mt={3}>
                    {renderStartContestButton()}
                </Box>
            </Paper>
        </Grid>
    );
}
