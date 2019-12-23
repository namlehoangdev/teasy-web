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
    Typography, FormControl, InputAdornment, IconButton, LinearProgress
} from "@material-ui/core";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {disabledStyleWrapper, isoToLocalDateString, msToTime} from "../../utils";
import moment from "moment";
import Countdown from "react-countdown-now";
import {CountdownRenderer} from "../../components";
import {getAnonymousContestById, getContestById, setOpenPlaygroundFullscreenDialog} from "../../actions";
import {PAGE_PATHS} from "../../consts";
import Input from "@material-ui/core/Input";
import {Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from "@material-ui/icons";
import {getAnonymousContestByIdAPI} from "../../apis/playground-apis";
import _ from "lodash";
import InputLabel from "@material-ui/core/InputLabel";

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


export default function PlaygroundAnonymousWaitingRoomPage() {
    const {competingContest} = useSelector(state => state.playgroundReducer);
    const {
        id,
        name,
        description,
        startAt,
        createdAt,
        isPublic,
        isSecured,
        duration,
        ownerName,
    } = competingContest;
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const {isShowMiniLoading, isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [displayName, setDisplayName] = useState('');
    const [errorNameText, setErrorNameText] = useState('');
    const [errorPasswordText, setErrorPasswordText] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState(null);


    function onGetContestSuccess() {
        dispatch(setOpenPlaygroundFullscreenDialog(true));
        history.replace({
            pathname: `${PAGE_PATHS.playground}/${PAGE_PATHS.compete}`,
            state: {contestId: id, isAnonymous: true, displayName: displayName}
        });
    }

    function onGetContestError(error) {
        console.log('error: ', error);
        if (_.get(error, 'data.errorContent', '') === 'Password is not correct') {
            setErrorPasswordText('Mật khẩu không hợp lệ');
        }
    }

    function handleStartContestClick() {
        let isError = false;
        if (!displayName || displayName.length === 0 || displayName.length < 3) {
            setErrorNameText('Vui lòng điền tên hiển thị dự thi có đồ dài lớn hơn 3');
            isError = true;
        }
        if (isSecured && (!password || password.length === 0)) {
            setErrorPasswordText('Vui lòng điền mật khẩu');
            isError = true;
        }
        const extraParams = isSecured ? {password} : {};
        if (!isError) {
            dispatch(getAnonymousContestById(id, extraParams, onGetContestSuccess, onGetContestError));
        }
    }

    function handlePasswordChange(event) {
        if (errorPasswordText !== '') {
            setErrorPasswordText('');
        }
        setPassword(event.target.value);
    }

    function handleDisplayNameChange(event) {
        if (errorNameText !== '') {
            setErrorNameText('');
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

    const [hours, minutes] = msToTime(duration);
    return (
        <Grid container component="main" className={classes.root}>
            <Grid item component={Paper}
                  style={disabledStyleWrapper(isShowMiniLoading || isShowCircleLoading)}>
                {(isShowMiniLoading || isShowCircleLoading) && <LinearProgress/>}
                <div className={classes.paper}>
                    <Typography gutterBottom variant="h6" component="h2" color="primary">
                        Chi tiết
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell className={classes.detailCell}>Tên cuộc thi</TableCell>
                                <TableCell className={classes.detailCell}>{name}</TableCell>
                            </TableRow>
                            {description && <TableRow>
                                <TableCell className={classes.detailCell}>Mô tả</TableCell>
                                <TableCell className={classes.detailCell}>{description}</TableCell>
                            </TableRow>}
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
                                    {hours}:{minutes}
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
                                   helperText={errorNameText}
                                   label="Tên dự thi" variant="outlined"
                                   error={errorNameText !== ''}/>
                    </Box>


                    <Box mt={3}>
                        {isSecured && (<FormControl className={classes.passwordContainer}>
                            <InputLabel
                                style={(errorPasswordText !== '') ? {color: 'red'} : {}}
                                htmlFor="standard-adornment-password">{errorPasswordText === '' ? 'Mật khẩu' : errorPasswordText}</InputLabel>
                            <Input id="standard-adornment-password"
                                   type={showPassword ? 'text' : 'password'}
                                   error={errorPasswordText !== ''}
                                   value={password}
                                   onChange={handlePasswordChange}
                                   endAdornment={
                                       <InputAdornment position="end">
                                           <IconButton
                                               aria-label="toggle password visibility"
                                               onClick={() => setShowPassword(!showPassword)}
                                               onMouseDown={(event) => event.preventDefault()}>
                                               {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                           </IconButton>
                                       </InputAdornment>
                                   }
                            />
                        </FormControl>)}
                    </Box>
                    <Box mt={3}>
                        {renderStartContestButton()}
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}
