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
import {Close as CloseIcon, ModeComment as ModeCommentIcon} from "@material-ui/icons";
import produce from "immer";
import {
    addToNormalizedList,
    DefaultNormalizer,
    removeFromNormalizedList
} from "../../utils/byid-utils";
import PropTypes from 'prop-types';
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles(theme => ({
    formControl: {
        display: 'flex',
        flex: 1
    },
    textFieldContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: theme.spacing(1)
    },
    textField: {
        marginVertical: theme.spacing(1)
    },
    hintTitle: {
        marginTop: theme.spacing(3)
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


    function handleAddMoreAnswerClick() {
        const currentSmallestId = answers.byId.reduce((minKey, curKey) =>
            (parseInt(curKey) < 0 && parseInt(curKey) < minKey ? curKey : minKey), 0);

        onChange(produce(data, draftState => {
            if (!draftState.answers) {
                const newAnswers = new DefaultNormalizer();
                addToNormalizedList(newAnswers, {
                    id: currentSmallestId - 1,
                    content: `Đáp án ${answers.byId.length + 1}`,
                    isTrue: true
                });
                draftState.answers = newAnswers;
            } else {
                addToNormalizedList(draftState.answers, {
                    id: currentSmallestId - 1,
                    content: `Đáp án ${answers.byId.length + 1}`,
                    isTrue: true
                });
            }
        }));
    }

    function renderAnswers(answerId, index) {
        const {content} = answers.byHash[answerId];


        return (<Grid item key={answerId} className={classes.textFieldContainer}>
            <ModeCommentIcon color={'disabled'}/>
            <InputBase multiline value={content}
                       className={classes.inputBase}
                       fullWidth
                       variant="outlined"
                       onBlur={() => handleOnAnswerBlur(answerId, index)}
                       onChange={(event) => handleAnswerContentChange(event, answerId)}
            />
            <IconButton edge="end"
                        onClick={() => handleRemoveAnswerClick(answerId)}><CloseIcon/></IconButton>
        </Grid>)

    }


    return (<FormControl className={classes.formControl}>
        {/* <Typography variant="p" className={classes.hintTitle}>Thêm đáp án (nếu có)</Typography> */}
        {answers && answers.byId && answers.byId.map(renderAnswers)}
        <div>
            <Button color={"primary"} onClick={handleAddMoreAnswerClick}>{TEXT.addMoreAnswer}</Button>
        </div>
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


