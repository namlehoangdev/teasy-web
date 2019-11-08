import React, {useState, useEffect} from 'react';
import './create-contest-page.scss'
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
    TextField,
    Grid,
    Chip,
    Avatar,
    FormGroup,
    Checkbox,
    FormControlLabel,
    FormControl, InputLabel, Select, DialogContent, RadioGroup, Radio
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
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
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
        setOpenChosePermittedUserDialog(false);
    }

    function handleSelectedPermittedUsers(selectedUsers) {
        dispatch(updateEditingContest({permittedUsers: selectedUsers}));
    }


    function handleDeleteUserClick(user) {
        const {id: removingUserId} = user;
        dispatch(updateEditingContest(produce(editingContest, draft => draft.permittedUsers.filter(user => user.id !== removingUserId))));
    }

    function renderPermittedUsers() {
        if (isPublic) {
            return null;
        }

        return (<div className={classes.permittedUserContainer}>
            {permittedUsers.map((user) => {
                const {id, name} = user;
                // if (permittedUsers.indexOf(id) === -1)
                //     return null;
                return (<Chip key={id} avatar={<Avatar>{name.charAt(0)}</Avatar>}
                              label={name}
                              onDelete={() => handleDeleteUserClick(user)}
                              variant="outlined"
                />)
            })}
        </div>)
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
                <TextField required label="Tên cuộc thi" fullWidth margin="normal" variant="outlined"/>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <RadioGroup name="isPublic-radio" value={isPublic ? 'public' : 'share'}
                            className={classes.radioGroup}
                            aria-label="edit-answer-radio-1"
                            onChange={handleAccessiblePermissionChange}>
                    <FormControlLabel value={'public'} control={<Radio className={classes.radio}/>} label='Công khai'/>
                    <FormControlLabel value={'share'} control={<Radio className={classes.radio}/>} label='Chia sẻ với'/>
                </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                {renderPermittedUsers()}
            </Grid>
            <Grid item xs={12} sm={8} md={8}>

            </Grid>

        </Grid>

    </div>);

}


