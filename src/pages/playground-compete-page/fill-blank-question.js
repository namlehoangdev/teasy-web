import React, {useState} from 'react';
import {
    TextField,
    makeStyles,
    Chip
} from "@material-ui/core";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {COMPETING_CONTEST_STATE, QUESTION_STATE} from "../../consts";


const useStyles = makeStyles(theme => ({
    radioGroup: {
        margin: 0
    },
    root:{
      display: 'flex',
      flexDirection: 'row',
    },
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    chipContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: theme.spacing(2),
        alignItems: 'center',
        //justifyContent: 'center',
        maxWidth:'50vw'
    },
    chip: {
        marginLeft:theme.spacing(2)
    },
    textField:{
      marginTop:theme.spacing(1)
    }
}));

export default function FillBlankQuestion(props) {
    const classes = useStyles();
    const {onAnswerChange, question, answersById, questionState, rightAnswers} = props;
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

    function renderFullAnswers() {
        return (<div className={classes.chipContainer}>
            Câu trả lời đúng:
            {rightAnswers && rightAnswers.map((item) => {
                const {id, content} = item;
                return (<Chip className={classes.chip} key={id} label={content}
                              variant="outlined"/>)
            })}
        </div>)
    }


    return (
        <React.Fragment className={classes.root}>
            <TextField id="filled-textarea"
                        className={classes.textField}
                       error={questionState === QUESTION_STATE.WRONG}
                       placeholder="Điền đáp án" multiline variant="filled" value={value}
                       onChange={handleAnswerChange}/>
             {state === COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER && renderFullAnswers()}
        </React.Fragment>)
}

FillBlankQuestion.propTypes = {
    onAnswerChange: PropTypes.func,
    answersById: PropTypes.array,
    question: PropTypes.any,
};
