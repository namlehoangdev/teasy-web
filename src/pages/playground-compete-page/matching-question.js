import React, {useState} from 'react';
import {
    TextField,
    makeStyles,
    Chip, FormControl, Select, MenuItem
} from "@material-ui/core";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {COMPETING_CONTEST_STATE, QUESTION_LEVEL_CODE, QUESTION_LEVEL_TEXT, QUESTION_STATE, TEXT} from "../../consts";
import Typography from "@material-ui/core/Typography";
import {ArrowRightAlt as ArrowRightAltIcon} from "@material-ui/icons";
import clsx from "clsx";
import {snackColors} from "../../consts/color";
import {disabledStyleWrapper} from "../../utils";


const useStyles = makeStyles(theme => ({
    radioGroup: {
        margin: 0
    },
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    chipContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    inputBase: {
        marginLeft: theme.spacing(3),
        borderBottom: '1px solid ' + theme.palette.background.paper,
        marginBottom: theme.spacing(1),
        "&:hover": {
            borderBottomColor: theme.palette.grey[400]
        },
        "&:focus": {
            backgroundColor: 'green',
        },
        "&:focus-within": {
            borderBottomColor: theme.palette.primary.main
        },
        "&:active": {}
    },
}));

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const DEFAULT_VALUE = 'Chọn đáp án';

export default function MatchingQuestion(props) {
    const classes = useStyles();
    const {onAnswerChange, question, options1 = [], options2 = [], resultsMatching = [], questionState, realOptions2} = props;
    const {competingContest} = useSelector(state => state.playgroundReducer) || {};
    const {answers: answersByHash, markedResults = {}, state} = competingContest;
    const {testRightAnswerIds} = markedResults;
    const {id: questionId} = question;
    const [value, setValue] = useState('');


    function handleMatchingResultsChange(event, index) {
        console.log('resultsMatching: ', resultsMatching);
        let newResultsMatching = [...resultsMatching];
        if (newResultsMatching.length < options1.length) {
            newResultsMatching = new Array(options1.length).fill(DEFAULT_VALUE);
        }
        console.log('event.target.value: ', event.target.value);
        newResultsMatching[index] = event.target.value;
        let result = {
            questionId: question.id,
            content: '',
            resultsMatching: newResultsMatching
        };
        onAnswerChange && onAnswerChange(result, questionId);
    }


    function renderOptions2(item, index) {
        return (<MenuItem key={index.toString()} value={options2[index]}>{options2[index]}</MenuItem>)
    }

    function renderRealOptions2(item, index) {
        if (!realOptions2 || !realOptions2[index]) {
            return null;
        }
        console.log('asdasdasd:', realOptions2[index], resultsMatching[index]);
        if (questionState === QUESTION_STATE.WRONG && realOptions2[index] !== resultsMatching[index]) {
            return <span style={{display:'flex',flexDirection:'row'}}>
                <Typography variant='small' className={classes.inputBase}
                            style={{marginLeft: 0, color:'grey'}}>Đáp án: </Typography>
            <Typography variant='small' className={classes.inputBase}
                        style={{marginLeft: 2}}>{realOptions2[index]}</Typography>
                </span>
        }
        return null;
    }

    function renderMatching(item, index) {
        let style = {};
        switch (questionState) {
            case QUESTION_STATE.WRONG :
                if (realOptions2[index] !== resultsMatching[index]) {
                    style = {color: snackColors.error};
                } else {
                    style = {color: snackColors.success};
                }
                break;
            case QUESTION_STATE.RIGHT:
                style = {color: snackColors.success};
                break;
            default:
                style = {};
        }

        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <FormControl className={clsx(classes.inputBase)}
                             style={disabledStyleWrapper(true, {}, {opacity: 1, border: 0})}>
                    <Select value={DEFAULT_VALUE}
                            IconComponent={() => <div/>}
                            disableUnderline>
                        <MenuItem value={DEFAULT_VALUE} disabled key={'placeholder'}>
                            {options1[index]}
                        </MenuItem>
                    </Select>
                </FormControl>
                {/*<Typography variant='p' className={classes.inputBase}*/}
                {/*            style={{marginLeft: 0, paddingVertical:'2px'}}>{options1[index]}</Typography>*/}
                <ArrowRightAltIcon color={'disabled'}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <FormControl className={clsx(classes.inputBase)} style={{marginLeft: 20}}>
                        <Select value={resultsMatching && resultsMatching[index] || DEFAULT_VALUE}
                                onChange={(event) => handleMatchingResultsChange(event, index)}
                                displayEmpty
                                disableUnderline
                                style={style}
                                inputProps={{
                                    name: 'question-level-selector', id: 'question-level-selector',
                                    style: style
                                }}>
                            <MenuItem value={DEFAULT_VALUE} disabled key={'placeholder'}>
                                {DEFAULT_VALUE}
                            </MenuItem>
                            {Object.values(options2).map(renderOptions2)}
                        </Select>

                    </FormControl>
                    {renderRealOptions2(item, index)}
                </div>
            </div>
        )
    }


    return (
        <React.Fragment>
            {options1 && options1.map(renderMatching)}
        </React.Fragment>)
}

MatchingQuestion.propTypes = {
    onAnswerChange: PropTypes.func,
    options1: PropTypes.array,
    options2: PropTypes.array,
    realOptions2: PropTypes.array,
    resultsMatching: PropTypes.any,
    question: PropTypes.any,
};
