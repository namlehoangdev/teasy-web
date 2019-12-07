import React, {useState, useEffect} from 'react';
import {Box, FormControlLabel, Grid, makeStyles, Radio, RadioGroup, Typography} from "@material-ui/core";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";


const useStyles = makeStyles(theme => ({
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
}));

export default function QuizQuestion(props) {
    const classes = useStyles();
    const {onAnswerChange, question, answersById} = props;
    const {competingContest} = useSelector(state => state.playgroundReducer) || {};
    const {answers: answersByHash} = competingContest;
    const {id: questionId} = question;
    const [value, setValue] = useState('');


    function handleAnswerChange(event,index) {
        setValue(event.target.value);
        let result = {
            questionId: question.id,
            content: event.target.value
        };
        onAnswerChange && onAnswerChange(result,questionId);
    }


    function renderAnswers(answerKey, index) {
        const {content} = answersByHash[answerKey];
        const answerCharacter = String.fromCharCode(65 + index);
        return (<Grid item key={answerKey} className={classes.answerContainer}>
            <FormControlLabel value={content} control={<Radio className={classes.radio}/>} label=''/>
            <Typography><b>{answerCharacter}.</b> {content}</Typography>
        </Grid>);
    }

    return (<RadioGroup name={questionId} value={value}
                        className={classes.radioGroup}
                        aria-label={questionId}
                        onChange={handleAnswerChange}>
            {answersById.map(renderAnswers)}
        </RadioGroup>
    )
}

QuizQuestion.propTypes= {
    onAnswerChange:PropTypes.func,
    answersById:PropTypes.array,
    question:PropTypes.any,
};
