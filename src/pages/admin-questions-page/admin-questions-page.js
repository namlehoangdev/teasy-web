import React, {useEffect} from 'react';
import './admin-questions-page.scss';
import {makeStyles, TableCell} from "@material-ui/core";
import {Folder as FolderIcon} from "@material-ui/icons";
import {QUESTION_TYPE_TEXT} from "../../consts";
import {useDispatch, useSelector} from "react-redux";
import {getOwnQuestions, updateOwnQuestionById, updateOwnQuestions} from "../../actions";
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

export default function AdminQuestionsPage() {
    const {questions} = useSelector(state => state.adminReducer) || [];
    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        dispatch(getOwnQuestions());
    }, []);

    function handleCreateNewFolderClick() {
    }


    function renderFiles(id) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {content, type, point} = questions.byHash[id];
        return (<React.Fragment>
            <TableCell align="left"> </TableCell>
            <TableCell align="left">{content}</TableCell>
            <TableCell align="left">{point}</TableCell>
            <TableCell align="left">{QUESTION_TYPE_TEXT[type]}</TableCell>
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
            <TableCell component="th" scope="row" align="left">Nội dung</TableCell>
            <TableCell component="th" scope="row" align="left">Điểm số</TableCell>
            <TableCell component="th" scope="row" align="left">Loại</TableCell>
        </React.Fragment>)
    }

    function handleFilesChange(files) {
        dispatch(updateOwnQuestions(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateOwnQuestionById(id, file));
    }


    return (<div className={classes.root}>
        <div className={classes.header}>
            <WorkingTableV2 filesByHash={questions.byHash}
                            filesById={questions.byId}
                            dragDisplayProperty="content"
                            setFiles={handleFilesChange}
                            setFileById={handleFileByIdChange}
                            renderFiles={renderFiles}
                            renderFolders={renderFolders}
                            renderHeaders={renderHeaders}/>
        </div>
    </div>)
}
