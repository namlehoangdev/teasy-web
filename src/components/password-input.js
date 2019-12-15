import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import {FormControl, InputAdornment, IconButton, OutlinedInput, InputLabel, makeStyles} from '@material-ui/core';
import {Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon} from "@material-ui/icons";


const useStyles = makeStyles(theme => ({
    textField: {}
}));


export default function PasswordInput(props) {
    const classes = useStyles();
    const {value, onChange, label = "Mật khẩu"} = props;
    const {isShowPassword, setIsShowPassword} = useState(false);

    function handleChange(event) {
        onChange && onChange(event.target.value);
    }

    return (<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
        <OutlinedInput
            id="outlined-adornment-password"
            type={isShowPassword}
            value={value}
            onChange={handleChange}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                    >
                        {isShowPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                    </IconButton>
                </InputAdornment>
            }
            labelWidth={70}
        />
    </FormControl>);
}
