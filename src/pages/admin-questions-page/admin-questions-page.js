import React, {useState, useEffect} from 'react';
import './admin-questions-page.scss';
import {Backdrop, Checkbox, makeStyles, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Folder as FolderIcon} from "@material-ui/icons";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@material-ui/lab";
import {QUESTION_TYPE_TEXT, TEXT} from "../../consts";
import {CreateNewFolder as CreateNewFolderIcon, PostAdd as PostAddIcon} from "@material-ui/icons";
import {WorkingTable} from "../../components";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {updateAdminQuestionById, updateAdminQuestions} from "../../actions";

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
        console.log(questions);
    }, []);

    function handleCreateNewFolderClick() {
    }


    function renderFiles(file) {
        //const labelId = `enhanced-table-checkbox-${index}`;
        const {content, type, point} = file;
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
        return (<TableHead>
            <TableCell component="th" scope="row" align="left"> </TableCell>
            <TableCell component="th" scope="row" align="left">Nội dung</TableCell>
            <TableCell component="th" scope="row" align="left">Điểm số</TableCell>
            <TableCell component="th" scope="row" align="left">Loại</TableCell>
        </TableHead>)
    }

    function handleFilesChange(files) {
        dispatch(updateAdminQuestions(files));
    }

    function handleFileByIdChange(id, file) {
        dispatch(updateAdminQuestionById(id, file));
    }


    return (<div className={classes.root}>
        <div className={classes.header}>
            <WorkingTable files={questions}
                          dragDisplayProperty="content"
                          setFiles={handleFilesChange}
                          setFileById={handleFileByIdChange}
                          renderFiles={renderFiles}
                          renderFolders={renderFolders}
                          renderHeaders={renderHeaders}/>
        </div>
    </div>)
}
