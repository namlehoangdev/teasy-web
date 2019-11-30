import React, {useEffect, useState} from 'react';
import {
    makeStyles,
    Button,
    TableCell,
    Paper,
    Typography,
    Grid,
    Container,
    Table,
    TableRow,
    Box
} from "@material-ui/core";
import {Folder as FolderIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getPublicContests, getSharedContests, updateAllContestById, updateAllContests, updateOwnContestById
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import moment from 'moment';
import {addDurationToString, isoToLocalDateString, msToTime} from "../../utils";
import Countdown from 'react-countdown-now';

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
        borderWidth:theme.spacing(1),
        borderColor:theme.palette.primary.main
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1
    }
}));

export default function PlaygroundAllContestsPage() {
    const {contests} = useSelector(state => state.playgroundReducer) || {};
    const [focusedDetailId, setFocusedDetailId] = useState(-1);
    const [focusedFiles, setFocusedFiles] = useState({});
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        dispatch(getSharedContests());
        dispatch(getPublicContests());
    }, []);


    function renderFiles(id) {
        const {name, ownerName, createdAt} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{ownerName}</TableCell>
            <TableCell align="left">{isoToLocalDateString(createdAt)}</TableCell>
        </React.Fragment>)
    }

    function renderFolders(folder) {
        return (<React.Fragment>
            <TableCell align="left"><FolderIcon/></TableCell>
            <TableCell align="left">{folder}</TableCell>
            <TableCell align="left"> </TableCell>
            <TableCell align="left"> </TableCell>
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left">.</TableCell>
            <TableCell component="th" scope="row" align="left">Tên cuộc thi</TableCell>
            <TableCell component="th" scope="row" align="left">Người chia sẻ</TableCell>
            <TableCell component="th" scope="row" align="left">Ngày tạo</TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateAllContests(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateAllContestById(id, file));
    }

    function handleFileClick(id) {
        setFocusedDetailId(id);
        setFocusedFiles({[id]: true});
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
        const {startAt, duration} = contests.byHash[focusedDetailId];

        const diff = moment(startAt).diff(moment.utc(), 'ms');
        console.log('diff: ', diff);
        if (diff > 0) {
            return (<Countdown autoStart={true} date={Date.now() + diff} renderer={renderCountDown}/>);
        }
        return (<Button variant="contained" color="primary">Tham gia thi</Button>)
    }

    function renderDetail() {
        if (focusedDetailId === -1) {
            return null;
        }
        const {name, description, startAt, createdAt, isPublic, code, isSecured, duration, password, permittedUsers, ownerName, test} = contests.byHash[focusedDetailId];
        return (<Paper className={classes.paper}>
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
        </Paper>)
    }


    return (<div className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={7} lg={8}>
                    <Paper className={classes.paper}>
                        <Typography gutterBottom variant="h6"
                                    component="h2" color="primary">Tất cả cuộc thi</Typography>
                        <WorkingTableV2 filesByHash={contests.byHash}
                                        filesById={contests.byId}
                                        selectedFilesHash={focusedFiles}
                                        dragDisplayProperty="content"
                                        setFiles={handleFilesChange}
                                        setFileById={handleFileByIdChange}
                                        renderFiles={renderFiles}
                                        renderFolders={renderFolders}
                                        renderHeaders={renderHeaders}
                                        onFileClick={handleFileClick}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    {renderDetail()}
                </Grid>
            </Grid>
        </Container>
    </div>)
}
