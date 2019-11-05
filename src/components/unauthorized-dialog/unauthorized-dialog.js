import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import PropTypes from 'prop-types';

export default function UnauthorizedDialog(props) {
    const {open, handleClose} = props;


    const handleLogout = () => {
        handleClose && handleClose();
    };

    return (<Dialog
        open={open}
        onClose={handleLogout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Xin lỗi, phiên đăng nhập của bạn đã hết hạn</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Phiên đăng nhập của bạn đã hết hạn, xin vui lòng đăng nhập lại để tiếp tục sử dụng
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleLogout} color="primary" autoFocus>
                Đăng nhập lại
            </Button>
        </DialogActions>
    </Dialog>);
}

UnauthorizedDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func
}
