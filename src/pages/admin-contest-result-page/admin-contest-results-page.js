import React, {useEffect, useState} from 'react';
import './admin-contest-results-page.scss'
import {
    Button,
    Container,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    TableCell,
    Typography
} from "@material-ui/core";
import {Delete as DeleteIcon, Edit as EditIcon, Folder as FolderIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteOwnContest, deleteOwnTest, getContestById, getContestResultsById, getOwnContestResults,
    getOwnTests, updateAllContests, updateOwnContestResultById, updateOwnContestResults,
    updateOwnTestById,
    updateOwnTests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {isoToLocalDateString} from "../../utils";
import {useLocation} from "react-router";

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
    popover: {
        pointerEvents: 'none',
    },
    popPaper: {
        padding: theme.spacing(1),
    },
}));

export default function AdminContestResultsPage() {
    const {results} = useSelector(state => state.playgroundReducer) || {};
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const {state: locationState} = useLocation();
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        const {contestId} = locationState;
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
        const {competitionName, createdAt, rightAnswers, totalQuestion} = results.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{competitionName}</TableCell>
            <TableCell align="left">{isoToLocalDateString(createdAt)}</TableCell>
            <TableCell align="left"><b>{rightAnswers}/{totalQuestion}</b></TableCell>
        </React.Fragment>)
    }

    function renderFolders(folder) {
        return (<React.Fragment>
            <TableCell align="left"><FolderIcon/></TableCell>
            <TableCell align="left">{folder}</TableCell>
            <TableCell align="left"> </TableCell>
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left">.</TableCell>
            <TableCell component="th" scope="row" align="left"><b>Tên cuộc thi</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Ngày nộp bài</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Số câu đúng</b></TableCell>
        </React.Fragment>)
    }


    return (<div className={classes.root}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Paper className={classes.paper}>
                        <Typography gutterBottom variant="h6"
                                    component="h2" color="primary">Danh sách kết quả thi của {}</Typography>
                        <WorkingTableV2 filesByHash={results.byHash}
                                        filesById={results.byId}
                                        isShowLoading={isShowCircleLoading}
                                        dragDisplayProperty="content"
                                        setFiles={handleFilesChange}
                                        setFileById={handleFileByIdChange}
                                        renderFiles={renderFiles}
                                        renderFolders={renderFolders}
                                        renderHeaders={renderHeaders}/>
                    </Paper>
                </Grid>
            </Container>
        </div>
    )
}
