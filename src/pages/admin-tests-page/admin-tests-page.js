import React, {useEffect, useState} from 'react';
import './admin-tests-page.scss';
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
    clearEditingContest, clearEditingTest,
    deleteOwnContest, deleteOwnTest,
    getOwnTests, setOpenAdminFullscreenDialog, updateEditingContest, updateEditingTest,
    updateOwnTestById,
    updateOwnTests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {PAGE_PATHS} from "../../consts";
import {useHistory} from "react-router";

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

export default function AdminTestsPage() {
    const {tests} = useSelector(state => state.adminReducer) || {};
    const history = useHistory();
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [actionItemId, setActionItemId] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        console.log('admin test page didmount before get: ', tests);
        dispatch(getOwnTests());
    }, []);

    useEffect(() => {
        if (tests && tests.byHash && actionItemId) {
            if (!tests.byHash[actionItemId]) {
                setActionItemId(null);
                setOpenRemoveDialog(false);
            }
        }
    }, [tests]);


    function handleCreateNewFolderClick() {
    }

    function handleRemoveTestClick() {
        dispatch(deleteOwnTest(actionItemId));
    }


    function handleEditTestIconClick(id) {
        const test = tests.byHash[id];
        console.log('prepare update: ', test);
        dispatch(clearEditingTest());
        dispatch(updateEditingTest(test));
        dispatch(setOpenAdminFullscreenDialog(true));
        history.push(`${PAGE_PATHS.editTest}`);
    }

    function handleCancelRemoveDialog() {
        setOpenRemoveDialog(false);
        setActionItemId(null);
    }


    function handleRemoveTestIconClick(id) {
        setActionItemId(id);
        setOpenRemoveDialog(true);
    }


    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {name, hasFullAnswers} = tests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{hasFullAnswers ? 'Có' : 'Không'}</TableCell>
            <TableCell align="left">
                <IconButton onClick={() => handleEditTestIconClick(id)}>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={() => handleRemoveTestIconClick(id)}>
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
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
            <TableCell component="th" scope="row" align="left"><b>Nội dung</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Đủ đáp án</b></TableCell>
            <TableCell component="th" scope="row" align="left"> </TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateOwnTests(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateOwnTestById(id, file));
    }


    return (<div className={classes.root}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Paper className={classes.paper}>
                        <Typography gutterBottom variant="h6"
                                    component="h2" color="primary">Quản lý đề thi</Typography>
                        <WorkingTableV2 filesByHash={tests.byHash}
                                        filesById={tests.byId}
                                        isLoading={isShowCircleLoading}
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
                        Bạn thật sự muốn xóa bỏ để thi này? Có thể sẽ ảnh hưởng tới cuộc thi đang sử dụng nó.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelRemoveDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleRemoveTestClick} color="primary" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

