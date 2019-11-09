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
import {
    addToNormalizedList,
    DefaultNormalizer,
    removeFromNormalizedList
} from "../../utils/byid-utils";

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
    const {answers = new DefaultNormalizer()} = editingQuestion;
    const [answerRadioValue, setAnswerRadioValue] = useState('');

    const classes = useStyles();


    function handleAnswerContentChange(event, answerId) {
        dispatch(updateEditingQuestion(produce(editingQuestion, draft => {
            draft.answers.byHash[answerId].content = event.target.value
        })));
    }


    function handleRemoveAnswerClick(answerId) {
        dispatch(updateEditingQuestion(produce(editingQuestion, draftState => {
            removeFromNormalizedList(draftState.answers, answerId);
        })));
    }


    function handleAddMoreAnswerClick() {
        const currentSmallestId = answers.byId.reduce((minKey, curKey) =>
            (parseInt(curKey) < 0 && parseInt(curKey) < minKey ? curKey : minKey), 0);

        dispatch(updateEditingQuestion(produce(editingQuestion, draftState => {
            console.log('draft state: ', draftState);
            if (!draftState.answers) {
                const newAnswers = new DefaultNormalizer();
                addToNormalizedList(newAnswers, {id: currentSmallestId - 1, content: ''});
                draftState.answers = newAnswers;
            } else {
                addToNormalizedList(draftState.answers, {id: currentSmallestId - 1, content: ''});
            }
        })));
    }


    function renderAnswers(answerId) {
        const {content} = answers.byHash[answerId];
        const answerInputProps = {
            endAdornment:
                (<InputAdornment position="end">
                    <IconButton edge="end" onClick={() => handleRemoveAnswerClick(answerId)}><CloseIcon/></IconButton>
                </InputAdornment>)
        };

        return (<Grid item key={answerId} className={classes.textFieldContainer}>
            <FormControlLabel value={answerId.toString()} control={<Radio className={classes.radio}/>} label=''/>
            <TextField multiline value={content}
                       fullWidth
                       onChange={(event) => handleAnswerContentChange(event, answerId)}
                       InputProps={answerInputProps}/>
        </Grid>)
    }


    return (<FormControl component="fieldset" className={classes.formControl}>
        <Grid item xs={11} sm={11} md={11} className={classes.radioGroup}>
            <RadioGroup name="edit-answer-radio" value={answerRadioValue}
                        className={classes.radioGroup}
                        aria-label="edit-answer-radio-1"
                        onChange={(event) => setAnswerRadioValue(event.target.value)}>
                {answers.byId.map(renderAnswers)}
                {/*{renderAddNewAnswerInput()}*/}
            </RadioGroup>
            <Button onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>
        </Grid>
    </FormControl>);
}

