import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {
    InputLabel,
    Select,
    MenuItem,
    FormControl, Grid,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import {QUESTION_TYPE_CODES, QUESTION_TYPE_TEXT, TEXT} from "../../consts";
import RichEditor from "../rich-editor/rich-editor";
import {EditorState} from 'draft-js';
import EditingQuiz from "./editing-quiz";


const useStyles = makeStyles(() => ({
    root: {display: 'flex'},
    selectTypeBox: {width: '100%'}
}));

export default function EditingQuestionContent(props) {
    const {data, onChange} = props;
    const classes = useStyles();
    const {type: questionTypeCode = '', content} = data;

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
        console.log(questionTypeCode);
        return (
            <MenuItem key={questionTypeCode} value={questionTypeCode}>{QUESTION_TYPE_TEXT[questionTypeCode]}</MenuItem>)
    }

    return (<div>
        <Grid item xs={12} sm={8} md={5}>
            <Grid item xs>
                <FormControl className={classes.selectTypeBox}>
                    <Select value={(questionTypeCode === 0 || questionTypeCode > 0) ? questionTypeCode : -1}
                            onChange={handleChangeQuestionType}
                            displayEmpty
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
