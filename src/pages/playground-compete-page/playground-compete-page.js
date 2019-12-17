import React, {useEffect, useState} from 'react';
import {
    Grid,
    makeStyles,
    Paper,
    useTheme,
    Toolbar,
    Typography,
    AppBar,
    Drawer,
    IconButton,
    Chip,
    Box,
    ButtonGroup,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    DialogContentText,
    DialogActions,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Slider,
    Snackbar
} from "@material-ui/core";
import clsx from "clsx";
import {Menu as MenuIcon, ChevronRight as ChevronRightIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getAnonymousContestById,
    getContestById, postAnonymousContestResult,
    postContest,
    postContestResult, setOpenAdminFullscreenDialog,
    updateCompetingContest,
    updateCompetingResult
} from "../../actions";
import {useHistory, useLocation} from 'react-router';
//import {Editor} from 'draft-js';
import Editor from 'draft-js-plugins-editor'
import {disabledStyleWrapper, msToTime} from "../../utils";
import QuizQuestion from "./quiz-question";
import produce from "immer";
import {addToNormalizedList, DefaultNormalizer, denormalizer} from "../../utils/byid-utils";
import Calculator from '../../components/calculator/component/App';
import {snackColors} from "../../consts/color";
import {COMPETING_CONTEST_STATE, QUESTION_TYPE_CODES, TEXT, QUESTION_STATE} from "../../consts";
import GradientIcon from '@material-ui/icons/Gradient';
import moment from 'moment';
import Countdown from 'react-countdown-now';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import RichEditor from 'components/rich-editor/rich-editor';
import {CountdownRenderer} from "../../components";
import CloseIcon from '@material-ui/icons/Close';
import EditingQuiz from "../../components/question-dialog/editing-quiz";
import EditingFillBlank from "../../components/question-dialog/editing-fill-blank";
import FillBlankQuestion from "./fill-blank-question";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginRight: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        paddingTop: theme.spacing(10)
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    paper: {
        padding: theme.spacing(3)
    },
    question: {
        marginTop: theme.spacing(3)
    },
    circleProgressWrapper: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    errorBackground: {
        backgroundColor: snackColors.error
    },
    successColor: {
        backgroundColor: snackColors.success
    },
    countDownContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row'
    },
    countDownBox: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(1)
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1
    },
    heading: {
        marginLeft: theme.spacing(1)
    },
    expansionDetail: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

function checkLength(testIds) {
    return testIds && testIds.length > 0;
}

function valuetext(value) {
    return `${value}°C`;
}


export default function PlaygroundCompetePage() {
    const classes = useStyles();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(true);
    const {competingContest} = useSelector(state => state.playgroundReducer) || {};
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const {
        duration, results, description,
        test: testByHash, answers: answersByHash, questions: questionByHash,
        testIds, name: contestName,
        ownerId, ownerName,
        hasFullAnswers,
        state,
        markedResults = {}
    } = competingContest;
    const {testRightAnswerIds, rightAnswerIds, fillBlankRightAnswers} = markedResults;
    const dispatch = useDispatch();
    const {state: locationState} = useLocation();
    const [questionsById, setQuestionsById] = useState([]);
    const [testName, setTestName] = useState('');
    const [isOpenResultDialog, setIsOpenResultDialog] = useState(false);
    const [endCountDown, setEndCountDown] = useState(true);
    const [expanded, setExpanded] = React.useState('panel1');
    const [durationCompetition, setDurationCompetition] = React.useState(0);
    const {contestId, isAnonymous, displayName} = locationState;
    const history = useHistory();
    const [firstDuration, setfirstDuration] = React.useState(0);
    const [alarm, setAlarm] = React.useState(0);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);

    };

    useEffect(() => {
        if (checkLength(testIds) && testByHash) {
            const {name, questions} = testByHash[testIds[0]] || {};
            name && setTestName(name);
            questions && setQuestionsById(questions);
            setDurationCompetition(competingContest.duration)
        }
    }, [testIds]);

    useEffect(() => {
        if (durationCompetition > 0) {
            setfirstDuration(Date.now() + durationCompetition);
        }
    }, [durationCompetition]);

    useEffect(() => {
        console.log('get contest id: ', contestId);
        if (isAnonymous) {
            dispatch(getAnonymousContestById(contestId));

        } else {
            dispatch(getContestById(contestId));
        }
    }, []);


    function handleAnswerChange(item, questionId) {
        dispatch(updateCompetingResult(item));
    }

    function handleNavigateToResultsPage() {
        console.log('navigate to results page');
        if (isAnonymous) {
            history.replaceState(null, TEXT.appName, '/');
        } else {
            history.goBack();
        }
        dispatch(setOpenAdminFullscreenDialog(false));
    }

    function handleSubmit() {
        if (checkLength(testIds)) {
            console.log('testIds', testIds);
            const reqResults = denormalizer(results);
            const params = {
                competitionId: contestId,
                testId: testIds[0],
                ownerId,
                displayName: ownerName,
                results: reqResults
            };
            setIsOpenResultDialog(true);
            if (isAnonymous) {
                dispatch(postAnonymousContestResult({...params, displayName: displayName}, hasFullAnswers));
            } else {
                dispatch(postContestResult(params, hasFullAnswers));
            }
        }
    }

    function generateQuestionState(questionId, answersById, type) {
        let questionState = QUESTION_STATE.NOT_SCORED;
        if (state !== COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER) {
            return {questionState};
        }
        if (type === QUESTION_TYPE_CODES.quiz) {
            let trueAnswer = '';
            if (rightAnswerIds && answersById) {
                let count = 0;
                answersById.every((item) => {
                    if (rightAnswerIds[item]) {
                        trueAnswer = item;
                        questionState = QUESTION_STATE.RIGHT;
                        return false;
                    }
                    count++;
                    return true;
                });
                if (count === answersById.length) {
                    questionState = QUESTION_STATE.WRONG;
                }
            }
            return {trueAnswer, questionState};
        }
        if (type === QUESTION_TYPE_CODES.fillBlank) {
            if (fillBlankRightAnswers) {
                if (!fillBlankRightAnswers.byHash) {
                    return {questionState};
                }
                const {rightAnswers = []} = fillBlankRightAnswers.byHash[questionId];
                const content = results.byHash[questionId] && results.byHash[questionId].content;
                if (!content) return {questionState: QUESTION_STATE.WRONG, rightAnswers};
                for (let i = 0; i < rightAnswers.length; i++) {
                    if (rightAnswers[i].content === content) {
                        console.log('get here: ', {questionState: QUESTION_STATE.RIGHT, rightAnswers});
                        return {questionState: QUESTION_STATE.RIGHT, rightAnswers};
                    }
                }
                console.log('get here: ', {questionState: QUESTION_STATE.WRONG, rightAnswers});
                return {questionState: QUESTION_STATE.WRONG, rightAnswers};
            }
        }
        return {questionState};
    }

    function renderQuestions() {
        return questionsById.map((questionId, index) => {
            const {answers: answersById, content, type} = questionByHash[questionId];
            const isResponseFullAnswer = COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER === state;
            let extraProps = {};
            if (isResponseFullAnswer) {
                extraProps = generateQuestionState(questionId, answersById, type);
            }
            let chipStyle = {};
            if (extraProps.questionState === QUESTION_STATE.RIGHT) {
                chipStyle = {backgroundColor: snackColors.success};
            } else if (extraProps.questionState === QUESTION_STATE.WRONG) {
                chipStyle = {backgroundColor: snackColors.error};
            }
            return (<Box key={questionId} className={classes.question}
                         style={disabledStyleWrapper(isResponseFullAnswer, {}, {opacity: 1})}>
                <Chip label={`Câu ${index + 1}`} style={chipStyle}/>
                <Typography variant="subtitle2" noWrap align='center'>
                    <RichEditor editorState={content} readOnly={true}/>
                </Typography>
                {renderQuestionByType(questionId, extraProps)}
            </Box>)
        });
    }

    function renderQuestionByType(questionId, extraProps) {
        const {answers: answersById, type: questionTypeCode} = questionByHash[questionId];
        switch (questionTypeCode) {
            case QUESTION_TYPE_CODES.quiz:
                return (<QuizQuestion {...extraProps}
                                      answersById={answersById} onAnswerChange={handleAnswerChange}
                                      question={questionByHash[questionId]}/>);
            case QUESTION_TYPE_CODES.essay:
                return <div/>;
            case QUESTION_TYPE_CODES.fillBlank:
                return <FillBlankQuestion {...extraProps}
                                          answersById={answersById} onAnswerChange={handleAnswerChange}
                                          question={questionByHash[questionId]}/>;
            case QUESTION_TYPE_CODES.matching:
                return <div/>;
            case QUESTION_TYPE_CODES.quizMulti:
                return <div/>;
        }

    }

    function renderCountDown(props) {
        return (<CountdownRenderer {...props}/>)
    }

    function handleOnTick(e) {
        if (e.total == alarm) {
            setOpenSnackBar(true)
        }
    }

    function renderStartContestButton() {

        if (durationCompetition > 0) {
            return (<Countdown onTick={handleOnTick} date={firstDuration} renderer={renderCountDown}/>);
        }
    }

    function handleOnReminderChange(event, newValue) {
        const newDuration = newValue * 60000;

        const vo = firstDuration - durationCompetition;
        setAlarm(firstDuration - (vo + newDuration))
    }

    function renderDrawerBlock() {
        const marks = [{value: 0, label: '0 phút'}, {
            value: durationCompetition / 60000,
            label: durationCompetition / 60000 + " phút"
        }];
        return (<React.Fragment>
            <Box>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}
                                           aria-controls="panel1a-content" id="panel1a-header">
                        <TimelapseIcon/><Typography className={classes.heading}>Thời gian còn lại</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansionDetail}>
                        {renderStartContestButton()}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1a-content"
                                           id="panel2a-header">
                        <AssignmentTurnedInIcon/><Typography className={classes.heading}>Các câu đã làm</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansionDetail}>
                        <Grid container wrap>
                            {questionsById.map((item, index) => {
                                const color = (results && results.byHash[item]) ? 'primary' : 'default';
                                return (
                                    <Button size='small' key={index.toString()} color={color}><b>{index}</b></Button>)
                            })}
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1a-content"
                                           id="panel3a-header">
                        <GradientIcon/><Typography className={classes.heading}>Máy tính</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails><Calculator/></ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1a-content"
                                           id="panel4a-header">
                        <AccessAlarmIcon/>
                        <Typography className={classes.heading}>Hẹn giờ</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Slider defaultValue={90} marks={marks} valueLabelDisplay="on" getAriaValueText={valuetext}
                                onChange={handleOnReminderChange}
                                aria-labelledby="discrete-slider-always" step={1} min={0}
                                max={durationCompetition / 60000}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Box>
        </React.Fragment>)
    }

    function renderSubmitResult() {
        if (state === COMPETING_CONTEST_STATE.SUBMIT) {
            return (<div className={classes.circleProgressWrapper}><CircularProgress/></div>);
        }
        return (
            <React.Fragment>
                <DialogContent>
                    <DialogContentText>Nộp bài thành công</DialogContentText>
                    {(state === COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER) &&
                    rightAnswerIds && testRightAnswerIds && <DialogContentText>Số câu trả lời
                        đúng: {Object.keys(rightAnswerIds).length}/{Object.keys(testRightAnswerIds).length}
                    </DialogContentText>}
                </DialogContent>
                <DialogActions>
                    {(state === COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER)
                    && <Button onClick={() => setIsOpenResultDialog(false)}
                               color="primary">{hasFullAnswers ? 'Xem đáp án' : 'Xem lại câu trả lời'}</Button>}
                    <Button onClick={handleNavigateToResultsPage} color="primary">Về trang kết quả thi</Button>
                </DialogActions>
            </React.Fragment>)
    }

    const durationArray = msToTime(duration);
    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: openDrawer})}>
                <Toolbar>
                    <Typography variant="h6" noWrap>{contestName}</Typography>
                    <Button color="secondary" variant="contained" onClick={handleSubmit}>Nộp bài</Button>
                    <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpenDrawer(true)}
                                edge="end" className={clsx(classes.menuButton, openDrawer && classes.hide)}>
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main className={clsx(classes.content, {[classes.contentShift]: openDrawer})}>
                <Box spacing={3}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" noWrap align='center'>{contestName}</Typography>
                        <Typography variant="h5" noWrap align='center'>{testName}</Typography>
                        <Typography variant="h6" noWrap align='center'>{description}</Typography>
                        <Typography variant="subtitle1" noWrap align='center'>Số câu: {questionsById.length} - Thời
                            gian làm bài: {durationArray[0]} giờ {durationArray[1]} phút</Typography>
                        {renderQuestions()}
                    </Paper>
                </Box>
            </main>
            <Drawer className={classes.drawer} variant="persistent" anchor="right"
                    open={openDrawer} classes={{paper: classes.drawerPaper}}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => setOpenDrawer(false)}>
                        <ChevronRightIcon/>
                    </IconButton>
                </div>
                <Divider/>
                {renderDrawerBlock()}
            </Drawer>

            <Dialog open={isOpenResultDialog}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nộp bài thi</DialogTitle>
                {renderSubmitResult()}
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openSnackBar}
                autoHideDuration={6000}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Note archived</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={() => setOpenSnackBar(false)}
                    >
                        <CloseIcon/>
                    </IconButton>,
                ]}
            />
        </div>
    )
}
