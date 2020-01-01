import React, {useEffect, useState} from 'react';
import './admin-contest-results-page.scss'
import {
    AppBar, Box, Button,
    Container,
    Grid, IconButton,
    makeStyles,
    Paper,
    TableCell, Toolbar,
    Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    getContestResultsById,
    setOpenAdminFullscreenDialog,
    updateOwnContestResultById,
    updateOwnContestResults
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {isoToLocalDateString} from "../../utils";
import {useHistory, useLocation} from "react-router";
import {Close as CloseIcon} from "@material-ui/icons";
import {TEXT} from "../../consts";

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
        flex: 1,
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    detailCell: {
        borderBottom: 0
    },
    popover: {
        pointerEvents: 'none',
    },
    popPaper: {
        padding: theme.spacing(1),
    },
}));

export default function AdminContestResultsPage() {
    const {contests = {}} = useSelector(state => state.adminReducer);
    const {state: locationState} = useLocation();
    const {contestId} = locationState;
    const contest = contests.byHash[contestId];
    const {name: contestName, results = {}} = contest;
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    useEffect(() => {
        console.log('get contest results by id: ', contestId);
        dispatch(getContestResultsById(contestId));
    }, []);


    function handleFilesChange(files) {
        dispatch(updateOwnContestResults(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateOwnContestResultById(id, file));
    }


    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {displayName, ownerId, createdAt, rightAnswers, totalQuestion} = results.byHash[id];
        const anonymousLabel = ownerId ? '' : `\n(ẩn danh)`;
        return (<React.Fragment>
            <TableCell align="left">{`${displayName} ${anonymousLabel}`}</TableCell>
            <TableCell align="left">{isoToLocalDateString(createdAt)}</TableCell>
            {totalQuestion === 0 ? <TableCell align="center"><b>{'Không có'}</b></TableCell> :
                <TableCell align="center"><b>{rightAnswers}/{totalQuestion}</b></TableCell>}
        </React.Fragment>)
    }

    function renderFolders(folder) {
        return (<React.Fragment>
            <TableCell align="left">{folder}</TableCell>
            <TableCell align="left"> </TableCell>
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left"><b>Tên thí sinh</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Ngày nộp bài</b></TableCell>
            <TableCell component="th" scope="row" align="center"><b>Số câu đúng</b></TableCell>
        </React.Fragment>)
    }

    function handleClose() {
        history.goBack();
        dispatch(setOpenAdminFullscreenDialog(false));
    }


    return (<div className={classes.root}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>Chi tiết kết quả</Typography>
                </Toolbar>
            </AppBar>
            <Box m={3} mt={10}>
                <Paper elevation={3} className={classes.paper}>
                    <Typography gutterBottom variant="h6"
                                component="h2" color="primary">Danh sách kết quả thi của {contestName}</Typography>
                    <WorkingTableV2 filesByHash={results.byHash}
                                    numberOfColumns={3}
                                    filesById={results.byId}
                                    isLoading={isShowCircleLoading}
                                    dragDisplayProperty="content"
                                    setFiles={handleFilesChange}
                                    setFileById={handleFileByIdChange}
                                    renderFiles={renderFiles}
                                    renderFolders={renderFolders}
                                    renderHeaders={renderHeaders}/>
                </Paper>
            </Box>
        </div>
    )
}

