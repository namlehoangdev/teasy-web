import React, {useState, useEffect} from "react";
import _ from 'lodash';
import "./create-test-page.scss";
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
    Fade,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@material-ui/core";
import {Close as CloseIcon} from "@material-ui/icons";
import {
    COMPETING_CONTEST_STATE,
    QUESTION_TYPE_CODES,
    QUESTION_TYPE_TEXT,
    TEXT
} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {
    getOwnQuestions,
    openCreateQuestionDialog,
    postTest,
    putTest,
    setOpenAdminFullscreenDialog,
    updateEditingTest
} from "../../actions";
import {
    addToNormalizedList,
    DefaultNormalizer,
    removeFromNormalizedList
} from "../../utils/byid-utils";
import EditingQuestionContent from "../../components/question-dialog/editing-question-content";
import produce from "immer";
import {EditorState} from "draft-js";
import {disabledStyleWrapper} from "../../utils";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChooseTestDialog from "../create-contest-page/choose-tests-dialog";
import ChooseQuestionDialog from "./choose-questions-dialog";

const useStyles = makeStyles(theme => ({
    appBar: {position: "relative"},
    title: {marginLeft: theme.spacing(2), flex: 1},
    testTitle: {...theme.typography.h5, marginBottom: theme.spacing(2)},
    description: {...theme.typography.h6, marginBottom: theme.spacing(2)},
    contentContainer: {padding: theme.spacing(2)},
    paper: {padding: theme.spacing(2)},
    addNewButton: {alignSelf: "flex-end", marginRight: theme.spacing(1), marginTop: theme.spacing(2)}
}));

export default function CreateTestPage() {
    const {editingTest, questions: questionsFromBank} = useSelector(state => state.adminReducer);
    const {profile} = useSelector(state => state.authReducer);
    const {id: ownerId, name: ownerName} = profile;
    const {
        id: testId,
        questions = new DefaultNormalizer(),
        name = ""
    } = editingTest;
    const [alertText, setAlertText] = useState('');
    const [addNewAnchorEl, setAddNewAnchorEl] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isOpenSelectQuestion, setOpenSelectQuestion] = useState(false);
    const [isCallLoadQuestions, setIsCallLoadQuestion] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    function handleClose() {
        history.goBack();
        dispatch(setOpenAdminFullscreenDialog(false));
    }

    function onSaveSuccess() {
        setIsSaved(true);
        setIsOpenDialog(true);
    }

    function handleSave() {
        if (!name || name.length === 0) {
            setAlertText('Vui lòng điền tên đề thi');
            return;
        }
        if (!questions || questions.byId.length === 0) {
            setAlertText('Đề thi phải có ít nhất 1 câu hỏi');
            return;
        }
        setAlertText('');
        setIsOpenDialog(true);
        if (testId) {
            dispatch(putTest({...editingTest, ownerId, ownerName}, onSaveSuccess));
        } else {
            dispatch(postTest({...editingTest, ownerId, ownerName}, onSaveSuccess));
        }
    }

    function handleQuestionChange(questionId, data) {
        dispatch(
            updateEditingTest({
                questions: produce(questions, draft => {
                    draft.byHash[questionId] = {...draft.byHash[questionId], ...data};
                })
            })
        );
    }

    function handleRemoveQuestion(id) {
        dispatch(
            updateEditingTest({
                questions: produce(questions, draft => {
                    removeFromNormalizedList(draft, id);
                })
            })
        );
    }

    function renderCreatingQuestions(questionId) {
        return (
            <Grid item xs={12} sm={12} md={12}>
                <Paper elevation={3} key={questionId} className={classes.paper}>
                    <EditingQuestionContent
                        data={questions.byHash[questionId]}
                        onRemove={handleRemoveQuestion}
                        onChange={data => handleQuestionChange(questionId, data)}
                    />
                </Paper>
            </Grid>
        );
    }

    function handleAddNewQuestionButtonClick(event) {
        setAddNewAnchorEl(event.currentTarget);
    }

    function handleAddQuestionFromBankClick(event) {
        setOpenSelectQuestion(true);
        if (isCallLoadQuestions || (questionsFromBank && questionsFromBank.byId && questionsFromBank.byId.length > 0)) {
            return;
        }
        dispatch(getOwnQuestions());
        setIsCallLoadQuestion(true);
    }

    function handleTestNameChange(event) {
        dispatch(updateEditingTest({name: event.target.value}));
    }

    function addQuestion(newQuestion) {
        const currentSmallestId = questions.byId.reduce(
            (minKey, curKey) =>
                parseInt(curKey) < 0 && parseInt(curKey) < minKey ? curKey : minKey,
            0
        );
        const temp = {...newQuestion, id: currentSmallestId - 1};
        dispatch(
            updateEditingTest({
                questions: produce(questions, draft => {
                    if (!draft) {
                        const newQuestion = new DefaultNormalizer();
                        addToNormalizedList(newQuestion, temp);
                        draft = newQuestion
                    } else {
                        addToNormalizedList(draft, temp);
                    }
                })
            })
        );
    }

    function handlePopperItemClick(questionTypeCode) {
        setAddNewAnchorEl(null);
        addQuestion({
            content: EditorState.createEmpty(),
            type: questionTypeCode
        })
    }

    function renderQuestionTypeMenu(questionTypeCode) {
        return (
            <Typography
                className={classes.typography}
                onClick={() => handlePopperItemClick(questionTypeCode)}
            >
                {QUESTION_TYPE_TEXT[questionTypeCode]}
            </Typography>
        );
    }


    function handleCloseChooseQuestionDialog(newSelected) {
        newSelected && newSelected.forEach(selectedId => {
            if (questionsFromBank.byHash[selectedId]) {
                addQuestion({...questionsFromBank.byHash[selectedId]})
            }
        });
        setOpenSelectQuestion(false);
    }


    const openAddNewPopper = Boolean(addNewAnchorEl);
    const addNewPopperId = openAddNewPopper ? "transitions-popper" : undefined;
    const selectedQuestionIds = _.get(editingTest, "questions.byId", []);

    return (
        <div>
            <ChooseQuestionDialog
                open={isOpenSelectQuestion}
                questions={questionsFromBank}
                handleClose={handleCloseChooseQuestionDialog}
                selectedQuestionIds={selectedQuestionIds}

            />
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>{`${
                        testId ? TEXT.edit : TEXT.create
                    } ${TEXT.test}`}</Typography>
                    {!isSaved && (
                        <Button color="inherit" onClick={handleSave}>
                            {TEXT.save}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Grid
                container
                className={classes.contentContainer}
                style={disabledStyleWrapper(
                    isSaved,
                    {},
                    {opacity: isShowCircleLoading ? 0 : 1}
                )}
            >
                <Grid item xs={12} sm={12} md={12}>
                    <Input
                        placeholder="Nhập tên đề thi"
                        fullWidth
                        className={classes.testTitle}
                        onChange={handleTestNameChange}
                        value={name || ""}
                        inputProps={{"aria-label": "description"}}
                    />
                </Grid>
                <Box m={2}/>
                {questions.byId.map(renderCreatingQuestions)}
                <Grid item xs={12} sm={12} md={12}>
                    <Button
                        className={classes.addNewButton}
                        variant="outlined"
                        color="primary"
                        onClick={handleAddNewQuestionButtonClick}
                    >
                        Thêm câu hỏi
                    </Button>
                    <Button
                        className={classes.addNewButton}
                        variant="outlined"
                        color="primary"
                        onClick={handleAddQuestionFromBankClick}
                    >
                        Thêm câu hỏi từ kho
                    </Button>
                </Grid>
            </Grid>
            <Popper
                id={addNewPopperId}
                open={openAddNewPopper}
                anchorEl={addNewAnchorEl}
                placement="top-end"
                transition
                style={{zIndex: 40000}}
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            {Object.values(QUESTION_TYPE_CODES).map(renderQuestionTypeMenu)}
                        </Paper>
                    </Fade>
                )}
            </Popper>

            <Dialog open={alertText !== ''} aria-labelledby="form-dialog-title">
                <DialogTitle id="alertDialog">Thông tin không hợp lệ</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {alertText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAlertText('')} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isOpenDialog} aria-labelledby="form-dialog-title">
                {
                    isShowCircleLoading ?
                        (<React.Fragment>
                            <DialogTitle id="form-dialog-title">Vui lòng chờ</DialogTitle>
                            <DialogContent>
                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                    <CircularProgress/>
                                    <DialogContentText className={classes.title}>Đang {testId ? 'Chỉnh sửa' : 'Tạo'} đề
                                        thi</DialogContentText>
                                </div>
                            </DialogContent>
                        </React.Fragment>)
                        : (
                            <React.Fragment>
                                <DialogTitle id="form-dialog-title">Lưu thành công</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Bạn đã lưu thành công {name}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setIsOpenDialog(false)} color="primary">
                                        Xem lại đề
                                    </Button>
                                    <Button onClick={handleClose} color="primary">
                                        Về trang chủ
                                    </Button>
                                </DialogActions>
                            </React.Fragment>
                        )}
            </Dialog>
        </div>
    );
}
