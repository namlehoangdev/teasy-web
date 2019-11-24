import React, {useEffect, useState} from 'react';
import {makeStyles, TableCell, Paper, Typography, Grid, Container, Table, TableRow} from "@material-ui/core";
import {Folder as FolderIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getPublicContests, getSharedContests, updateAllContestById, updateAllContests, updateOwnContestById
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
        const {name, ownerName, startAt} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{ownerName}</TableCell>
            <TableCell align="left">{startAt}</TableCell>
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

    function renderDetail() {
        if (focusedDetailId === -1) {
            return null;
        }
        const {name, description, startAt, createAt, isPublic, code, isSecured, duration, password, permittedUsers, ownerName, test} = contests.byHash[focusedDetailId]
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
                    <TableCell className={classes.detailCell}>{startAt}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Diễn ra trong</TableCell>
                    <TableCell className={classes.detailCell}>{duration}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.detailCell}>Ngày tạo</TableCell>
                    <TableCell className={classes.detailCell}>{createAt}</TableCell>
                </TableRow>

            </Table>
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
