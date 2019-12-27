import React, {useEffect, useState} from 'react';
import {
    Container, Grid, makeStyles, Paper, TableCell, Typography, IconButton, Popover, Button,
    List, ListItem, ListItemText, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle
} from "@material-ui/core";
import {
    Folder as FolderIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, ShowChart as ShowChartIcon
} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    clearEditingContest,
    deleteOwnContest,
    getOwnContests, setOpenAdminFullscreenDialog, setOpenPlaygroundFullscreenDialog, updateEditingContest,
    updateOwnContestById,
    updateOwnContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {isoToLocalDateString} from "../../utils";
import {PAGE_PATHS} from "../../consts/page-paths-conts";
import {useHistory, useRouteMatch} from "react-router-dom";
import moment from "moment"

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container: {
        flex: 1,
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

export default function AdminContestPage() {
    const {contests} = useSelector(state => state.adminReducer) || {};
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [actionItemId, setActionItemId] = useState(null);
    const history = useHistory();
    const {path} = useRouteMatch();
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        dispatch(getOwnContests());
    }, []);

    useEffect(() => {
        if (contests && contests.byHash && actionItemId) {
            if (!contests.byHash[actionItemId]) {
                setActionItemId(null);
                setOpenRemoveDialog(false);
            }
        }
    }, [contests]);

    function handleCreateNewFolderClick() {
        console.log('create new folder');
    }


    function renderFolders(folder) {
        return (<React.Fragment>
            <TableCell align="left"><FolderIcon/></TableCell>
            <TableCell align="left">{folder}</TableCell>
            <TableCell align="left"> </TableCell>
            <TableCell align="left"> </TableCell>
            <TableCell align="left"> </TableCell>
            <TableCell align="left"> </TableCell>
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left"> </TableCell>
            <TableCell component="th" scope="row" align="left"><b>Tên cuộc thi</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Mô tả</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Ngày bắt đầu</b></TableCell>
            <TableCell component="th" scope="row" align="left"> </TableCell>
            <TableCell component="th" scope="row" align="left"> </TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateOwnContests(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateOwnContestById(id, file));
    }

    function handleRemoveContestClick() {
        dispatch(deleteOwnContest(actionItemId));
    }


    function handleEditContestIconClick(id) {
        const contest = contests.byHash[id];
        console.log('prepare update: ', contest);
        dispatch(clearEditingContest());
        dispatch(updateEditingContest(contest));
        dispatch(setOpenAdminFullscreenDialog(true));
        history.push(`${PAGE_PATHS.editContest}`);
    }

    function handleCancelRemoveDialog() {
        setOpenRemoveDialog(false);
        setActionItemId(null);
    }


    function handleRemoveContestIconClick(id) {
        setActionItemId(id);
        setOpenRemoveDialog(true);
    }

    function handleShowAllResultsIconClick(id) {
        const contest = contests.byHash[id];
        console.log('prepare update: ', contest);
        dispatch(setOpenAdminFullscreenDialog(true));
        history.push({pathname: `${PAGE_PATHS.contestResults}`, state: {contestId: id}});
    }

    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {name, description, startAt} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{description || '.....'}</TableCell>
            <TableCell align="left">{moment(startAt).year()=== 1 ? 'không' : isoToLocalDateString(startAt)}</TableCell>
            <TableCell align="left">
                <IconButton onClick={() => handleEditContestIconClick(id)}>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={() => handleRemoveContestIconClick(id)}>
                    <DeleteIcon/>
                </IconButton>
                <IconButton onClick={() => handleShowAllResultsIconClick(id)}>
                    <ShowChartIcon/>
                </IconButton>
            </TableCell>
        </React.Fragment>)
    }

    return (<div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography gutterBottom variant="h6"
                            component="h2" color="primary">Quản lý cuộc thi</Typography>
                <WorkingTableV2 filesByHash={contests.byHash}
                                numberOfColumns={5}
                                isLoading={isShowCircleLoading}
                                filesById={[...contests.byId].reverse()}
                                dragDisplayProperty="content"
                                setFiles={handleFilesChange}
                                setFileById={handleFileByIdChange}
                                renderFiles={renderFiles}
                                renderFolders={renderFolders}
                                renderHeaders={renderHeaders}/>
            </Paper>


            <Dialog
                open={isOpenRemoveDialog}
                onClose={() => setOpenRemoveDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn thật sự muốn xóa bỏ cuộc thi này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelRemoveDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleRemoveContestClick} color="primary" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
