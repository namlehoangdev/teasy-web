import React, {useEffect, useState} from 'react';
import {Button, IconButton, Input, makeStyles, Typography} from '@material-ui/core';
import storage from "../../Firebase/index";
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CancelIcon from '@material-ui/icons/Cancel';
import uuidv4 from 'uuid/v4';

const useStyles = makeStyles(theme => ({
    root: {
        width: '40%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        marginLeft: theme.spacing(2)
    },
    "@keyframes fadeAnimation": {
        from: {opacity: 0},
        to: {opacity: 1},
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },

    paperAnim: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        animation: "3s $fadeAnimation",
    },

    criteria: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    tickIcon: {
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1),
    },
    picker: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    fileInput: {
        display: 'flex',
        flexDirection: 'row'
    },
    input: {
        width: '100%',
    },
    fileName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: theme.spacing(2)
    },
    name: {}
}))

function ImageUpload(props) {
    const {
        category, onUploaded = () => {
        }, userId, buttonLabel
    } = props;
    const classes = useStyles();
    const [imageFile, setImageFile] = useState({name: ''});
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [off, setOff] = useState(true);

    //const [imageId, setImageId] = useState(uuidv4());

    function handleChange(e) {
        console.log('event on change: ', e);
        setProgress(0);
        if (e.target.files[0]) {
            const image = e.target.files[0];
            setImageFile(image)
        }
    }

    useEffect(() => {
        if (progress === 0 && imageFile.name !== '') {
            handleUpload();
        }
    }, [imageFile.name]);

    function handleUpload() {
        setOff(false);
        const image = imageFile;
        const imageId = uuidv4();
        const uploadTask = storage.ref(`${category}/${userId}/${imageId}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            error => {
                // Error function ...
                setOff(true)
                onUploaded(error)
            },
            () => {
                // complete function ...
                storage
                    .ref(`${category}/${userId}`)
                    .child(imageId)
                    .getDownloadURL()
                    .then(u => {
                        setOff(true)
                        setUrl(u);
                        onUploaded(u)
                    });
            }
        );
    }

    function handleClose() {
        setImageFile({name: ''});
        setProgress(0);
    }

    return (
        <div className={classes.root}>
            {off === false && <LinearProgress variant="determinate" value={progress}/>}
            <div className={classes.picker}>
                <Button component="label"
                        color="default"
                    //onClick={progress === 0 && imageFile.name !== '' && handleUpload}
                        startIcon={progress === 100 ? <CloudDoneIcon color="action"/> :
                            <CloudUploadIcon color="action"/>}
                >
                    {(imageFile.name === '' || progress === 100) && <Input
                        className={classes.input}
                        type="file"
                        onChange={handleChange}
                        disableUnderline={true}
                        style={{display: "none"}}
                        inputProps={{accept: 'audio/*'}}
                    />}
                    {imageFile.name === '' && buttonLabel}
                    {progress === 100 && "Tải thành công"}
                    {progress !== 100 && imageFile.name !== '' && "Tải lên"}
                </Button>
                {imageFile.name && <div className={classes.fileName}>
                    <Typography className={classes.name}>{imageFile.name.substring(0, 10) + "..."}</Typography>
                    <IconButton onClick={handleClose} color="primary" aria-label="upload picture" component="span">
                        <CancelIcon/>
                    </IconButton>
                </div>}
            </div>

        </div>
    );
}

ImageUpload.propTypes = {
    category: PropTypes.any,
    onUploaded: PropTypes.func,
    userId: PropTypes.any,
    competitionId: PropTypes.any,
    buttonLabel: PropTypes.any
}

export default ImageUpload;
