import React, {useState, useEffect} from 'react';
import {Box, TextField, FormControlLabel, Grid, makeStyles, Radio, RadioGroup, Typography} from "@material-ui/core";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {COMPETING_CONTEST_STATE} from "../../consts";
import {snackColors} from "../../consts/color";


const useStyles = makeStyles(theme => ({
    radioGroup: {
        margin: 0
    },
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
}));

export default function FillBlankQuestion(props) {
    const classes = useStyles();
    const {onAnswerChange, question, answersById, trueAnswer} = props;
    const {competingContest} = useSelector(state => state.playgroundReducer) || {};
    const {answers: answersByHash, markedResults = {}, state} = competingContest;
    const {testRightAnswerIds} = markedResults;
    const {id: questionId} = question;
    const [value, setValue] = useState('');


    function handleAnswerChange(event, index) {
        setValue(event.target.value);
        let result = {
            questionId: question.id,
            content: event.target.value
        };
        onAnswerChange && onAnswerChange(result, questionId);
    }


    return (<TextField id="filled-textarea"
                       InputProps={{disableUnderline: true}}
                       placeholder="Điền đáp án" multiline variant="filled" value={value}
                       onChange={handleAnswerChange}/>)
}

FillBlankQuestion.propTypes = {
    onAnswerChange: PropTypes.func,
    answersById: PropTypes.array,
    question: PropTypes.any,
};
