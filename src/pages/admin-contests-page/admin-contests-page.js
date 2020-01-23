import React, {useEffect, useState} from 'react';
import {
    makeStyles, Paper, TableCell, Typography, IconButton, Button,
    Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle, fade, InputBase
} from "@material-ui/core";
import {
    Folder as FolderIcon, Edit as EditIcon, Delete as DeleteIcon, ShowChart as ShowChartIcon
} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    clearEditingContest,
    deleteOwnContest,
    getOwnContests, setOpenAdminFullscreenDialog, updateEditingContest,
    updateOwnContestById,
    updateOwnContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {isoToLocalDateString, trimSign} from "../../utils";
import {PAGE_PATHS} from "../../consts/page-paths-conts";
import {useHistory} from "react-router-dom";
import moment from "moment"
import {CopyRoomCodeButton} from "../../components";
import {Search as SearchIcon} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1
    },
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
    searchContainer: {
        display: 'flex',
        alignSelf: 'center',
        marginTop: theme.spacing(2)
    },
}));

export default function AdminContestPage() {
    const {contests} = useSelector(state => state.adminReducer) || {};
    const [isOpenRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [actionItemId, setActionItemId] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();
    useEffect(() => {
        dispatch(setOpenAdminFullscreenDialog(false));
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
            <TableCell component="th" scope="row" align="center"><b>Mã vào thi nhanh</b></TableCell>
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
        history.push({pathname: `${PAGE_PATHS.contestResults}`, state: {contestId: id}});
    }

    function renderFiles(id) {
        const {name, description, startAt, code, isPublic} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{description || '.....'}</TableCell>
            <TableCell align="left">{moment(startAt).year() === 1 ? 'không' : isoToLocalDateString(startAt)}</TableCell>
            {isPublic ? <TableCell align="center"><CopyRoomCodeButton code={code}/></TableCell> :
                <TableCell align="center">...</TableCell>}
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

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }

    return (<div className={classes.root}>
            <Paper elevation={3} className={classes.paper}>
                <Typography gutterBottom variant="h6"
                            component="h2" color="primary">Quản lý cuộc thi</Typography>
                <div className={classes.searchContainer}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase
                            placeholder="Tìm kiếm cuộc thi…"
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
                <WorkingTableV2 filesByHash={contests.byHash}
                                numberOfColumns={5}
                                isLoading={isShowCircleLoading}
                                filesById={[...contests.byId].reverse().filter(id => trimSign(contests.byHash[id].name.toLowerCase()).includes(trimSign(searchValue.toLowerCase())))}
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
