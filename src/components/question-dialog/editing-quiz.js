import React, {useState, useEffect} from 'react';
import {
    Radio,
    RadioGroup,
    FormControl,
    Button,
    FormControlLabel,
    makeStyles,
    TextField,
    InputAdornment,
    IconButton, Grid
} from "@material-ui/core";
import {TEXT} from "../../consts/text-consts";
import {Close as CloseIcon} from "@material-ui/icons";
import produce from "immer";
import {
    addToNormalizedList,
    DefaultNormalizer,
    removeFromNormalizedList
} from "../../utils/byid-utils";
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    formControl: {
        display: 'flex',
        flex: 1
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(1)
    },
    radioGroup: {
        width: '100%'
    },
    radio: {
        marginTop: -theme.spacing(1)
    }

}));


export default function EditingQuiz(props) {
    const {data, onChange} = props;
    const {answers} = data;
    const [answerRadioValue, setAnswerRadioValue] = useState('');

    useEffect(() => {
        if (!answers || !answers.byId) {
            onChange({answers: new DefaultNormalizer()});
        }
    }, []);

    const classes = useStyles();


    function handleAnswerContentChange(event, answerId) {
        const {answers} = data;
        onChange({
            answers: produce(answers, draftState => {
                draftState.byHash[answerId].content = event.target.value
            })
        });
    }


    function handleRemoveAnswerClick(answerId) {
        const {answers} = data;
        onChange({
            answers: produce(answers, draftState => {
                removeFromNormalizedList(draftState, answerId)
            })
        });
    }


    function handleAddMoreAnswerClick() {
        const currentSmallestId = answers.byId.reduce((minKey, curKey) =>
            (parseInt(curKey) < 0 && parseInt(curKey) < minKey ? curKey : minKey), 0);

        onChange(produce(data, draftState => {
            console.log('draft state: ', draftState);
            if (!draftState.answers) {
                const newAnswers = new DefaultNormalizer();
                addToNormalizedList(newAnswers, {id: currentSmallestId - 1, content: ''});
                draftState.answers = newAnswers;
            } else {
                addToNormalizedList(draftState.answers, {id: currentSmallestId - 1, content: ''});
            }
        }));
    }

    function renderAnswers(answerId) {
        const {content} = answers.byHash[answerId];
        const answerInputProps = {
            endAdornment:
                (<InputAdornment position="end">
                    <IconButton edge="end"
                                onClick={() => handleRemoveAnswerClick(answerId)}><CloseIcon/></IconButton>
                </InputAdornment>)
        };

        return (<Grid item key={answerId} className={classes.textFieldContainer}>
            <FormControlLabel value={answerId.toString()} control={<Radio className={classes.radio}/>} label=''/>
            <TextField multiline value={content}
                       fullWidth
                       variant="outlined"
                       onChange={(event) => handleAnswerContentChange(event, answerId)}
                       InputProps={answerInputProps}/>
        </Grid>)
    }

    function handleRadioChange(event) {
        const {answers} = data;
        const answersId = event.target.value.toString();
        setAnswerRadioValue(event.target.value);
        onChange({
            answers: produce(answers, draftState => {
                draftState.byId.map(id => {
                    draftState.byHash[id].isTrue = id == answersId;
                })

            })
        });
    }

    return (<FormControl className={classes.formControl}>
        <RadioGroup name="edit-answer-radio" value={answerRadioValue}
                    className={classes.radioGroup}
                    aria-label="edit-answer-radio-1"
                    onChange={handleRadioChange}>
            {answers && answers.byId && answers.byId.map(renderAnswers)}
        </RadioGroup>
        <Button onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>
    </FormControl>);
}

EditingQuiz.propTypes = {
    data: PropTypes.any,
    onChange: PropTypes.func
};

EditingQuiz.defaultProps = {
    onChange: () => {
    }
};


