import React, {useEffect, useState} from 'react';
import './admin-questions-page.scss';
import {
    Button,
    Container,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Grid, IconButton,
    makeStyles,
    Paper,
    TableCell,
    Typography
} from "@material-ui/core";
import {Delete as DeleteIcon, Edit as EditIcon, Folder as FolderIcon} from "@material-ui/icons";
import {QUESTION_TYPE_TEXT} from "../../consts";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteOwnQuestion, getOwnQuestions,
    updateOwnQuestionById,
    updateOwnQuestions
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";

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

export default function AdminQuestionsPage() {
    const {questions} = useSelector(state => state.adminReducer) || [];
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const [actionItemId, setActionItemId] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        dispatch(getOwnQuestions());
    }, []);

    function handleCreateNewFolderClick() {
    }

    function handleRemoveQuestionClick() {
        dispatch(deleteOwnQuestion(actionItemId));
    }


    function handleEditQuestionIconClick(id) {

    }

    function handleCancelRemoveDialog() {
        setOpenRemoveDialog(false);
        setActionItemId(null);
    }


    function handleRemoveQuestionIconClick(id) {
        setActionItemId(id);
        setOpenRemoveDialog(true);
    }


    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {content, type, point} = questions.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{content}</TableCell>
            <TableCell align="left">{point}</TableCell>
            <TableCell align="left">{QUESTION_TYPE_TEXT[type]}</TableCell>
            <TableCell align="left">
                <IconButton onClick={() => handleEditQuestionIconClick(id)}>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={() => handleRemoveQuestionIconClick(id)}>
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
            <TableCell align="left"> </TableCell>
        </React.Fragment>)
    }

    function renderHeaders() {
        return (<React.Fragment>
            <TableCell component="th" scope="row" align="left">.</TableCell>
            <TableCell component="th" scope="row" align="left"><b>Nội dung</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Điểm số</b></TableCell>
            <TableCell component="th" scope="row" align="left"><b>Loại</b></TableCell>
            <TableCell component="th" scope="row" align="left"> </TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateOwnQuestions(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateOwnQuestionById(id, file));
    }


    return (<div className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Paper className={classes.paper}>
                    <Typography gutterBottom variant="h6"
                                component="h2" color="primary">Quản lý đề thi</Typography>
                    <WorkingTableV2 filesByHash={questions.byHash}
                                    filesById={questions.byId}
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
                    Bạn thật sự muốn xóa bỏ câu hỏi này?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelRemoveDialog} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={handleRemoveQuestionClick} color="primary" autoFocus>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    </div>);
}
