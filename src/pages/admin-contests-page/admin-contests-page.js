import React, {useEffect, useState} from 'react';
import {
    Container, Grid, makeStyles, Paper, TableCell, Typography, IconButton, Popover, Button,
    List, ListItem, ListItemText, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle
} from "@material-ui/core";
import {
    Folder as FolderIcon, MoreVert as MoreVertIcon,
    Edit as EditIcon, Delete as DeleteIcon
} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteOwnContest,
    getOwnContests,
    updateOwnContestById,
    updateOwnContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {isoToLocalDateString} from "../../utils";

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

export default function AdminContestPage() {
    const {contests} = useSelector(state => state.adminReducer) || {};
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const [actionItemId, setActionItemId] = useState(null);
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
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left"> </TableCell>
            <TableCell component="th" scope="row" align="left"><b>Tên cuộc thi</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Mô tả</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Ngày bắt đầu</b></TableCell>
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

    }

    function handleCancelRemoveDialog() {
        setOpenRemoveDialog(false);
        setActionItemId(null);
    }


    function handleRemoveContestIconClick(id) {
        setActionItemId(id);
        setOpenRemoveDialog(true);
    }

    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {name, description, startAt} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{description}</TableCell>
            <TableCell align="left">{isoToLocalDateString(startAt)}</TableCell>
            <TableCell align="left">
                <IconButton onClick={() => handleEditContestIconClick(id)}>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={() => handleRemoveContestIconClick(id)}>
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </React.Fragment>)
    }

    return (<div className={classes.root}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Paper className={classes.paper}>
                        <Typography gutterBottom variant="h6"
                                    component="h2" color="primary">Quản lý cuộc thi</Typography>
                        <WorkingTableV2 filesByHash={contests.byHash}
                                        filesById={contests.byId}
                                        dragDisplayProperty="content"
                                        setFiles={handleFilesChange}
                                        setFileById={handleFileByIdChange}
                                        renderFiles={renderFiles}
                                        renderFolders={renderFolders}
                                        renderHeaders={renderHeaders}/>
                    </Paper>
                </Grid>
            </Container>

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
