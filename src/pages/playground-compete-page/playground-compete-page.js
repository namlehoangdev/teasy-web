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
    Slider
} from "@material-ui/core";
import clsx from "clsx";
import {Menu as MenuIcon, ChevronRight as ChevronRightIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getContestById,
    postContest,
    postContestResult,
    updateCompetingContest,
    updateCompetingResult
} from "../../actions";
import {useLocation} from 'react-router';
//import {Editor} from 'draft-js';
import Editor from 'draft-js-plugins-editor'
import {disabledStyleWrapper, msToTime} from "../../utils";
import QuizQuestion from "./quiz-question";
import produce from "immer";
import {addToNormalizedList, DefaultNormalizer, denormalizer} from "../../utils/byid-utils";
import Calculator from '../../components/calculator/component/App';
import {snackColors} from "../../consts/color";
import {COMPETING_CONTEST_STATE} from "../../consts";
import GradientIcon from '@material-ui/icons/Gradient';
import moment from 'moment';
import Countdown from 'react-countdown-now';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import RichEditor from 'components/rich-editor/rich-editor';


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
        margin:theme.spacing(1)
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1
    },
    heading:{
      marginLeft: theme.spacing(1)
    },
    expansionDetail:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
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
    const {testRightAnswerIds, rightAnswerIds} = markedResults;
    const dispatch = useDispatch();
    const {state: locationState} = useLocation();
    const [questionsById, setQuestionsById] = useState([]);
    const [testName, setTestName] = useState('');
    const [isOpenResultDialog, setIsOpenResultDialog] = useState(false);
    const [endCountDown, setEndCountDown] = useState(true);
    const [expanded, setExpanded] = React.useState('panel1');
    const [durationCompetition, setDurationCompetition] = React.useState(0);

    const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);

  };

    useEffect(() => {
        if (checkLength(testIds)) {
            const {name, questions} = testByHash[testIds[0]] || {};
            name && setTestName(name);
            questions && setQuestionsById(questions);
            setDurationCompetition(competingContest.duration)
        }
    }, [testIds]);


    useEffect(() => {
        const {contestId} = locationState;
        console.log('get contest id: ', contestId);
        dispatch(getContestById(contestId));
    }, []);


    function handleAnswerChange(item, questionId) {
        dispatch(updateCompetingResult(item));
    }

    function handleNavigateToResultsPage() {
        console.log('navigate to results page');
    }

    function handleSubmit() {
        console.log('handle submit: ');
        const {contestId} = locationState;
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
            dispatch(postContestResult(params, hasFullAnswers));
        }
    }

    function renderQuestions() {
        return questionsById.map((questionId, index) => {
            const {answers: answersById, content} = questionByHash[questionId];
            const isResponseFullAnswer = COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER === state;
            let questionType = 0;
            let count = 0;
            let trueAnswer = '';
            if (isResponseFullAnswer) {
                answersById.every((item) => {
                    if (rightAnswerIds[item]) {
                        trueAnswer = item;
                        questionType = 1;

                        return false;
                    }
                    count++;
                    return true;
                });
                if (count === answersById.length) {
                    questionType = -1;
                }
            }
            let chipStyle = {};
            let chipText = '';
            switch (questionType) {
                case 1: {
                    chipStyle = {backgroundColor: snackColors.success};
                    chipText = 'Đúng';
                    break;
                }
                case -1: {
                    chipStyle = {backgroundColor: snackColors.error};
                    chipText = 'Sai';
                    break;
                }
            }
            return (<Box key={questionId} className={classes.question}
                         style={disabledStyleWrapper(isResponseFullAnswer, {}, {opacity: 1})}>
                <Chip label={`Câu ${index + 1}`} style={chipStyle}/>
                <Typography variant="subtitle2" noWrap align='center'>
                    <RichEditor editorState={content} readOnly={true}/>
                </Typography>
                <QuizQuestion answersById={answersById} onAnswerChange={handleAnswerChange}
                              trueAnswer={trueAnswer}
                              question={questionByHash[questionId]}/>
            </Box>)
        });
    }

    function renderCountDown({total, days, hours, minutes, seconds}) {
        return (
            <div className={classes.countDownContainer}>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{hours}</span>
                    <span className={classes.labelCountDown}>giờ</span>
                </div>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{minutes}</span>
                    <span className={classes.labelCountDown}>phút</span>
                </div>
                <div className={classes.countDownBox}>
                    <span className={classes.numberCountDown}>{seconds}</span>
                    <span className={classes.labelCountDown}>giây</span>
                </div>
            </div>
        )
    }

    function renderStartContestButton() {

        if (durationCompetition > 0) {
            return (<Countdown date={Date.now() + durationCompetition} renderer={renderCountDown}/>);
        }
    }

    function renderDrawerBlock() {
        const marks = [
            {
              value: 0,
              label: '0 phút',
            },
            {
              value: durationCompetition/60000,
              label: durationCompetition/60000 + " phút",
            },
          ];
        return (<React.Fragment>
            <Box>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <TimelapseIcon></TimelapseIcon>
                    <Typography className={classes.heading}>Thời gian còn lại</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.expansionDetail}>
                    {renderStartContestButton()}
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <AssignmentTurnedInIcon></AssignmentTurnedInIcon>
                      <Typography className={classes.heading}>Các câu đã làm</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansionDetail}>
                    <Grid container wrap>
                      {questionsById.map((item, index) => {
                          const color = (results && results.byHash[item]) ? 'primary' : 'default';
                          return (
                              <Button size='small' key={item} color={color}>
                                  <b>{index}</b>
                              </Button>)
                      })}
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <GradientIcon></GradientIcon>
                    <Typography className={classes.heading}>Máy tính</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Calculator></Calculator>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                 <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <AccessAlarmIcon></AccessAlarmIcon>
                    <Typography className={classes.heading}>Hẹn giờ</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Slider
                        defaultValue={90}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-always"
                        step={10}
                        marks={marks}
                        valueLabelDisplay="on"
                        min={0}
                        max={durationCompetition/60000}
                      />
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
                    <DialogContentText>Số câu trả lời
                        đúng: {Object.keys(rightAnswerIds).length}/{Object.keys(testRightAnswerIds).length}</DialogContentText>}
                </DialogContent>
                <DialogActions>
                    {(state === COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER)
                    && <Button onClick={() => setIsOpenResultDialog(false)} color="primary">Xem đáp án</Button>}
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
                <Grid container spacing={3}>
                    <Grid item spacing={3} xs={12} sm={12} md={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" noWrap align='center'>{contestName}</Typography>
                            <Typography variant="h5" noWrap align='center'>{testName}</Typography>
                            <Typography variant="h6" noWrap align='center'>{description}</Typography>
                            <Typography variant="subtitle1" noWrap align='center'>Số câu: {questionsById.length} - Thời
                                gian
                                làm bài: {durationArray[0]} giờ {durationArray[1]} phút</Typography>
                            {renderQuestions()}
                        </Paper>
                    </Grid>
                </Grid>
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
