import React, {useEffect, useState} from 'react';
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    makeStyles,
    Radio,
    RadioGroup
} from "@material-ui/core";
import {TEXT} from "../../consts/text-consts";
import {Close as CloseIcon} from "@material-ui/icons";
import produce from "immer";
import {addToNormalizedList, DefaultNormalizer, removeFromNormalizedList} from "../../utils/byid-utils";
import PropTypes from 'prop-types';
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles(theme => ({
    formControl: {
        display: 'flex',
        flex: 1,
        marginTop: theme.spacing(3)
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: theme.spacing(1)
    },
    radioGroup: {
        width: '100%'
    },
    radio: {
        marginTop: -theme.spacing(1)
    },
    inputBase: {
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


export default function EditingQuiz(props) {
    const {data, onChange} = props;
    const {answers} = data;
    const [answerRadioValue, setAnswerRadioValue] = useState('');

    useEffect(() => {
        if (!answers || !answers.byId) {
            onChange({answers: new DefaultNormalizer()});
        } else {
            answers.byId.forEach((id) => {
                if (answers.byHash[id].isTrue) {
                    setAnswerRadioValue(id);
                }
            });
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
            if (!draftState.answers) {
                const newAnswers = new DefaultNormalizer();
                addToNormalizedList(newAnswers, {
                    id: currentSmallestId - 1,
                    content: `Đáp án ${answers.byId.length + 1}`
                });
                draftState.answers = newAnswers;
            } else {
                addToNormalizedList(draftState.answers, {
                    id: currentSmallestId - 1,
                    content: `Đáp án ${answers.byId.length + 1}`
                });
            }
        }));
    }

    function handleOnAnswerBlur(answerId, index) {
        const {content} = answers.byHash[answerId];
        if (!content || content.length === 0) {
            onChange({
                answers: produce(answers, draftState => {
                    draftState.byHash[answerId].content = `Đáp án ${index + 1}`
                })
            });
        }
    }

    function renderAnswers(answerId, index) {
        const {content} = answers.byHash[answerId];
        return (<Grid item key={answerId} className={classes.textFieldContainer}>
            <FormControlLabel value={answerId.toString()} control={<Radio className={classes.radio}/>} label=''/>
            <InputBase multiline value={content}
                       className={classes.inputBase}
                       fullWidth
                       variant="outlined"
                       onBlur={() => handleOnAnswerBlur(answerId, index)}
                       onChange={(event) => handleAnswerContentChange(event, answerId, index)}/>
            <IconButton edge="end"
                        onClick={() => handleRemoveAnswerClick(answerId)}><CloseIcon/></IconButton>
        </Grid>)
    }

    function handleRadioChange(event) {
        const {answers} = data;
        const answersId = event.target.value.toString();
        setAnswerRadioValue(event.target.value);
        onChange({
            answers: produce(answers, draftState => {
                draftState.byId.map(id => {
                    draftState.byHash[id].isTrue = id.toString() === answersId;
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
        <div>
            <Button color={"primary"} onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>
        </div>
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


