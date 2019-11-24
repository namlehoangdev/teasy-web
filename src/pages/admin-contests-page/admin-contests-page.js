import React, {useEffect} from 'react';
import {makeStyles, TableCell} from "@material-ui/core";
import {Folder as FolderIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getOwnContests,
    updateOwnContestById,
    updateOwnContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function AdminContestPage() {
    const {contests} = useSelector(state => state.adminReducer) || [];
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        dispatch(getOwnContests());
    }, []);

    function handleCreateNewFolderClick() {
        console.log('create new folder');
    }


    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {name, description, startAt} = contests.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{name}</TableCell>
            <TableCell align="left">{description}</TableCell>
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
            <TableCell component="th" scope="row" align="left">Mô tả</TableCell>
            <TableCell component="th" scope="row" align="left">Ngày tạo</TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateOwnContests(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateOwnContestById(id, file));
    }


    return (<div className={classes.root}>
        <div className={classes.header}>
            <WorkingTableV2 files={contests}
                            dragDisplayProperty="content"
                            setFiles={handleFilesChange}
                            setFileById={handleFileByIdChange}
                            renderFiles={renderFiles}
                            renderFolders={renderFolders}
                            renderHeaders={renderHeaders}/>
        </div>
    </div>)
}
