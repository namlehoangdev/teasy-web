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
} from "@material-ui/core";
import {Close as CloseIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from "@material-ui/icons";
import {TEXT} from "../../consts";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {
    setOpenAdminFullscreenDialog,
    getAllUsers,
    updateEditingContest,
    getOwnTests, postContest
} from "../../actions";
import produce from "immer";
import ChooseUserDialog from "./choose-users-dialog";
import ChooseTestDialog from "./choose-tests-dialog";
import {FormControl, InputLabel} from "@material-ui/core";
import moment from 'moment';
import Input from "@material-ui/core/Input";
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
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(0.5),
        }
    },
    passwordContainer: {
        display: 'flex',
        flexDirection: 'row'
    }
}));

export default function CreateContestPage() {
    const {editingContest, tests} = useSelector(state => state.adminReducer);
    const {isPublic, permittedUsers, testIds, isSecured, password} = editingContest;
    const [prevIsPublic, setPrevIsPublic] = useState(isPublic);
    const [openChosePermittedUserDialog, setOpenChosePermittedUserDialog] = useState(false);
    const [openChooseTestsDialog, setOpenChooseTestsDialog] = useState(false);
    const {users} = useSelector(state => state.userReducer) || [];
    const [_startDate, setStartDate] = useState(new Date().toISOString().slice(0, -8));
    const [_duration, setDuration] = useState('01:30');
    const [showPassword, setShowPassword] = useState(false);


    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        const [hours, minutes] = _duration.split(':');
        dispatch(updateEditingContest({
            startAt: moment.utc(_startDate).local().toISOString(),
            duration: hours * 216000 + minutes * 3600
        }));

        dispatch(getAllUsers());
        if (!tests || !tests.byId || tests.byId.length === 0) {
            dispatch(getOwnTests());
        }
    }, []);

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
        setStartDate(event.target.value);
        const startAt = moment.utc(event.target.value).local().toISOString();
        dispatch(updateEditingContest({startAt}));
    }

    function handleDurationChange(event) {
        console.log('duration: ', event.target.value);
        setDuration(event.target.value);
        const [hours, minutes] = event.target.value.split(':');
        dispatch(updateEditingContest({duration: hours * 216000 + minutes * 3600}));
    }

    function handlePasswordChange(event) {
        dispatch(updateEditingContest({password: event.target.value}));
    }

    function handleSaveCompetition() {
        dispatch(postContest(editingContest));
    }

    function renderPermittedUsers() {
        if (isPublic) {
            return null;
        }
        return (<div className={classes.permittedUserContainer}>
            {permittedUsers.map((userId) => {
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
                const {id, name} = tests.byHash[testId];
                return (<Chip key={id} label={name} onDelete={() => handleDeleteSelectedTestClick(testId)}
                              variant="outlined"/>)
            })}
        </div>)
    }

    const defaultDate = new Date();
    return (<div>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>{`${TEXT.create} ${TEXT.contest}`}</Typography>
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
                <TextField required label="Tên cuộc thi" margin="normal" fullWidth onChange={handleNameChange}/>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <TextField label="Mô tả" margin="normal" multiline fullWidth onChange={handleDescriptionChange}/>
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
                <TextField
                    id="create-contest-start-date"
                    label="Thời gian bắt đầu"
                    type="datetime-local"
                    defaultValue={defaultDate.toISOString().slice(0, -8)}
                    value={_startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={12} sm={8} md={8}>
                <TextField
                    id="create-contest-time"
                    label="Diễn ra trong"
                    type="time"
                    style={{width: 100}}
                    InputLabelProps={{shrink: true}}
                    inputProps={{step: 300}}
                    defaultValue='01:30'
                    value={_duration}
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



