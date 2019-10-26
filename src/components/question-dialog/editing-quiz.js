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
    IconButton
} from "@material-ui/core";
import {TEXT} from "../../consts/text-consts";
import {useDispatch, useSelector} from "react-redux";
import {updateEditingQuestion} from "../../actions";
import {Close as CloseIcon, Done as DoneIcon} from "@material-ui/icons";
import produce from "immer";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(3),
    },
}));


export default function EditingQuiz() {
    const dispatch = useDispatch();
    const {editingQuestion} = useSelector(state => state.adminReducer);
    const {answers = []} = editingQuestion;
    const {answerRadioValue, setAnswerRadioValue} = useState('');
    const {showAddAnswerInput, setShowAddAnswerInput} = useState(false);
    const {newAnswer, setNewAnswer} = useState({id: 0, content: ''});

    const classes = useStyles();


    function handleAnswerContentChange(event, currentAnswer) {
        const newAnswers = produce(answers, draft => {
            draft.forEach(item => {
                if (item.id === currentAnswer.id) {
                    item.content = event.target.value;
                }
            })
        });
        dispatch(updateEditingQuestion({...editingQuestion, answers: newAnswers}));
    }

    function handleAddMoreAnswerClick() {
        setShowAddAnswerInput(true);
        let smallestId = answers.reduce((minKey, currentValue) =>
            (parseInt(currentValue) < 0 && parseInt(currentValue) < minKey ? currentValue : minKey), 0);
        setNewAnswer({...newAnswer, id: smallestId - 1});
    }

    function renderAnswers(item) {
        const {id, content} = item;
        return (<div key={id}>
            <FormControlLabel value={id} control={<Radio/>} label=''/>
            <TextField multiline value={content} onChange={(event) => handleAnswerContentChange(event, item)}/>
        </div>)
    }


    return (
        <div>
            <FormControl component="fieldset" className={classes.formControl}>
                <RadioGroup aria-label="gender" name="gender1" value={answerRadioValue}
                            onChange={(event) => setAnswerRadioValue(event.target.value)}>
                    {answers.map(renderAnswers)}
                </RadioGroup>
                {showAddAnswerInput && (<div>
                    <FormControlLabel value={newAnswer.id} control={<Radio/>} label=''/>
                    <TextField multilines
                               placeholder={TEXT.addMoreAnswer}
                               value={newAnswer.content}
                               onChange={(event) => setNewAnswer({...newAnswer, id: event.target.value})}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <IconButton edge="end" onClick={() => setShowAddAnswerInput(false)}>
                                               <DoneIcon/>
                                           </IconButton>
                                           <IconButton edge="end" onClick={() => setShowAddAnswerInput(false)}>
                                               <CloseIcon/>
                                           </IconButton>
                                       </InputAdornment>
                                   ),
                               }}
                    />
                    <IconButton aria-label="delete" className={classes.margin} size="small">
                        <ArrowDownwardIcon fontSize="inherit"/>
                    </IconButton>
                </div>)}
                <Button onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>
            </FormControl>
        </div>
    );
}

