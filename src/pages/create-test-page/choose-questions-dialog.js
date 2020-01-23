import React, {useEffect, useState} from 'react';
import {makeStyles, fade} from '@material-ui/core/styles';
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
import RichEditor from "../../components/rich-editor/rich-editor";
import {QUESTION_TYPE_TEXT} from "../../consts";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useSelector} from "react-redux";

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


export default function ChooseQuestionDialog(props) {
    const {open, handleClose, questions, onSelectedQuestionsChange, onSelectAllChange} = props;
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [prevOpen, setPrevOpen] = useState(open);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();
    useEffect(() => {
        if (open !== prevOpen) {
            if (open) {
                setSelectedQuestionIds([]);
            }
            setPrevOpen(false);
        }
    }, [open]);


    function isSelected(id) {
        return selectedQuestionIds.indexOf(id) !== -1;
    }

    const handleCloseDialog = () => {
        handleClose && handleClose(selectedQuestionIds);
    };

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }

    function handleQuestionClick(event, questionId) {
        const selectedIndex = selectedQuestionIds.indexOf(questionId);
        let newSelected = [...selectedQuestionIds];
        if (selectedIndex === -1) {
            newSelected.push(questionId);
        } else {
            newSelected.splice(selectedIndex, 1);
        }
        setSelectedQuestionIds(newSelected);
    }

    function renderQuestions(questionId) {
        const {content, type, level} = questions.byHash[questionId];
        const isItemSelected = isSelected(questionId);
        return (
            <TableRow
                hover
                onClick={event => handleQuestionClick(event, questionId)}
                role="checkbox"
                aria-checked={isItemSelected}
                key={questionId}
                selected={isItemSelected}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={isItemSelected}
                        inputProps={{'aria-labelledby': questionId}}
                    />
                </TableCell>
                <TableCell align="left">
                    <RichEditor editorState={content} readOnly={true}/>
                </TableCell>
                <TableCell align="left">{level}</TableCell>
                <TableCell align="left">{QUESTION_TYPE_TEXT[type]}</TableCell>
            </TableRow>
        )
    }

    function handleSelectAll(event) {
        if (event.target.checked) {
            setSelectedQuestionIds(questions.byId);
            return;
        }
        setSelectedQuestionIds([]);
    }

    function renderTableBody() {
        if (searchValue.length === 0) {
            return (questions.byId.map(renderQuestions))
        }
        return questions.byId.filter(id => questions.byHash[id].name.includes(searchValue)).map(renderQuestions);
    }

    let questionsLength = _.get(questions, 'byId', []).length;
    return (<Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Chọn câu hỏi trong kho</DialogTitle>
            <DialogContent>
                {/*<div className={classes.search}>*/}
                {/*    <div className={classes.searchIcon}>*/}
                {/*        <SearchIcon/>*/}
                {/*    </div>*/}
                {/*    <InputBase*/}
                {/*        placeholder="Tìm kiếm…"*/}
                {/*        classes={{*/}
                {/*            root: classes.inputRoot,*/}
                {/*            input: classes.inputInput,*/}
                {/*        }}*/}
                {/*        inputProps={{'aria-label': 'search'}}*/}
                {/*        value={searchValue}*/}
                {/*        onChange={handleSearchInputChange}*/}
                {/*    />*/}
                {/*</div>*/}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedQuestionIds.length > 0 && selectedQuestionIds.length < questionsLength}
                                    checked={selectedQuestionIds.length === questionsLength}
                                    onChange={handleSelectAll}
                                    inputProps={{'aria-label': 'select all desserts'}}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row" align="left"><b>Nội dung</b></TableCell>
                            <TableCell component="th" scope="row" align="left"><b>Độ khó</b></TableCell>
                            <TableCell component="th" scope="row" align="left"><b>Loại</b></TableCell>
                        </TableRow>
                    </TableHead>
                    {isShowCircleLoading &&
                    <span style={{display: 'flex', flex: 1, flexDirection: 'row'}}><CircularProgress/></span>}
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
        </Dialog>
    );
}

ChooseQuestionDialog.propTypes = {
    questions: PropTypes.object,
    onSelectedQuestionsChange: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    selectedQuestionIds: PropTypes.array
};

