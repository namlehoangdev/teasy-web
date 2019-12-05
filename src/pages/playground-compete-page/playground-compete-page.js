import React, {useEffect, useState} from 'react';
import {
    Container,
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
    Box, RadioGroup, FormControlLabel, Radio, TextField
} from "@material-ui/core";
import clsx from "clsx";
import {Folder as FolderIcon, Menu as MenuIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getContestById,
    getPublicContests, getSharedContests, updateAllContestById, updateAllContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import {useParams, useHistory, useLocation, useRouteMatch} from 'react-router';
import {TEXT} from "../../consts";
import {Editor} from 'draft-js';
import {msToTime} from "../../utils";

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
        marginLeft: drawerWidth,
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
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        paddingTop: theme.spacing(10)
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    paper: {
        padding: theme.spacing(3)
    },
    question: {
        marginTop: theme.spacing(3)
    },
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
}));

function checkLength(testIds) {
    return testIds && testIds.length > 0;
}

export default function PlaygroundCompetePage() {
    const classes = useStyles();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const {competingContest} = useSelector(state => state.playgroundReducer) || {};
    const {duration, questions: questionByHash, test: testByHash, answers: answersByHash, testIds, name: contestName, description} = competingContest;
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


    function renderAnswerBlock() {
        return 'answers';
        return null;
    }

    function renderAnswers(answerKey, index) {
        const {content, isTrue} = answersByHash[answerKey];
        const answerCharacter = String.fromCharCode(65 + index);
        return (<Grid item key={answerKey} className={classes.answerContainer}>
            <FormControlLabel value={answerKey} control={<Radio className={classes.radio}/>} label=''/>
            <Typography><b>{answerCharacter}.</b> {content}</Typography>
        </Grid>);

    }

    function handleRadioChange(event) {
        console.log('event: ', event.target.value);
    }

    function renderQuestions() {
        return questionsById.map((questionId, index) => {
            const {answers: answersById, content} = questionByHash[questionId];
            return (<Box key={questionId} className={classes.question}>
                <Chip label={`Câu ${index + 1}`}/>
                <Typography variant="subtitle2" noWrap align='center'>
                    <b><Editor editorState={content} readOnly={true}/></b>
                </Typography>
                <RadioGroup name="edit-answer-radio" value={0}
                            className={classes.radioGroup}
                            aria-label="edit-answer-radio-1"
                            onChange={handleRadioChange}>
                    {answersById.map(renderAnswers)}
                </RadioGroup>
            </Box>)
        });
    }

    const durationArray = msToTime(duration);
    return (<div className={classes.root}>
        <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: openDrawer})}>
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpenDrawer(true)}
                            edge="start" className={clsx(classes.menuButton, openDrawer && classes.hide)}>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap>Persistent drawer</Typography>
            </Toolbar>
        </AppBar>
        <Drawer className={classes.drawer} variant="persistent" anchor="left"
                open={openDrawer} classes={{paper: classes.drawerPaper}}>
            {renderAnswerBlock()}
        </Drawer>
        <main className={clsx(classes.content, {[classes.contentShift]: openDrawer})}>
            <Grid container spacing={3}>
                <Grid item spacing={3} xs={12} sm={12} md={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" noWrap align='center'>{contestName}</Typography>
                        <Typography variant="h5" noWrap align='center'>{testName}</Typography>
                        <Typography variant="h6" noWrap align='center'>{description}</Typography>
                        <Typography variant="subtitle1" noWrap align='center'>Số câu: {questionsById.length} - Thời gian
                            làm bài: {durationArray[0]} giờ {durationArray[1]} phút</Typography>
                        {renderQuestions()}
                    </Paper>
                </Grid>
            </Grid>
        </main>
    </div>)
}
