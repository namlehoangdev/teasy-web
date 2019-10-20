import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogContentText,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    IconButton
} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import {TEXT} from "../../consts";

export default function QuestionDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="create-dialog-title">
            <DialogTitle id="create-dialog-title">{`${TEXT.create} ${TEXT.question}`}</DialogTitle>
            <DialogContent>
                {/*<DialogContentText>*/}
                {/*    To subscribe to this website, please enter your email address here. We will send updates*/}
                {/*    occasionally.*/}
                {/*</DialogContentText>*/}
                <TextField autoFocus margin="dense" label="lk" type="email" fullWidth/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">{TEXT.dismiss}</Button>
                <Button onClick={handleCloseDialog} variant="contained" color="primary">{TEXT.create}</Button>
            </DialogActions>
        </Dialog>
    );
}

