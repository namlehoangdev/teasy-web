import React, {useEffect, useState} from 'react';
import {makeStyles, fade} from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    InputBase,
    DialogTitle,
    TableBody,
    TableCell, TableRow, Checkbox
} from '@material-ui/core';
import {Table, TableHead} from "@material-ui/core";
import {Search as SearchIcon} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
}));


export default function ChooseUserDialog(props) {
    const {open, handleClose, users, onSelectedUsersChange, selectedUserIds} = props;
    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();


    function isSelected(id) {
        return selectedUserIds.indexOf(id) !== -1;
    }

    const handleCloseDialog = () => {
        handleClose && handleClose();
    };

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }

    function handleUserClick(event, userId) {
        const selectedIndex = selectedUserIds.indexOf(userId);
        let newSelected = [...selectedUserIds];
        if (selectedIndex === -1) {
            newSelected.push(userId);
        } else {
            newSelected.splice(selectedIndex, 1);
        }
        onSelectedUsersChange(newSelected);
    }

    function renderUsers(userId) {
        const {name, email} = users.byHash[userId];
        const isItemSelected = isSelected(userId);
        return (
            <TableRow
                hover
                onClick={event => handleUserClick(event, userId)}
                role="checkbox"
                aria-checked={isItemSelected}
                key={userId}
                selected={isItemSelected}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={isItemSelected}
                        inputProps={{'aria-labelledby': userId}}
                    />
                </TableCell>
                <TableCell align="left">{name}</TableCell>
                <TableCell align="left">{email}</TableCell>
            </TableRow>
        )
    }

    function handleSelectAll(event) {
        if (event.target.checked) {
            onSelectedUsersChange(users.byId);
            return;
        }
        onSelectedUsersChange([]);
    }

    function renderTableBody() {
        if (searchValue.length === 0) {
            return (users.byId.map(renderUsers))
        }
        return users.byId.filter(id => users.byHash[id].name.includes(searchValue)).map(renderUsers);
    }

    let usersLength = _.get(users, 'byId', []).length;

    return (<Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Chọn những thí sinh được chia sẻ</DialogTitle>
        <DialogContent>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon/>
                </div>
                <InputBase
                    placeholder="Tìm kiếm…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                    value={searchValue}
                    onChange={handleSearchInputChange}
                />
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < usersLength}
                                checked={selectedUserIds.length === usersLength}
                                onChange={handleSelectAll}
                                inputProps={{'aria-label': 'select all desserts'}}
                            />
                        </TableCell>
                        <TableCell component="th" align="left"> </TableCell>
                        <TableCell component="th" align="left">Tên thí sinh</TableCell>
                        <TableCell component="th" align="left">Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={{minHeight: '500px'}}>
                    {renderTableBody()}
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
                Xong
            </Button>
        </DialogActions>
    </Dialog>);
}

ChooseUserDialog.propTypes = {
    users: PropTypes.object,
    onSelectedUsersChange: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    selectedUserIds: PropTypes.array
};

