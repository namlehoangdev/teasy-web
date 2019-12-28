import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import scrollToComponent from 'react-scroll-to-component';
import {useDispatch, useSelector} from "react-redux";
import {
    clearCompetingContest, postAnonymousContestResult,
    postContestResult, setOpenAdminFullscreenDialog,
    updateCompetingResult
} from "../../actions";
import {useHistory, useLocation} from 'react-router';

import {disabledStyleWrapper, msToTime} from "../../utils";
import QuizQuestion from "./quiz-question";
import {denormalizer} from "../../utils/byid-utils";
import Calculator from '../../components/calculator/component/App';
import {snackColors} from "../../consts/color";
import {COMPETING_CONTEST_STATE, QUESTION_TYPE_CODES, TEXT, QUESTION_STATE} from "../../consts";
import GradientIcon from '@material-ui/icons/Gradient';
import Countdown from 'react-countdown-now';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import RichEditor from 'components/rich-editor/rich-editor';
import {CountdownRenderer} from "../../components";
import CloseIcon from '@material-ui/icons/Close';
import FillBlankQuestion from "./fill-blank-question";
import moment from 'moment'
import { useSnackbar } from 'notistack';

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
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        alignSelf: 'flex-end',
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    paper: {
        padding: theme.spacing(3)
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
        transition: theme.transitions.create(['margin,width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: '90vw',
        marginRight: -drawerWidth,
        paddingTop: theme.spacing(10),
        alignSelf: 'center',
        marginLeft: '2vw'
    },
    contentShift: {
        transition: theme.transitions.create(['margin,width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        width: `calc(90vw - ${drawerWidth}px)`,

        marginRight: 0,
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
    },
    divider: {
        marginTop: theme.spacing(3)
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom:theme.spacing(1)
    }
}));

function checkLength(testIds) {
    return testIds && testIds.length > 0;
}

function valuetext(value) {
    return `${value}°C`;
}


const scrollToRef = (ref) => window.scrollTo(0, ref.offsetTop);

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
        markedResults = {},
        startAt
    } = competingContest;
    const {testRightAnswerIds, rightAnswerIds, fillBlankRightAnswers} = markedResults;
    const dispatch = useDispatch();
    const {state: locationState} = useLocation();
    const [questionsById, setQuestionsById] = useState([]);
    const [testName, setTestName] = useState('');
    const [difff, setDifff] = useState(0);
    const [isOpenResultDialog, setIsOpenResultDialog] = useState(false);
    const [expanded, setExpanded] = React.useState('panel1');
    const [durationCompetition, setDurationCompetition] = React.useState(0);
    const {contestId, isAnonymous, displayName} = locationState;
    const history = useHistory();
    const [firstDuration, setfirstDuration] = React.useState(0);
    const [alarm, setAlarm] = React.useState(0);
    let questionRefs = useRef(new Map);
    const questionContainerRef = useRef(null);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const action = key => (
    <>
        <Button color='disabled' onClick={() => { closeSnackbar(key) }}>
            X
        </Button>
    </>
);


    useMemo(() => {
        console.log('vao day');
        if (checkLength(testIds) && testByHash) {
            // console.log('vao day 2', testByHash);
            // console.log('testIds', testIds);
            const {name, questions} = testByHash[Object.keys(testByHash)[0]] || {};
            name && setTestName(name);
            questions && setQuestionsById(questions);
            console.log('questions: ', questions);
            if(moment(startAt).year() === 1){
               setDurationCompetition(competingContest.duration)
            }
            else{
              const diff = moment.utc().diff(moment(startAt), "ms");
              setDifff(diff)
              setDurationCompetition(competingContest.duration - diff)
            }
        }
    }, [testIds]);


    useEffect(() => {
        return () => {
            dispatch(clearCompetingContest());
        }
    }, []);

    useEffect(() => {
        if (durationCompetition > 0) {
            setfirstDuration(Date.now() + durationCompetition);
        }
    }, [durationCompetition]);


    function handleAnswerChange(item, questionId) {
        dispatch(updateCompetingResult(item));
    }

    function handleNavigateToResultsPage() {
        console.log('navigate to results page');
        if (isAnonymous) {
            history.replace("/");
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
        return questionsById && questionsById.map((questionId, index) => {
            const {answers: answersById, content, type} = questionByHash[questionId];
            const isResponseFullAnswer = COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER === state;
            let extraProps = {};
            if (isResponseFullAnswer) {
                extraProps = generateQuestionState(questionId, answersById, type);
            }
            let chipStyle = {marginTop: 10};
            if (extraProps.questionState === QUESTION_STATE.RIGHT) {
                chipStyle = {backgroundColor: snackColors.success, marginTop: 10};
            } else if (extraProps.questionState === QUESTION_STATE.WRONG) {
                chipStyle = {backgroundColor: snackColors.error, marginTop: 10};
            }

            return (
                <div key={questionId}
                     ref={inst => inst === null ? questionRefs.current.delete(questionId) : questionRefs.current.set(questionId, inst)}>
                    <Box key={questionId} className={classes.question}
                         style={disabledStyleWrapper(isResponseFullAnswer, {}, {opacity: 1})}>
                        <Chip label={`Câu ${index + 1}`} style={chipStyle}/>
                        <RichEditor editorState={content} readOnly={true}/>
                        {renderQuestionByType(questionId, extraProps)}
                        <Divider className={classes.divider} variant="middle"/>
                    </Box>
                </div>)
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
                   enqueueSnackbar('Nhắc hẹn kết thúc', {variant: 'success', autoHideDuration:30000, action});
        }
    }

    function handleNavigateToQuestion(id) {
        console.log('handleNavigateToQuestion', id);
        console.log('ref: ', questionRefs);
        console.log('ref ele: ', questionRefs.current.get(id));
        scrollToComponent(questionRefs.current.get(id), {offset: -90, align: 'top', duration: 10})
        //scrollToRef(questionRefs.current.get(id))
        //questionContainerRef.current.getScrollableNode().children[0].scrollTop = questionRefs.current.get(id).offsetTop;
        //window.scrollTo(0, questionContainerRef.current.offsetTop);
        //console.log('questionContainerRef: ', questionContainerRef);
    }

    function renderStartContestButton() {
        if (durationCompetition > 0) {
            return (<Countdown onTick={handleOnTick} date={firstDuration} renderer={renderCountDown}/>);
        }
    }

    function handleOnReminderChange(event, newValue) {
        const newDuration = newValue * 60000;

        const vo = firstDuration - durationCompetition - difff;
        setAlarm(firstDuration - (vo + newDuration))
    }

    function renderDrawerBlock() {
        const marks = [{value: 0, label: '0 phút'}, {
            value: (durationCompetition + difff) / 60000,
            label: (durationCompetition + difff) / 60000 + " phút"
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
                                           id="panel4a-header">
                        <AccessAlarmIcon/>
                        <Typography className={classes.heading}>Hẹn giờ</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Slider defaultValue={90} marks={marks} valueLabelDisplay="on" getAriaValueText={valuetext}
                                onChange={handleOnReminderChange}
                                aria-labelledby="discrete-slider-always" step={1} min={0}
                                max={(durationCompetition+difff) / 60000}/>
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
                                    <Button
                                        onClick={() => handleNavigateToQuestion(item)}
                                        size='small' key={index.toString()} color={color}><b>{index + 1}</b></Button>)
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
            </Box>
        </React.Fragment>)
    }

    function renderSubmitResult() {
        if (state === COMPETING_CONTEST_STATE.SUBMIT) {
            return (<div className={classes.center}><CircularProgress className={classes.center}/></div>);
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
                    <Button color="secondary" variant="contained" edge="end"
                            style={{marginLeft: 'auto'}}
                            onClick={handleSubmit}>Nộp bài</Button>
                    <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpenDrawer(true)}
                                edge="end" className={clsx(classes.menuButton, openDrawer && classes.hide)}>
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main className={clsx(classes.content, {[classes.contentShift]: openDrawer})}>
                <Box spacing={3}>
                    <Paper ref={questionContainerRef} className={classes.paper} elevation={3}>
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
        </div>
    )
}
