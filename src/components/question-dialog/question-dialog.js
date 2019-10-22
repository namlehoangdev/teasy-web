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
import {updateEditingQuestion} from "../../actions";


const QUESTION_DIALOG_TITLE = {
    [QUESTION_DIALOG_MODE.create]: `${TEXT.create} ${TEXT.question}`,
    [QUESTION_DIALOG_MODE.update]: `${TEXT.update} ${TEXT.question}`,
};

const useStyles = makeStyles(theme => ({
    root: {display: 'flex'},

    selectTypeBox: {width: '100%'}
}));

export default function QuestionDialog() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {editingQuestion, questionDialog} = useSelector(state => state.adminReducer);
    const {mode: questionDialogMode, isOpen} = questionDialog;
    const {type: questionTypeCode = ''} = editingQuestion;

    function handleCloseDialog() {
        console.log('close question dialog');
    }

    function handleChangeQuestionType(event) {
        // setValues(oldValues => ({
        //     ...oldValues,
        //     [event.target.name]: event.target.value,
        // }));
        dispatch(updateEditingQuestion({type: event.target.value}))
    }

    function renderQuestionTypeMenu(questionTypeCode) {
        return (<MenuItem value={questionTypeCode}>{QUESTION_TYPE_TEXT[questionTypeCode]}</MenuItem>)
    }

    return (
        <Dialog open={isOpen} onClose={handleCloseDialog} aria-labelledby="create-dialog-title"
                fullWidth maxWidth='lg'>
            <DialogTitle id="create-dialog-title">{QUESTION_DIALOG_TITLE[questionDialogMode]}</DialogTitle>
            <DialogContent dividers>
                <Grid contentEditable xs={12} sm={8} md={5}>
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
                <TextField autoFocus margin="dense" label="lk" type="email" fullWidth/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">{TEXT.dismiss}</Button>
                <Button onClick={handleCloseDialog} variant="contained" color="primary">{TEXT.create}</Button>
            </DialogActions>
        </Dialog>
    );
}

