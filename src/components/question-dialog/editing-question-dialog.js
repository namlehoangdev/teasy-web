import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    DialogContentText,
    TextField, Paper, Grid,
} from '@material-ui/core';
import {useSelector, useDispatch} from "react-redux";
import {QUESTION_DIALOG_MODE, QUESTION_TYPE_CODES, QUESTION_TYPE_TEXT, TEXT} from "../../consts";
import {cancelCreateQuestionDialog, updateEditingQuestion} from "../../actions";
import RichEditor from "../rich-editor/rich-editor";
import {EditorState, convertFromRaw, ContentState} from 'draft-js';
import EditingQuiz from "./editing-quiz";


const QUESTION_DIALOG_TITLE = {
    [QUESTION_DIALOG_MODE.create]: `${TEXT.create} ${TEXT.question}`,
    [QUESTION_DIALOG_MODE.update]: `${TEXT.update} ${TEXT.question}`,
};

const useStyles = makeStyles(theme => ({
    root: {display: 'flex'},

    selectTypeBox: {width: '100%'}
}));

export default function EditingQuestionDialog() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {editingQuestion, questionDialog} = useSelector(state => state.adminReducer);
    const {mode: questionDialogMode, isOpen,} = questionDialog;
    const {type: questionTypeCode = '', content} = editingQuestion;

    function handleCloseDialog() {
        dispatch(cancelCreateQuestionDialog());
    }

    function handleDone() {

    }

    function handleChangeQuestionType(event) {
        dispatch(updateEditingQuestion({type: event.target.value}))
    }

    function renderQuestionTypeMenu(questionTypeCode) {
        return (
            <MenuItem key={questionTypeCode} value={questionTypeCode}>{QUESTION_TYPE_TEXT[questionTypeCode]}</MenuItem>)
    }


    if (!content) {
        dispatch(updateEditingQuestion({content: EditorState.createEmpty()}));
    }

    function handleEditorChange(event) {
        dispatch(updateEditingQuestion({content: event}));
    }

    function renderQuestionFormByType() {
        switch (questionTypeCode) {
            case QUESTION_TYPE_CODES.quiz:
                return <EditingQuiz/>;
            case QUESTION_TYPE_CODES.essay:
                return <div/>;
            case QUESTION_TYPE_CODES.fillBlank:
                return <div/>;
            case QUESTION_TYPE_CODES.matching:
                return <div/>;
            case QUESTION_TYPE_CODES.quizMulti:
                return <div/>;
        }
    }


    return (
        <Dialog open={isOpen} onClose={handleCloseDialog} aria-labelledby="create-dialog-title"
                fullWidth maxWidth='lg'>
            <DialogTitle id="create-dialog-title">{QUESTION_DIALOG_TITLE[questionDialogMode]}</DialogTitle>
            <DialogContent dividers>
                <Grid item xs={12} sm={8} md={5}>
                    <Grid item xs>
                        <FormControl className={classes.selectTypeBox}>
                            <InputLabel htmlFor="question-type-selector">{`${TEXT.type} ${TEXT.question}`}</InputLabel>
                            <Select value={questionTypeCode} onChange={handleChangeQuestionType}
                                    inputProps={{
                                        name: 'question-type-selector', id: 'question-type-selector',
                                    }}>
                                {Object.values(QUESTION_TYPE_CODES).map(renderQuestionTypeMenu)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <RichEditor editorState={content || null} onChange={handleEditorChange}/>
                {renderQuestionFormByType()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">{TEXT.dismiss}</Button>
                <Button onClick={handleCloseDialog} variant="contained" color="primary">{TEXT.create}</Button>
            </DialogActions>
        </Dialog>
    );
}

