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
    IconButton, Grid, Typography
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
    textField: {
        margin: theme.spacing(1)
    },
}));


export default function EditingFillBlank(props) {
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
                addToNormalizedList(newAnswers, {id: currentSmallestId - 1, content: '', isTrue: true});
                draftState.answers = newAnswers;
            } else {
                addToNormalizedList(draftState.answers, {id: currentSmallestId - 1, content: '', isTrue: true});
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

        return (<TextField multiline value={content}
                           className={classes.textField}
                           fullWidth
                           variant="outlined"
                           onChange={(event) => handleAnswerContentChange(event, answerId)}
                           InputProps={answerInputProps}/>)
    }


    return (<FormControl className={classes.formControl}>
        <Typography variant="h6" className={classes.title}>Các đáp án đúng (vui lòng kiểm tra khoảng trắng)</Typography>
        {answers && answers.byId && answers.byId.map(renderAnswers)}
        <Button onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>
    </FormControl>);
}

EditingFillBlank.propTypes = {
    data: PropTypes.any,
    onChange: PropTypes.func,
};

EditingFillBlank.defaultProps = {
    onChange: () => {
    }
};


