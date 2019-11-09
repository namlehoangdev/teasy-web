import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import {useSelector, useDispatch} from "react-redux";
import {QUESTION_DIALOG_MODE, TEXT} from "../../consts";
import {cancelCreateQuestionDialog, updateEditingQuestion} from "../../actions";

import EditingQuestionContent from "./editing-question-content";


const QUESTION_DIALOG_TITLE = {
    [QUESTION_DIALOG_MODE.create]: `${TEXT.create} ${TEXT.question}`,
    [QUESTION_DIALOG_MODE.update]: `${TEXT.update} ${TEXT.question}`,
};

const useStyles = makeStyles(theme => ({
    root: {display: 'flex'},

    selectTypeBox: {width: '100%'}
}));

export default function EditingQuestionDialog() {
    const dispatch = useDispatch();
    const {questionDialog, editingQuestion} = useSelector(state => state.adminReducer);
    const {mode: questionDialogMode, isOpen,} = questionDialog;

    function handleCloseDialog() {
        dispatch(cancelCreateQuestionDialog());
    }

    function handleQuestionChange(changedData) {
        dispatch(updateEditingQuestion(changedData));
    }


    return (
        <Dialog open={isOpen} onClose={handleCloseDialog} aria-labelledby="create-dialog-title"
                fullWidth maxWidth='lg'>
            <DialogTitle id="create-dialog-title">{QUESTION_DIALOG_TITLE[questionDialogMode]}</DialogTitle>
            <DialogContent dividers>
                <EditingQuestionContent data={editingQuestion} onChange={handleQuestionChange}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">{TEXT.dismiss}</Button>
                <Button onClick={handleCloseDialog} variant="contained" color="primary">{TEXT.create}</Button>
            </DialogActions>
        </Dialog>
    );
}

