import React, {useState, useEffect} from 'react';
import './create-contest-page.scss'
import {
    AppBar,
    Button,
    IconButton,
    makeStyles,
    Toolbar,
    FormLabel,
    Typography,
    TextField,
    Grid,
    Chip,
    Avatar,
    InputAdornment,
    FormControlLabel,
    RadioGroup, Radio,
    Card, CardActionArea, CardMedia,
    CardContent, CardActions
} from "@material-ui/core";
import {Close as CloseIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from "@material-ui/icons";
import {TEXT} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {DateTimePicker, TimePicker} from "@material-ui/pickers";
import {
    setOpenAdminFullscreenDialog,
    getAllUsers,
    updateEditingContest,
    getOwnTests, postContest, putContest
} from "../../actions";
import produce from "immer";
import ChooseUserDialog from "./choose-users-dialog";
import ChooseTestDialog from "./choose-tests-dialog";
import {FormControl} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import {isDate} from "moment";
import {isDateObject, msToTime} from "../../utils";
import ImageUpload from '../../components/upload/ImageUpload';
//TODO: change to permitted Users from array to map

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
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
    autoCompleteText: {
        zIndex: 200
    },
    permittedUserContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
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
}));

export default function CreateContestPage() {
    const {editingContest, tests} = useSelector(state => state.adminReducer);
    const {id, isPublic, permittedUsers, testIds, isSecured, password, name, description, startAt, duration, backgroundUrl} = editingContest;
    const [prevIsPublic, setPrevIsPublic] = useState(isPublic);
    const [openChosePermittedUserDialog, setOpenChosePermittedUserDialog] = useState(false);
    const [openChooseTestsDialog, setOpenChooseTestsDialog] = useState(false);
    const {users} = useSelector(state => state.userReducer) || [];
    const [_duration, setDuration] = useState(new Date());
    const [showPassword, setShowPassword] = useState(false);
    const [backgroundUrlState, setBackgroundUrlState] = useState('');

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
            const now = new Date();
            dispatch(updateEditingContest({
                duration: 1 * 3600000 + 30 * 60000,
                startAt: now.toISOString()
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
        dispatch(setOpenAdminFullscreenDialog(false));
    }

    function handleAccessiblePermissionChange(event) {
        console.log(event.target.value);
        dispatch(updateEditingContest({isPublic: event.target.value === 'public'}));
    }

    function handleSecurityChange(event) {
        dispatch(updateEditingContest({isSecured: event.target.value === 'isSecured'}));
    }

    function handleClosePermittedUsersDialog() {
        console.log('close', openChosePermittedUserDialog);
        setOpenChosePermittedUserDialog(false);
    }

    function handleCloseChooseTestDialog() {
        console.log('close', setOpenChooseTestsDialog);
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
        console.log('start date change: ', event);
        dispatch(updateEditingContest({startAt: new Date(event).toISOString()}));
    }

    function handleDurationChange(event) {
        console.log('duration: ', event);
        setDuration(event);
        const temp = new Date(event);
        dispatch(updateEditingContest({duration: temp.getHours() * 3600000 + temp.getMinutes() * 60000}));
    }

    function handlePasswordChange(event) {
        dispatch(updateEditingContest({password: event.target.value}));
    }

    function handleSaveCompetition() {
        if (!editingContest.startAt) {
            alert('ngày không hợp lệ');
            return;
        }
        if (!editingContest.name || editingContest.name.length === 0) {
            alert('ten khong hop le');
            return;
        }
        if (id) {
            dispatch(putContest(editingContest));
        } else {
            dispatch(postContest(editingContest));
        }
    }

    function renderPermittedUsers() {
        if (isPublic) {
            return null;
        }
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
        </div>)
    }

    function handleUploaded(url) {
        setBackgroundUrlState(url)
        dispatch(updateEditingContest({backgroundUrl: url}));
    }

    return (<div>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                {
                    id ? (<Typography variant="h6"
                                      className={classes.title}>{`${TEXT.edit} ${TEXT.contest}`}</Typography>) :
                        (<Typography variant="h6"
                                     className={classes.title}>{`${TEXT.create} ${TEXT.contest}`}</Typography>)}
                <Button color="inherit" onClick={handleSaveCompetition}>{TEXT.save}</Button>
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

        <Grid container className={classes.page}>
            <Grid item xs={12} sm={8} md={8}>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={backgroundUrlState}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Ảnh bìa cuộc thi
                            </Typography>
                            {/* <Typography variant="body2" color="textSecondary" component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
                      </Typography> */}
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <ImageUpload
                            category="Competition"
                            userId={userId}
                            buttonLabel="Tải lên ảnh bìa cuộc thi"
                            onUploaded={handleUploaded}
                        />
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <TextField required label="Tên cuộc thi" margin="normal" fullWidth onChange={handleNameChange}
                           value={name}/>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <TextField label="Mô tả" margin="normal" multiline fullWidth
                           value={description} onChange={handleDescriptionChange}/>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <FormLabel component="legend">Quyền truy cập</FormLabel>
                <RadioGroup name="isPublic-radio" value={isPublic ? 'public' : 'share'}
                            className={classes.radioGroup}
                            aria-label="edit-answer-radio-1"
                            onChange={handleAccessiblePermissionChange}>
                    <FormControlLabel value={'public'} control={<Radio className={classes.radio}/>} label='Công khai'/>
                    <span style={{flexDirection: 'row', display: 'flex'}}>
                    <FormControlLabel value={'share'} control={<Radio className={classes.radio}/>} label='Chia sẻ với'/>
                        {
                            !isPublic && (<Grid item xs={12} sm={8} md={8}>
                                <TextField fullWidth multiline placholder="Chọn thí sinh" className={classes.margin}
                                           onClick={() => setOpenChosePermittedUserDialog(true)}
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       {renderPermittedUsers()}
                                                   </InputAdornment>
                                               ),
                                           }}
                                />
                            </Grid>)
                        }
                    </span>
                </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={8} md={8}>
                <TextField
                    className={classes.margin}
                    multiline
                    label="Đề thi"
                    placeholder="Chọn đề thi"
                    onClick={() => setOpenChooseTestsDialog(true)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {renderTests()}
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <DateTimePicker ampm={false} label="Thời gian bắt đầu"
                                value={startAt} onChange={handleStartDateChange}/>
            </Grid>

            <Grid item xs={12} sm={8} md={8}>
                <TimePicker
                    ampm={false}
                    label="Diễn ra trong"
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
            <Grid item xs={12} sm={8} md={8}>
                <FormLabel component="legend">Mật khẩu cuộc thi</FormLabel>
                <RadioGroup name="isSecuredRadio-radio" value={isSecured ? 'isSecured' : 'notSecured'}
                            className={classes.radioGroup} aria-label="edit-answer-radio-2"
                            onChange={handleSecurityChange}>
                    <FormControlLabel value={'notSecured'} control={<Radio className={classes.radio}/>} label='Không'/>
                    <span style={{flexDirection: 'row', display: 'flex'}}>
                    <FormControlLabel value={'isSecured'} control={<Radio className={classes.radio}/>}
                                      label='Mật khẩu'/>
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
                    </span>
                </RadioGroup>
            </Grid>
        </Grid>
    </div>)
}



