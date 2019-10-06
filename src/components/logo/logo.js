import React from 'react';
import {makeStyles} from "@material-ui/core";
import images from "../../assets/images";
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    root: {
        height: '100%',
        width: 'auto'
    }
});

export default function Logo(props) {
    const classes = useStyles();
    return (
        <img className={`${classes.root} ${props.variant}`} src={images.logo} alt='...'/>
    )
}

Logo.propTypes = {
    variant: PropTypes.string
};
Logo.defaultProps = {
    variant: ''
};
