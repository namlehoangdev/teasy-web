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
import {Editor} from 'draft-js';
import {msToTime} from "../../utils";
import QuizQuestion from "./quiz-question";
import produce from "immer";
import {addToNormalizedList, DefaultNormalizer} from "../../utils/byid-utils";
import Calculator from '../../components/calculator/component/App';

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

}));

function checkLength(testIds) {
    return testIds && testIds.length > 0;
}

export default function PlaygroundCompetePage() {
    const classes = useStyles();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(true);
    const {competingContest} = useSelector(state => state.playgroundReducer) || {};
    const {
        duration, results, description,
        test: testByHash, answers: answersByHash, questions: questionByHash,
        testIds, name: contestName,
        ownerId, ownerName
    } = competingContest;
    const dispatch = useDispatch();
    const {state: locationState} = useLocation();
    const [questionsById, setQuestionsById] = useState([]);
    const [testName, setTestName] = useState('');

    useEffect(() => {
        if (checkLength(testIds)) {
            const {name, questions} = testByHash[testIds[0]] || {};
            name && setTestName(name);
            questions && setQuestionsById(questions);
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
            dispatch(postContestResult(params));
        }
    }

    function renderQuestions() {
        return questionsById.map((questionId, index) => {
            const {answers: answersById, content} = questionByHash[questionId];
            return (<Box key={questionId} className={classes.question}>
                <Chip label={`Câu ${index + 1}`}/>
                <Typography variant="subtitle2" noWrap align='center'>
                    <b><Editor editorState={content} readOnly={true}/></b>
                </Typography>
                <QuizQuestion answersById={answersById} onAnswerChange={handleAnswerChange}
                              question={questionByHash[questionId]}/>
            </Box>)
        });
    }

    function renderDrawerBlock() {
        return (<React.Fragment>
            <Box>
                <Typography variant="subtitle1">Thời gian còn lại</Typography>
            </Box>
            <Divider/>
            <Box>
                <Typography variant="subtitle1">Các câu đã làm</Typography>
                <Grid container wrap>
                    {questionsById.map((item, index) => {
                        const color = (results && results.byHash[item]) ? 'primary' : 'default';
                        return (
                            <Button size='small' key={item} color={color}>
                                <b>{index}</b>
                            </Button>)
                    })}
                </Grid>
                <Calculator></Calculator>
            </Box>
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
        </div>
    )
}
