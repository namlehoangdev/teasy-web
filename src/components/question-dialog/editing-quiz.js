import React, {useState} from 'react';
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
import {useDispatch, useSelector} from "react-redux";
import {updateEditingQuestion} from "../../actions";
import {Close as CloseIcon, Done as DoneIcon, Edit as EditIcon} from "@material-ui/icons";
import produce from "immer";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(3),
        width: '100%'
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    radioGroup: {
        width: '100%'
    },
    radio: {
        marginTop: -theme.spacing(1)
    }

}));


export default function EditingQuiz() {
    const dispatch = useDispatch();
    const {editingQuestion} = useSelector(state => state.adminReducer);
    const {answers = []} = editingQuestion;
    const [answerRadioValue, setAnswerRadioValue] = useState('');
    const [showAddAnswerInput, setShowAddAnswerInput] = useState(false);
    const [newAnswer, setNewAnswer] = useState({id: 0, content: ''});
    const [answerDisabledMap, setAnswerDisabledMap] = useState(new Map());

    const classes = useStyles();


    function handleAnswerContentChange(event, currentAnswer) {
        const answerIndex = answers.findIndex(item => item.id === currentAnswer.id);
        dispatch(updateEditingQuestion(produce(editingQuestion, draft => {
            draft.answers[answerIndex].content = event.target.value
        })));
    }


    function handleRemoveAnswerClick(answer) {
        const {id = 0} = answer;
        dispatch(updateEditingQuestion(produce(editingQuestion, draft => {
            draft.answers.splice(answers.findIndex(item => item.id === id), 1)
        })));
    }


    function handleSubmitNewAnswerClick() {
        setShowAddAnswerInput(false);
        dispatch(updateEditingQuestion(produce(editingQuestion, draftState => {
            if (!draftState.answers) {
                draftState.answers = [];
            }
            draftState.answers.push(newAnswer);
        })));
        setNewAnswer({content: '', id: 0});
        setAnswerDisabledMap(produce(draft => {
            draft.forEach((value, key) => {
                draft[key] = true;
            })
        }))
    }

    function handleAddMoreAnswerClick() {
        setShowAddAnswerInput(true);
        const currentSmallestId = answers.reduce((minKey, curAnswer) =>
            (parseInt(curAnswer.id) < 0 && parseInt(curAnswer.id) < minKey ? curAnswer.id : minKey), 0);
        setNewAnswer({id: currentSmallestId - 1, content: ''});
    }

    function handleCancelNewAnswerClick() {
        setShowAddAnswerInput(false);
        setNewAnswer({content: '', id: -1});
    }

    function handleEditAnswerClick(item) {
        const {id} = item;
        setAnswerDisabledMap(produce(draft => {
            draft[id] = true
        }));
    }


    function renderAnswers(item) {
        const {id, content} = item;
        if (!id) return null;
        const answerInputProps = {
            disableUnderline: true,
            endAdornment:
                (<InputAdornment position="end">
                    <IconButton edge="end" onClick={handleEditAnswerClick}><EditIcon/></IconButton>
                    <IconButton edge="end" onClick={() => handleRemoveAnswerClick(item)}><CloseIcon/></IconButton>
                </InputAdornment>)
        };

        return (<Grid item key={id} className={classes.textFieldContainer}>
            <FormControlLabel value={id.toString()} control={<Radio className={classes.radio}/>} label=''/>
            <TextField multiline value={content}
                       fullWidth
                       disableUnderline={true}
                       onChange={(event) => handleAnswerContentChange(event, item)}
                       InputProps={answerInputProps}/>
        </Grid>)
    }

    function renderAddNewAnswerInput() {
        const {id, content} = newAnswer;
        if (!showAddAnswerInput)
            return;

        const newAnswerInputProps = {
            endAdornment:
                (<InputAdornment position="end">
                    <IconButton edge="end" onClick={handleSubmitNewAnswerClick}><DoneIcon/></IconButton>
                    <IconButton edge="end" onClick={handleCancelNewAnswerClick}><CloseIcon/></IconButton>
                </InputAdornment>)
        };

        return (<Grid item key={id} className={classes.textFieldContainer}>
            <FormControlLabel value={id.toString()} control={<Radio className={classes.radio}/>} label=''/>
            <TextField multiline placeholder={TEXT.addMoreAnswer}
                       value={content}
                       disabled={answerDisabledMap[id]}
                       variant='outlined'
                       fullWidth
                       onChange={(event) => setNewAnswer({...newAnswer, content: event.target.value})}
                       onKeyPress={(e) => e.key === 'Enter' && handleSubmitNewAnswerClick()}
                       InputProps={newAnswerInputProps}/>
        </Grid>)
    }

    return (<FormControl component="fieldset" className={classes.formControl}>
        <Grid container xs={11} sm={11} md={11} className={classes.radioGroup}>
            <RadioGroup name="edit-answer-radio" value={answerRadioValue}
                        className={classes.radioGroup}
                        aria-label="edit-answer-radio-1"
                        onChange={(event) => setAnswerRadioValue(event.target.value)}>
                {answers.map(renderAnswers)}
                {renderAddNewAnswerInput()}
            </RadioGroup>
            {!showAddAnswerInput && (<Button onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>)}
        </Grid>
    </FormControl>);
}

