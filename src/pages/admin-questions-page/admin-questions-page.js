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
    Typography,fade, InputBase
} from "@material-ui/core";
import {Delete as DeleteIcon, Edit as EditIcon, Folder as FolderIcon} from "@material-ui/icons";
import {QUESTION_TYPE_TEXT} from "../../consts";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteOwnQuestion, getOwnQuestions, openCreateQuestionDialog, updateEditingQuestion,
    updateOwnQuestionById,
    updateOwnQuestions
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import RichEditor from "../../components/rich-editor/rich-editor";
import {useSnackbar} from "notistack";
import {Search as SearchIcon} from '@material-ui/icons';
import { trimSign } from 'utils';

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
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer:{
      display:'flex',
      alignSelf:'center',
      marginTop: theme.spacing(2)
    },
}));

export default function AdminQuestionsPage() {
    const {questions} = useSelector(state => state.adminReducer) || [];
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const [actionItemId, setActionItemId] = useState(null);
    const {enqueueSnackbar} = useSnackbar()
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();
    useEffect(() => {
        dispatch(getOwnQuestions());
    }, []);

    function handleCreateNewFolderClick() {
    }

    function handleRemoveQuestionClick() {
        dispatch(deleteOwnQuestion(actionItemId,
            () => {
                enqueueSnackbar('Đã xóa câu hỏi', {variant: 'success'});
                setOpenRemoveDialog(false);
            }, () => {
                enqueueSnackbar('Có lỗi xảy ra, không thể xóa câu hỏi', {variant: 'error'});
                setOpenRemoveDialog(false);
            }));
    }


    function handleEditQuestionIconClick(id) {
        dispatch(openCreateQuestionDialog());
        dispatch(updateEditingQuestion(questions.byHash[id]));
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
        const {content, type, level} = questions.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">
                <RichEditor editorState={content} readOnly={true}/>
            </TableCell>
            <TableCell align="left">{level}</TableCell>
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
            <TableCell component="th" scope="row" align="left"><b>Độ khó</b></TableCell>
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

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }


    return (<div className={classes.root}>

        <Paper elevation={3} className={classes.paper}>
            <Typography gutterBottom variant="h6"
                        component="h2" color="primary">Quản lý đề thi</Typography>
                        <div className={classes.searchContainer}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder="Tìm kiếm đề thi…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{'aria-label': 'search'}}
                        value={searchValue}
                        onChange={handleSearchInputChange}
                    />
                  </div>
                </div>
            <WorkingTableV2 filesByHash={questions.byHash}
                            isLoading={isShowCircleLoading}
                            numberOfColumns={5}
                            filesById={[...questions.byId].reverse().filter(id => trimSign(questions.byHash[id].name.toLowerCase()).includes(trimSign(searchValue.toLowerCase())))}
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
