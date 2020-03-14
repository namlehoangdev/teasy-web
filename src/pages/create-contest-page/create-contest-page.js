import React, {useEffect, useState} from 'react';
import './create-contest-page.scss'
import clsx from 'clsx';
import {
    AppBar,
    Avatar,
    Button,
    CardActionArea,
    CardMedia,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    makeStyles,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from "@material-ui/icons";
import {CONTEST_TYPE_CODE, CONTEST_TYPE_TEXT, TEXT} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {DateTimePicker, TimePicker} from "@material-ui/pickers";
import {
    getAllUsers,
    getOwnTests,
    postContest,
    putContest,
    setOpenAdminFullscreenDialog,
    updateEditingContest
} from "../../actions";
import produce from "immer";
import ChooseUserDialog from "./choose-users-dialog";
import ChooseTestDialog from "./choose-tests-dialog";
import Input from "@material-ui/core/Input";
import {msToTime} from "../../utils";
import ImageUpload from '../../components/upload/ImageUpload';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import {CopyRoomCodeButton} from '../../components';
//TODO: change to permitted Users from array to map

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    layout: {
        alignSelf: 'center',
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
            width: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    page: {
        padding: theme.spacing(2),
        minHeight: '100%'
    },
    item: {
        marginTop: theme.spacing(2),
    },
    radioGroup: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
        marginLeft: theme.spacing(2)
    },
    autoCompleteText: {
        zIndex: 200
    },
    permittedUserContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        }
    },
    passwordContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    card: {
        width: '100%'
    },
    media: {
        height: 250,
    },
    icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
    button: {
        marginTop: theme.spacing(4),
        marginLeft: 'auto'
    }
}));

export default function CreateContestPage() {
    const {editingContest, tests} = useSelector(state => state.adminReducer);
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const {id, isPublic, isShownAnswers, isShuffled, category, permittedUsers, testIds, isSecured, code, password, name, description, startAt, duration, backgroundUrl} = editingContest;
    const [prevIsPublic, setPrevIsPublic] = useState(isPublic);
    const [openChosePermittedUserDialog, setOpenChosePermittedUserDialog] = useState(false);
    const [openChooseTestsDialog, setOpenChooseTestsDialog] = useState(false);
    const [alertText, setAlertText] = useState('');
    const {users} = useSelector(state => state.userReducer) || [];
    const [_duration, setDuration] = useState(new Date());
    const [showPassword, setShowPassword] = useState(false);
    const [backgroundUrlState, setBackgroundUrlState] = useState('');
    const [isOpenSubmittedDialog, setIsOpenSubmittedDialog] = useState(false);


    const {profile} = useSelector(state => state.authReducer);
    const userId = profile.id;

    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(getAllUsers());
        if (!tests || !tests.byId || tests.byId.length === 0) {
            dispatch(getOwnTests());
        }

        if (id) {
            const [hours, minutes] = msToTime(duration);
            setDuration(new Date(1997, 10, 3, hours, minutes));
        } else {
            dispatch(updateEditingContest({
                duration: 1 * 3600000 + 30 * 60000,
                startAt: null,
                isPublic: true,
                isShuffled: false,
                isShownAnswers:true,
                category: CONTEST_TYPE_CODE.ELSE
            }));
            setDuration(new Date(1997, 10, 3, 1, 30));
        }

    }, []);

    useEffect(() => {
        setBackgroundUrlState(backgroundUrl || 'https://tech4gamers.com/wp-content/uploads/2019/05/How-To-Use-Tech-To-Overcome-Competition.png')
    }, [backgroundUrl]);

    useEffect(() => {
        if (permittedUsers && permittedUsers.length > 0 && !isPublic && isPublic !== prevIsPublic) {
            setOpenChosePermittedUserDialog(true);
        }
        if (isPublic !== prevIsPublic) {
            setPrevIsPublic(isPublic);
        }
    }, [isPublic, permittedUsers]);

    function handleClose() {

        history.goBack();
        //dispatch(setOpenAdminFullscreenDialog(false));
    }


    function handleStartAtRadioChange(event) {
        if (event.target.value === 'start-at-no-limit') {
            dispatch(updateEditingContest({startAt: null}));
        } else {
            dispatch(updateEditingContest({startAt: new Date().toISOString()}));
        }
    }

    function handleAccessiblePermissionChange(event) {
        if (event.target.value === 'share') {
            setOpenChosePermittedUserDialog(true);
        }
        dispatch(updateEditingContest({isPublic: event.target.value === 'public'}));
    }


    function handleIsShuffledChange(event) {
        dispatch(updateEditingContest({isShuffled: event.target.value === 'true'}));
    }

    function handleIsShownAnswersChange(event) {
        dispatch(updateEditingContest({isShownAnswers: event.target.value === 'true'}));
    }

    function handleSecurityChange(event) {
        dispatch(updateEditingContest({isSecured: event.target.value === 'isSecured'}));
    }

    function handleClosePermittedUsersDialog() {
        setOpenChosePermittedUserDialog(false);
    }

    function handleCloseChooseTestDialog() {
        setOpenChooseTestsDialog(false);
    }

    function handleSelectedPermittedUsers(selectedUsers) {
        dispatch(updateEditingContest({permittedUsers: selectedUsers}));
    }

    function handleSelectedTests(selectedTestIds) {
        dispatch(updateEditingContest({testIds: selectedTestIds}));
    }

    function handleDeleteUserClick(userId) {
        dispatch(updateEditingContest(produce(editingContest, draft => {
                draft.permittedUsers = editingContest.permittedUsers.filter(id => id !== userId);
            }
        )));
    }

    function handleDeleteSelectedTestClick(testId) {
        if (id) {
            setAlertText('Không thể xóa đề thi của cuộc thi đang diễn ra');
            return;
        }
        dispatch(updateEditingContest(produce(editingContest, draft => {
                draft.testIds = editingContest.testIds.filter(id => id !== testId);
            }
        )));
    }

    function handleNameChange(event) {
        dispatch(updateEditingContest({name: event.target.value}));
    }

    function handleDescriptionChange(event) {
        dispatch(updateEditingContest({description: event.target.value}));
    }

    function handleStartDateChange(event) {
        dispatch(updateEditingContest({startAt: new Date(event).toISOString()}));
    }

    function handleDurationChange(event) {
        setDuration(event);
        const temp = new Date(event);
        dispatch(updateEditingContest({duration: temp.getHours() * 3600000 + temp.getMinutes() * 60000}));
    }

    function handlePasswordChange(event) {
        dispatch(updateEditingContest({password: event.target.value}));
    }

    function handleSaveCompetition() {
        if (!name || name.length === 0) {
            setAlertText('Vui lòng điền tên cuộc thi');
            return;
        }
        if (!testIds || testIds.length <= 0) {
            setAlertText('Vui lòng chọn ít nhất 1 đề thi');
            return;
        }
        setAlertText('');
        setIsOpenSubmittedDialog(true);
        if (id) {
            dispatch(putContest(editingContest));
        } else {
            dispatch(postContest(editingContest));
        }
    }

    function handleCategoryChange(event) {    
        if (event.target && event.target.value) {
            dispatch(updateEditingContest({category: event.target.value}));
        }
    }

    function renderPermittedUsers() {
        return (<div className={classes.permittedUserContainer}>
            {permittedUsers && permittedUsers.map((userId) => {
                if (!users.byHash[userId]) {
                    return;
                }
                const {id, name} = users.byHash[userId];
                return (<Chip key={id} avatar={<Avatar>{name.charAt(0)}</Avatar>}
                              label={name}
                              onDelete={() => handleDeleteUserClick(userId)}
                              variant="outlined"
                />)
            })}
            <IconButton edge="start"
                        color='primary'
                        size='small'
                        style={{marginLeft: 2}}
                        onClick={() => setOpenChosePermittedUserDialog(true)}>
                <AddCircleOutlineIcon/>
            </IconButton>
        </div>)
    }

    function renderTests() {
        return (<div className={classes.permittedUserContainer}>
            {testIds && testIds.map((testId) => {
                if (!tests.byHash[testId]) {
                    return;
                }
                const {id, name} = tests.byHash[testId];
                return (<Chip key={id} label={name} onDelete={() => handleDeleteSelectedTestClick(testId)}
                              variant="outlined"/>)
            })}
            <IconButton edge="start"
                        color='primary'
                        size='small'
                        style={{marginLeft: 2}}
                        onClick={() => {
                            if (id) {
                                setAlertText('Không thể thêm đề vào cuộc thi đang diễn ra');
                                return;
                            }
                            setOpenChooseTestsDialog(true)
                        }}>
                <AddCircleOutlineIcon/>
            </IconButton>
        </div>)
    }

    function handleUploaded(url) {
        setBackgroundUrlState(url);
        dispatch(updateEditingContest({backgroundUrl: url}));
    }

    function handleBack() {
        history.goBack();
        dispatch(setOpenAdminFullscreenDialog(false));
    }

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6"
                                className={classes.title}>{`${id ? TEXT.edit : TEXT.create} ${TEXT.contest}`}</Typography>
                </Toolbar>
            </AppBar>
            <ChooseUserDialog open={openChosePermittedUserDialog}
                              users={users}
                              onSelectedUsersChange={handleSelectedPermittedUsers}
                              handleClose={handleClosePermittedUsersDialog}
                              selectedUserIds={permittedUsers}/>

            <ChooseTestDialog open={openChooseTestsDialog}
                              tests={tests}
                              onSelectedTestsChange={handleSelectedTests}
                              handleClose={handleCloseChooseTestDialog}
                              selectedTestIds={testIds}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Grid container className={classes.page}>
                        <Grid item xs={12} sm={12} md={12}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image={backgroundUrlState}
                                    title="Contemplative Reptile"
                                >
                                    <ImageUpload
                                        category="Competition"
                                        userId={userId}
                                        buttonLabel="Tải lên ảnh bìa cuộc thi"
                                        onUploaded={handleUploaded}
                                    />
                                </CardMedia>
                            </CardActionArea>
                        </Grid>
                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container xs={12}>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Tên cuộc thi *</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <Input required
                                           placeholder='Ví dụ: Cuộc thi học sinh giỏi Tiếng Anh'
                                           fullWidth
                                           onChange={handleNameChange}
                                           value={name}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container xs={12}>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Chọn đề thi *</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    {renderTests()}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container xs={12}>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Thời lượng *</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <TimePicker
                                        ampm={false}
                                        views={["hours", "minutes"]}
                                        format="HH:mm"
                                        value={_duration}
                                        invalidDateMessage="Giờ không hợp lệ"
                                        invalidLabel="Không đúng"
                                        cancelLabel="Hủy"
                                        okLabel="Chọn"
                                        onChange={handleDurationChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container xs={12}>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Thời gian bắt đầu thi</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <RadioGroup name="startAt-radio"
                                                value={!startAt ? 'start-at-no-limit' : 'start-at-time'}
                                                className={classes.radioGroup}
                                                aria-label="startAtRadio"
                                                onChange={handleStartAtRadioChange}>
                                        <FormControlLabel value={'start-at-no-limit'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Không giới hạn'/>
                                        <FormControlLabel value={'start-at-time'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Bắt đầu lúc'/>
                                        {startAt && <DateTimePicker ampm={false}
                                                                    disablePast={true}
                                                                    value={startAt} onChange={handleStartDateChange}/>}
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Quyền truy cập</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <RadioGroup name="isPublic-radio" value={isPublic ? 'public' : 'share'}
                                                className={classes.radioGroup}
                                                aria-label="startAtRadio"
                                                onChange={handleAccessiblePermissionChange}>
                                        <FormControlLabel value={'public'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Mọi người'/>
                                        <FormControlLabel value={'share'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Chỉ chia sẻ với'/>
                                        {!isPublic && renderPermittedUsers()}
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Hiển thị đáp án khi nộp
                                        bài (Đề phải có đủ đáp án)</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <RadioGroup name="isPublic-radio" value={isShownAnswers ? 'true' : 'false'}
                                                className={classes.radioGroup}
                                                aria-label="startAtRadio"
                                                onChange={handleIsShownAnswersChange}>
                                        <FormControlLabel value={'true'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Có'/>
                                        <FormControlLabel value={'false'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Không'/>
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Xáo trộn thứ tự câu
                                        hỏi</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <RadioGroup name="isPublic-radio" value={isShuffled ? 'true' : 'false'}
                                                className={classes.radioGroup}
                                                aria-label="startAtRadio"
                                                onChange={handleIsShuffledChange}>
                                        <FormControlLabel value={'true'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Có'/>
                                        <FormControlLabel value={'false'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Không'/>
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Mật khẩu cuộc thi</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <RadioGroup name="isSecuredRadio-radio"
                                                value={isSecured ? 'isSecured' : 'notSecured'}
                                                className={classes.radioGroup}
                                                aria-label="startAtRadio"
                                                onChange={handleSecurityChange}>
                                        <FormControlLabel value={'isSecured'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Có'/>
                                         <FormControlLabel value={'notSecured'}
                                                          control={<Radio size='small' disableRipple
                                                                          checkedIcon={<span
                                                                              className={clsx(classes.icon, classes.checkedIcon)}/>}
                                                                          icon={<span className={classes.icon}/>}
                                                                          className={classes.radio}/>}
                                                          label='Không'/>
                                        {isSecured && (<FormControl className={classes.passwordContainer}>
                                            {/*<InputLabel htmlFor="standard-adornment-password">Mật khẩu</InputLabel>*/}
                                            <Input id="standard-adornment-password"
                                                   type={showPassword ? 'text' : 'password'}
                                                   value={password}
                                                   onChange={handlePasswordChange}
                                                   endAdornment={
                                                       <InputAdornment position="end">
                                                           <IconButton
                                                               aria-label="toggle password visibility"
                                                               onClick={() => setShowPassword(!showPassword)}
                                                               onMouseDown={(event) => event.preventDefault()}>
                                                               {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                                           </IconButton>
                                                       </InputAdornment>
                                                   }
                                            />
                                        </FormControl>)}
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Thể loại</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        {Object.values(CONTEST_TYPE_CODE).map((value) => {
                                            return (<MenuItem
                                                value={value}
                                                key={value}>{CONTEST_TYPE_TEXT[value]}</MenuItem>)
                                        })}
                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} mt={3} className={classes.item}>
                            <Grid container>
                                <Grid item xs={3} sm={3}>
                                    <Typography variant='body2' align='flex-end'><b>Mô tả</b></Typography>
                                </Grid>
                                <Grid item xs={9} sm={9}>
                                    <TextField multiline fullWidth
                                               placeholder='Ví dụ: Cuộc thi thường niên do bộ giáo dục tổ chức..'
                                               value={description} onChange={handleDescriptionChange}/>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Button variant="contained"
                                color="primary"
                                className={classes.button}

                                onClick={handleSaveCompetition}>{TEXT.save}</Button>

                    </Grid>
                </Paper>
            </main>

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
            <Dialog open={isOpenSubmittedDialog}
                    aria-labelledby="form-dialog-title">
                {
                    isShowCircleLoading ?
                        (<React.Fragment>
                            <DialogTitle id="form-dialog-title">Vui lòng chờ</DialogTitle>
                            <DialogContent>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <CircularProgress/>
                                    <DialogContentText className={classes.title}> Đang {id ? 'Chỉnh sửa' : 'Tạo'} cuộc
                                        thi</DialogContentText>
                                </div>
                            </DialogContent>
                        </React.Fragment>)
                        :
                        (<React.Fragment>
                            <DialogTitle id="form-dialog-title">{id ? 'Chỉnh sửa' : 'Tạo'} cuộc thi thành
                                công</DialogTitle>
                            {isPublic &&
                            <DialogContent>
                                <span style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                  <Typography style={{marginRight: 5}} variant={"h6"}>
                                    Mã thi nhanh{" "}
                                  </Typography>
                                <CopyRoomCodeButton code={code}/>
                                </span>
                                <Typography variant={'p'}>(Mã thi nhanh - tham gia nhanh cuộc thi mà không cần đăng nhập
                                    )</Typography>
                            </DialogContent>}
                            <DialogActions>
                                <Button onClick={handleBack} color="primary">Quay lại</Button>
                            </DialogActions>
                        </React.Fragment>)}
            </Dialog>
        </div>
    )
}


