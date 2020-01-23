import React from 'react';
import {
    FormControl,
    Button,
    makeStyles,
    IconButton, Grid, Typography
} from "@material-ui/core";
import {Close as CloseIcon, ArrowRightAlt as ArrowRightAltIcon} from "@material-ui/icons";
import produce from "immer";
import PropTypes from 'prop-types';
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles(theme => ({
    formControl: {
        display: 'flex',
        flex: 1
    },
    textFieldContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: theme.spacing(1)
    },
    textField: {
        marginVertical: theme.spacing(1)
    },
    hintTitle: {
        marginTop: theme.spacing(3)
    },
    inputBase: {
        marginLeft: theme.spacing(3),
        borderBottom: '1px solid ' + theme.palette.background.paper,
        marginBottom: theme.spacing(1),
        "&:hover": {
            borderBottomColor: theme.palette.grey[400]
        },
        "&:focus": {
            backgroundColor: 'green',
        },
        "&:focus-within": {
            borderBottomColor: theme.palette.primary.main
        },
        "&:active": {}
    },
}));


export default function EditingMatching(props) {
    const {data, onChange} = props;
    const {options1 = [], options2 = []} = data;

    const classes = useStyles();


    function handleOptions1ContentChange(event, index) {
        const {options1} = data;
        onChange({
            options1: produce(options1, draftState => {
                draftState[index] = event.target.value
            })
        });
    }

    function handleOptions2ContentChange(event, index) {
        const {options2} = data;
        onChange({
            options2: produce(options2, draftState => {
                draftState[index] = event.target.value
            })
        });
    }


    function handleRemoveAnswerClick(index) {
        const {options1, options2} = data;
        onChange({
            options1: produce(options1, draftState => {
                draftState.splice(index, 1);
            }),
            options2: produce(options2, draftState => {
                draftState.splice(index, 1);
            }),
        });
    }

    function handleOnOptions1Blur(item, index) {
        const value = options2[index];
        if (!value || value.length === 0) {
            onChange({
                options2: produce(options2, draftState => {
                    draftState[index] = 'Nội dung 1'
                })
            });
        }
    }

    function handleOnOptions2Blur(item, index) {
        const value = options2[index];
        if (!value || value.length === 0) {
            onChange({
                options2: produce(options2, draftState => {
                    draftState[index] = 'Nội dung 2'
                })
            });
        }
    }


    function handleAddMoreAnswerClick() {
        onChange(produce(data, draftState => {
            if (!draftState.options1) {
                const newOptions1 = [];
                newOptions1.push('Nội dung 1');
                const newOptions2 = [];
                newOptions2.push('Nội dung 2');
                draftState.options1 = newOptions1;
                draftState.options2 = newOptions2;
            } else {
                draftState.options1.push('Nội dung 1');
                draftState.options2.push('Nội dung 2');
            }
        }));
    }


    function renderOptions(item, index) {
        return (<Grid item key={index.toString()} className={classes.textFieldContainer}>
            <InputBase multiline value={options1[index] || ''}
                       className={classes.inputBase}
                       fullWidth
                       variant="outlined"
                       onBlur={() => handleOnOptions1Blur(item, index)}
                       onChange={(event) => handleOptions1ContentChange(event, index)}
            />
            <ArrowRightAltIcon color={'disabled'}/>
            <InputBase multiline value={options2[index] || ''}
                       className={classes.inputBase}
                       fullWidth
                       variant="outlined"
                       onBlur={() => handleOnOptions2Blur(item, index)}
                       onChange={(event) => handleOptions2ContentChange(event, index)}
            />
            <IconButton edge="end"
                        onClick={() => handleRemoveAnswerClick(index)}><CloseIcon/></IconButton>
        </Grid>)

    }


    return (<FormControl className={classes.formControl}>
        {/* <Typography variant="p" className={classes.hintTitle}>Thêm cặp đáp án tương ứng</Typography> */}
        {options1 && options1 && options1.map(renderOptions)}
        <div>
            <Button color={"primary"} onClick={handleAddMoreAnswerClick}>Thêm cặp đáp án tương ứng với nhau</Button>
        </div>
    </FormControl>);
}

EditingMatching.propTypes = {
    data: PropTypes.any,
    onChange: PropTypes.func,
};

EditingMatching.defaultProps = {
    onChange: () => {
    }
};


