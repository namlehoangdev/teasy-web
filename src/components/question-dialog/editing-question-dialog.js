import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, LinearProgress,
} from '@material-ui/core';
import {useSelector, useDispatch} from "react-redux";
import {QUESTION_DIALOG_MODE, TEXT} from "../../consts";
import {cancelCreateQuestionDialog, postQuestion, putQuestion, updateEditingQuestion} from "../../actions";

import EditingQuestionContent from "./editing-question-content";
import {useSnackbar} from "notistack";
import {disabledStyleWrapper} from "../../utils";
import Slider from "react-slick";


const QUESTION_DIALOG_TITLE = {
    [QUESTION_DIALOG_MODE.create]: `${TEXT.create} ${TEXT.question}`,
    [QUESTION_DIALOG_MODE.update]: `${TEXT.update} ${TEXT.question}`,
};

const useStyles = makeStyles(theme => ({
    root: {display: 'flex'},

    selectTypeBox: {width: '100%'},
    frontDrop: {
        top: theme.spacing(1),
        left: 0, bottom: 0, right: 0, position: 'absolute',
        background: 'white',
        opacity: 0.5
    }
}));

export default function EditingQuestionDialog() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {questionDialog, editingQuestion} = useSelector(state => state.adminReducer);
    const {isShowMiniLoading} = useSelector(state => state.uiEffectReducer);
    const {mode: questionDialogMode, isOpen,} = questionDialog;
    const {id} = editingQuestion;
    const {enqueueSnackbar} = useSnackbar();

    function handleCloseDialog() {
        dispatch(cancelCreateQuestionDialog());
    }

    function handleSuccess() {
        enqueueSnackbar('Đã lưu câu hỏi', {variant: 'success'});
        dispatch(cancelCreateQuestionDialog());
    }

    function handleError() {
        enqueueSnackbar('Đã lưu câu hỏi', {variant: 'error'});
        dispatch(cancelCreateQuestionDialog());
    }

    function handleSubmit() {
        if (id) {
            dispatch(putQuestion(editingQuestion, handleSuccess, handleError));
        } else {
            dispatch(postQuestion(editingQuestion, handleSuccess, handleError));
        }
    }

    function handleQuestionChange(changedData) {
        dispatch(updateEditingQuestion(changedData));
    }


    return (
        <Dialog open={isOpen} onClose={handleCloseDialog} aria-labelledby="create-dialog-title"
                style={disabledStyleWrapper(isShowMiniLoading, {}, {opacity: 1})}
                fullWidth maxWidth='lg'>
            {isShowMiniLoading && <LinearProgress/>}
            <DialogTitle id="create-dialog-title">{QUESTION_DIALOG_TITLE[questionDialogMode]}</DialogTitle>
            <DialogContent dividers>
                <EditingQuestionContent data={editingQuestion} onChange={handleQuestionChange} hideRemove/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">{TEXT.dismiss}</Button>
                <Button onClick={handleSubmit} variant="contained"
                        color="primary">{id ? TEXT.edit : TEXT.create}</Button>
            </DialogActions>
            {isShowMiniLoading && <div className={classes.frontDrop}/>}
        </Dialog>
    );
}

