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
import { trimSign } from 'utils';

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


export default function ChooseTestDialog(props) {
    const {open, handleClose, tests, onSelectedTestsChange, selectedTestIds} = props;
    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();


    function isSelected(id) {
        return selectedTestIds.indexOf(id) !== -1;
    }

    const handleCloseDialog = () => {
        handleClose && handleClose();
    };

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }

    function handleTestClick(event, testId) {
        const selectedIndex = selectedTestIds.indexOf(testId);
        let newSelected = [...selectedTestIds];
        if (selectedIndex === -1) {
            newSelected.push(testId);
        } else {
            newSelected.splice(selectedIndex, 1);
        }
        onSelectedTestsChange(newSelected);
    }

    function renderTests(testId) {
        const {name, hasFullAnswers} = tests.byHash[testId];
        const isItemSelected = isSelected(testId);
        return (
            <TableRow
                hover
                onClick={event => handleTestClick(event, testId)}
                role="checkbox"
                aria-checked={isItemSelected}
                key={testId}
                selected={isItemSelected}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={isItemSelected}
                        inputProps={{'aria-labelledby': testId}}
                    />
                </TableCell>
                <TableCell align="left">{name}</TableCell>
                <TableCell align="left">{hasFullAnswers ? 'Có' : 'Không'}</TableCell>
            </TableRow>
        )
    }

    function handleSelectAll(event) {
        if (event.target.checked) {
            onSelectedTestsChange(tests.byId);
            return;
        }
        onSelectedTestsChange([]);
    }

    function renderTableBody() {
        if (searchValue.length === 0) {
            return (tests.byId.map(renderTests))
        }
        return tests.byId.filter(id => trimSign(tests.byHash[id].name.toLowerCase()).includes(searchValue.toLowerCase())).map(renderTests);
    }

    let testsLength = _.get(tests, 'byId', []).length;
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
                                indeterminate={selectedTestIds.length > 0 && selectedTestIds.length < testsLength}
                                checked={selectedTestIds.length === testsLength}
                                onChange={handleSelectAll}
                                inputProps={{'aria-label': 'select all desserts'}}
                            />
                        </TableCell>
                        <TableCell component="th" align="left">Tên đề thi</TableCell>
                        <TableCell component="th" align="left">Đầy đủ đáp án</TableCell>
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

ChooseTestDialog.propTypes = {
    tests: PropTypes.object,
    onSelectedTestsChange: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    selectedTestIds: PropTypes.array
};

