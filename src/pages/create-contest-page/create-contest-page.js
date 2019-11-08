import React, {useState, useEffect} from 'react';
import './create-contest-page.scss'
import {
    AppBar,
    Button,
    Dialog,
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
    FormGroup,
    Checkbox,
    FormControlLabel,
    FormControl, InputLabel, Select, DialogContent, RadioGroup, Radio, FormHelperText
} from "@material-ui/core";
import {Close as CloseIcon} from "@material-ui/icons";
import {Autocomplete} from '@material-ui/lab';
import {QUESTION_TYPE_CODES, TEXT} from "../../consts";
import {useHistory, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {setOpenAdminFullscreenDialog, getAllUsers, updateEditingContest, updateEditingQuestion} from "../../actions";
import produce from "immer";
import ChooseUserDialog from "./choose-users-dialog";
import PropTypes from "prop-types";

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
}));

export default function CreateContestPage() {
    const {editingContest} = useSelector(state => state.adminReducer);
    const {isPublic, permittedUsers} = editingContest;
    const [prevIsPublic, setPrevIsPublic] = useState(isPublic);
    const [openChosePermittedUserDialog, setOpenChosePermittedUserDialog] = useState(true);
    const {users} = useSelector(state => state.userReducer) || [];

    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(getAllUsers());
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

    function handleClosePermittedUsersDialog() {
        console.log('close', openChosePermittedUserDialog);
        setOpenChosePermittedUserDialog(false);
    }

    function handleSelectedPermittedUsers(selectedUsers) {
        dispatch(updateEditingContest({permittedUsers: selectedUsers}));
    }


    function handleDeleteUserClick(userId) {
        dispatch(updateEditingContest(produce(editingContest, draft => {
                console.log('draft: ', draft);
                console.log(userId);
                draft.permittedUsers = editingContest.permittedUsers.filter(id => id !== userId);
            }
        )));
    }

    function renderPermittedUsers() {
        if (isPublic) {
            return null;
        }

        return (<div className={classes.permittedUserContainer}>
            {permittedUsers.map((userId) => {
                const {id, name} = users.byHash[userId];
                // if (permittedUsers.indexOf(id) === -1)
                //     return null;
                return (<Chip key={id} avatar={<Avatar>{name.charAt(0)}</Avatar>}
                              label={name}
                              onDelete={() => handleDeleteUserClick(userId)}
                              variant="outlined"
                />)
            })}
        </div>)
    }

    function renderTests() {
        return null;
    }


    return (<div>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>{`${TEXT.create} ${TEXT.contest}`}</Typography>
                <Button color="inherit" onClick={handleClose}>{TEXT.save}</Button>
            </Toolbar>
        </AppBar>

        <ChooseUserDialog open={openChosePermittedUserDialog}
                          users={users}
                          onSelectedUsersChange={handleSelectedPermittedUsers}
                          handleClose={handleClosePermittedUsersDialog}
                          selectedUserIds={permittedUsers}/>

        <Grid container className={classes.page}>
            <Grid item xs={12} sm={8} md={8}>
                <TextField required label="Tên cuộc thi" fullWidth margin="normal" fullWidth/>
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
                                <TextField
                                    fullWidth
                                    placholder="Chọn thí sinh"
                                    className={classes.margin}
                                    multiline
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
                    onClick={() => setOpenChosePermittedUserDialog(true)}
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

        </Grid>

    </div>);

}


