import React, {useEffect, useState} from 'react';
import {Button, Container, Grid, makeStyles, Paper, Table, TableCell, TableRow, Typography} from "@material-ui/core";
import {Folder as FolderIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getSharedContests,
    setOpenPlaygroundFullscreenDialog, updateAllContestById, updateAllContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {isoToLocalDateString, msToTime} from "../../utils";
import {useHistory} from "react-router";
import {PAGE_PATHS} from "../../consts";
import moment from "moment";
import Countdown from "react-countdown-now";

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    detailCell: {
        borderBottom: 0
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

function StartButtonWrapper(props) {
    const {onMount, onClick} = props;
    useEffect(() => {
        onMount && onMount();
    }, []);

    function handleClick() {
        onClick && onClick();
    }

    return <Button variant="contained" color="primary" onClick={handleClick}>Tham gia thi</Button>
}

export default function PlaygroundAllContestsPage() {
    const {contests, sharedContestIds} = useSelector(state => state.playgroundReducer) || {};
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer)
    const [focusedDetailId, setFocusedDetailId] = useState(-1);
    const [focusedFiles, setFocusedFiles] = useState({});
    const [endCountDown, setEndCountDown] = useState(true);
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (contests.byId.length > 0) {
            setFocusedDetailId(contests.byId[0]);
            setFocusedFiles({[contests.byId[0]]: true});
        } else {
            dispatch(getSharedContests());
        }
    }, [contests.byId]);

    function handleFileClick(id) {
        setFocusedDetailId(id);
        setFocusedFiles({[id]: true});
    }

    function handleStartContestClick(item) {
        console.log(item);
        dispatch(setOpenPlaygroundFullscreenDialog(true));
        history.push({pathname: `${PAGE_PATHS.playground}/${PAGE_PATHS.compete}`, state: {contestId: item.id}});
    }

    function renderCountDown({total, days, hours, minutes, seconds}) {
        return (
            <div className={classes.countDownContainer}>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{days}</span>
                    <span className={classes.labelCountDown}>ngày</span>
                </div>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{hours}</span>
                    <span className={classes.labelCountDown}>giờ</span>
                </div>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{minutes}</span>
                    <span className={classes.labelCountDown}>phút</span>
                </div>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{seconds}</span>
                    <span className={classes.labelCountDown}>giây</span>
                </div>
            </div>
        )
    }

    function renderStartContestButton() {
        if (focusedDetailId === -1) {
            return null;
        }
        const item = contests.byHash[focusedDetailId];
        const {startAt, duration} = item;

        const diff = moment(startAt).diff(moment.utc(), 'ms');
        console.log('diff: ', diff);
        if (diff > 0) {
            return (<Countdown autoStart={true} date={Date.now() + diff} renderer={renderCountDown}
                               onStart={() => setEndCountDown(false)} onComplete={() => setEndCountDown(true)}/>);
        }
        return (
            <StartButtonWrapper onMoun={() => setEndCountDown(true)} onClick={() => handleStartContestClick(item)}/>)
    }

    function handleGoToWaitingRoomClick(id) {
        history.push(`${PAGE_PATHS.waiting}?contestId=${id}`);
    }

    function renderFiles(id) {
        const {name, ownerName, startAt} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{ownerName}</TableCell>
            <TableCell align="left">{isoToLocalDateString(startAt)}</TableCell>
            <TableCell align="left"><Button
                color='primary'
                onClick={() => handleGoToWaitingRoomClick(id)}>Vào phòng chờ</Button></TableCell>
        </React.Fragment>)
    }

    function renderFolders(folder) {
        return (<React.Fragment>
            <TableCell align="left"><FolderIcon/></TableCell>
            <TableCell align="left">{folder}</TableCell>
            <TableCell align="left"> </TableCell>
            <TableCell align="left"> </TableCell>
            <TableCell align="left"> </TableCell>
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left">.</TableCell>
            <TableCell component="th" scope="row" align="left">Tên cuộc thi</TableCell>
            <TableCell component="th" scope="row" align="left">Người chia sẻ</TableCell>
            <TableCell component="th" scope="row" align="left">Ngày thi</TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateAllContests(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateAllContestById(id, file));
    }

    // function renderDetail() {
    //     if (focusedDetailId === -1) {
    //         return null;
    //     }
    //     const {name, description, startAt, createdAt, isPublic, duration, ownerName} = contests.byHash[focusedDetailId];
    //     return (<Paper className={classes.paper}>
    //         <Typography gutterBottom variant="h6" component="h2" color="primary">Chi tiết</Typography>
    //         <Table size="small">
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Tên cuộc thi</TableCell>
    //                 <TableCell className={classes.detailCell}>{name}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Mô tả</TableCell>
    //                 <TableCell className={classes.detailCell}>{description}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Trạng thái</TableCell>
    //                 <TableCell className={classes.detailCell}>{isPublic ? 'công khai' : 'riêng tư'}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Người tạo</TableCell>
    //                 <TableCell className={classes.detailCell}>{ownerName}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Thời gian bắt đầu</TableCell>
    //                 <TableCell
    //                     className={classes.detailCell}>{isoToLocalDateString(startAt)}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Diễn ra trong</TableCell>
    //                 <TableCell className={classes.detailCell}>{msToTime(duration)}</TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell className={classes.detailCell}>Ngày tạo</TableCell>
    //                 <TableCell className={classes.detailCell}>{isoToLocalDateString(createdAt)}</TableCell>
    //             </TableRow>
    //         </Table>
    //         {renderStartContestButton()}
    //     </Paper>)
    // }
    //

    return (<div className={classes.root}>
        <Paper className={classes.paper}>
            <Typography gutterBottom variant="h6"
                        component="h2" color="primary">Được chia sẻ với tôi</Typography>
            <WorkingTableV2 isLoading={isShowCircleLoading}
                            numberOfColumns={4}
                            filesByHash={contests.byHash}
                            filesById={sharedContestIds}
                            dragDisplayProperty="content"
                            setFiles={handleFilesChange}
                            setFileById={handleFileByIdChange}
                            renderFiles={renderFiles}
                            renderFolders={renderFolders}
                            renderHeaders={renderHeaders}
                            onFileClick={handleFileClick}/>
        </Paper>

    </div>)
};
