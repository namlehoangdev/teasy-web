import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {
    InputLabel,
    Select,
    MenuItem,
    FormControl, Grid, IconButton,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import {QUESTION_TYPE_CODES, QUESTION_TYPE_TEXT, TEXT} from "../../consts";
import RichEditor from "../rich-editor/rich-editor";
import {EditorState} from 'draft-js';
import EditingQuiz from "./editing-quiz";
import {Close as CloseIcon} from "@material-ui/icons";
import {updateEditingTest} from "../../actions";
import produce from "immer";
import {addToNormalizedList, DefaultNormalizer} from "../../utils/byid-utils";
import {useDispatch} from "react-redux";


const useStyles = makeStyles(() => ({
    root: {display: 'flex'},
    selectTypeBox: {width: '100%'},
    header: {flex: 1, justifyContent: 'space-between', alignItems: 'center'}
}));

export default function EditingQuestionContent(props) {
    const {data, onChange, onRemove} = props;
    const classes = useStyles();
    const {type: questionTypeCode = '', content, id} = data;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!content) {
            onChange({content: EditorState.createEmpty()})
        }
    }, []);


    function handleChangeQuestionType(event) {
        console.log('event.target.value', event);
        onChange({type: event.target.value});
    }


    if (!content) {
        onChange({content: EditorState.createEmpty()});
    }

    function handleEditorChange(event) {
        onChange({content: event});
    }

    function handleQuestionFormChange(newData) {
        onChange({...newData});
    }

    function handleRemoveQuestion() {
        onRemove && onRemove(id);
    }

    function renderQuestionFormByType() {
        switch (questionTypeCode) {
            case QUESTION_TYPE_CODES.quiz:
                return <EditingQuiz data={data} onChange={handleQuestionFormChange}/>;
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


    function renderQuestionTypeMenu(questionTypeCode) {
        return (
            <MenuItem key={questionTypeCode} value={questionTypeCode}>{QUESTION_TYPE_TEXT[questionTypeCode]}</MenuItem>)
    }

    return (<div>
        <Grid container direction="row" className={classes.header}>
            <Grid item>
                <FormControl className={classes.selectTypeBox}>
                    <Select value={(questionTypeCode === 0 || questionTypeCode > 0) ? questionTypeCode : -1}
                            onChange={handleChangeQuestionType}
                            displayEmpty
                            disableUnderline
                            inputProps={{
                                name: 'question-type-selector', id: 'question-type-selector',
                            }}>
                        <MenuItem value={-1} disabled key={'placeholder'}>
                            Chon {`${TEXT.type} ${TEXT.question}`}
                        </MenuItem>
                        {Object.values(QUESTION_TYPE_CODES).map(renderQuestionTypeMenu)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <IconButton edge="start" color="inherit" onClick={handleRemoveQuestion} aria-label="close">
                    <CloseIcon/>
                </IconButton>
            </Grid>
        </Grid>
        <RichEditor editorState={content} onChange={handleEditorChange}/>
        {renderQuestionFormByType()}
    </div>);
}


EditingQuestionContent.propTypes = {
    data: PropTypes.any,
    onChange: PropTypes.func
};

EditingQuestionContent.defaultProps = {
    onChange: () => {
    }
};
