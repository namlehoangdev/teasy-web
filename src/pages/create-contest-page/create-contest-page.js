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
    FormControl, InputLabel, Select, DialogContent
} from "@material-ui/core";
import {Close as CloseIcon} from "@material-ui/icons";
import {Autocomplete} from '@material-ui/lab';
import {QUESTION_TYPE_CODES, TEXT} from "../../consts";
import {useHistory, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {setOpenAdminFullscreenDialog, getAllUsers} from "../../actions";

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
        padding: theme.spacing(2)
    }
}));

export default function CreateContestPage() {
    const {users} = useSelector(state => state.userReducer) || [];
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(getAllUsers());
    }, []);

    function handleClose() {
        history.goBack();
        dispatch(setOpenAdminFullscreenDialog(false));
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
        <Grid container className={classes.page}>
            <Grid item xs={12} sm={8} md={8}>
                <TextField required label="Tên cuộc thi" fullWidth margin="normal" variant="outlined"/>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
                <Autocomplete
                    multiple
                    options={users}
                    getOptionLabel={option => option.name}
                    defaultValue={users[0]}
                    renderInput={params => (
                        <TextField {...params} variant="standard" margin="normal" fullWidth
                                   placeholder="Chia sẻ với"/>
                    )}
                />
            </Grid>
        </Grid>
    </div>);
}
