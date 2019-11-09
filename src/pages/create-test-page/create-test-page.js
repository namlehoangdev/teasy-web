import React, {useState} from 'react';
import './create-test-page.scss'
import {
    AppBar,
    Button,
    IconButton,
    makeStyles,
    Input,
    Toolbar,
    Typography,
    Grid,
    Paper,
    Popper,
    Fade, Box
} from "@material-ui/core";
import {Close as CloseIcon} from "@material-ui/icons";
import {QUESTION_TYPE_CODES, QUESTION_TYPE_TEXT, TEXT} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {setOpenAdminFullscreenDialog, updateEditingTest} from "../../actions";
import {addToNormalizedList, DefaultNormalizer} from "../../utils/byid-utils";
import EditingQuestionContent from "../../components/question-dialog/editing-question-content";
import produce from 'immer';
import {EditorState} from "draft-js";


const useStyles = makeStyles(theme => ({
    appBar: {position: 'relative',},
    title: {marginLeft: theme.spacing(2), flex: 1},
    testTitle: {...theme.typography.h5, marginBottom: theme.spacing(2)},
    description: {...theme.typography.h6, marginBottom: theme.spacing(2)},
    contentContainer: {padding: theme.spacing(2)},
    paper: {padding: theme.spacing(2)},
    addNewButton: {alignSelf: 'flex-end'},
}));

export default function CreateTestPage() {
    const {editingTest} = useSelector(state => state.adminReducer);
    const {questions = new DefaultNormalizer()} = editingTest;
    const [addNewAnchorEl, setAddNewAnchorEl] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    function handleClose() {
        history.goBack();
        dispatch(setOpenAdminFullscreenDialog(false));
    }

    function handleSave() {
        
    }

    function handleQuestionChange(questionId, data) {
        dispatch(updateEditingTest({
            questions: produce(questions, draft => {
                draft.byHash[questionId] = {...draft.byHash[questionId], ...data};
            })
        }))
    }

    function renderCreatingTests(questionId) {
        return (
            <Grid item xs={12} sm={12} md={12}>
                <Paper key={questionId} className={classes.paper}>
                    <EditingQuestionContent data={questions.byHash[questionId]}
                                            onChange={(data) => handleQuestionChange(questionId, data)}/>
                </Paper>
            </Grid>)
    }

    function handleAddNewQuestionButtonClick(event) {
        setAddNewAnchorEl(event.currentTarget);
    }

    function handlePopperItemClick(questionTypeCode) {
        setAddNewAnchorEl(null);
        const currentSmallestId = questions.byId.reduce((minKey, curKey) =>
            (parseInt(curKey) < 0 && parseInt(curKey) < minKey ? curKey : minKey), 0);
        dispatch(updateEditingTest({
            questions: produce(questions, draft => {
                if (!draft) {
                    const newQuestion = new DefaultNormalizer();
                    addToNormalizedList(newQuestion, {
                        id: currentSmallestId - 1,
                        content: EditorState.createEmpty(),
                        type: questionTypeCode
                    });
                } else {
                    addToNormalizedList(draft, {
                        id: currentSmallestId - 1,
                        content: EditorState.createEmpty(),
                        type: questionTypeCode
                    });
                }
            })
        }));
    }

    function renderQuestionTypeMenu(questionTypeCode) {
        return (<Typography className={classes.typography}
                            onClick={handlePopperItemClick}>{QUESTION_TYPE_TEXT[questionTypeCode]}</Typography>)
    }

    const openAddNewPopper = Boolean(addNewAnchorEl);
    const addNewPopperId = openAddNewPopper ? 'transitions-popper' : undefined;

    return (<div>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>{`${TEXT.create} ${TEXT.test}`}</Typography>
                <Button color="inherit" onClick={handleSave}>{TEXT.save}</Button>
            </Toolbar>
        </AppBar>
        <Grid container className={classes.contentContainer}>
            <Grid item xs={12} sm={12} md={12}>
                <Input
                    placeholder="Điền đề thi"
                    fullWidth
                    className={classes.testTitle}
                    inputProps={{
                        'aria-label': 'description',
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <Input
                    placeholder="Điền mô tả"
                    fullWidth
                    multiline
                    disableUnderline
                    classes={classes.description}
                    inputProps={{
                        'aria-label': 'description',
                    }}
                />
            </Grid>
            <Box m={2}/>
            {questions.byId.map(renderCreatingTests)}
            <Grid item xs={12} sm={12} md={12}>
                <Button className={classes.addNewButton}
                        variant='outlined'
                        color='primary' onClick={handleAddNewQuestionButtonClick}>Thêm câu hỏi</Button>
            </Grid>
        </Grid>
        <Popper id={addNewPopperId} open={openAddNewPopper} anchorEl={addNewAnchorEl} placement='top-end' transition
                style={{zIndex: 40000}}>
            {({TransitionProps}) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        {Object.values(QUESTION_TYPE_CODES).map(renderQuestionTypeMenu)}
                    </Paper>
                </Fade>
            )}
        </Popper>
    </div>);
}
