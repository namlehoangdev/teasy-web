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
    Typography,fade, InputBase
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

export default function AdminTestsPage() {
    const {tests} = useSelector(state => state.adminReducer) || {};
    const history = useHistory();
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [actionItemId, setActionItemId] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [searchValue, setSearchValue] = useState('');
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
        //dispatch(setOpenAdminFullscreenDialog(true));
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

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }

    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {name, hasFullAnswers, questions} = tests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="center">{hasFullAnswers ? 'Có' : 'Không'}</TableCell>
            <TableCell align="center">{questions.byId.length}</TableCell>
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
            <TableCell component="th" scope="row" align="center"><b>Đủ đáp án</b></TableCell>
            <TableCell component="th" scope="row" align="center"><b>Số lượng câu hỏi</b></TableCell>
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
                <WorkingTableV2 filesByHash={tests.byHash}
                                numberOfColumns={5}
                                filesById={[...tests.byId].reverse().filter(id => trimSign(tests.byHash[id].name.toLowerCase()).includes(trimSign(searchValue.toLowerCase())))}
                                isLoading={isShowCircleLoading}
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

