import React, {useEffect, useState} from 'react';
import {
    makeStyles,
    Button,

    Paper,
    Typography,
    Grid,
    Container, CircularProgress,
} from "@material-ui/core";
import clsx from "clsx";
import {Folder as FolderIcon, MoreVert as MoreVertIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    getPublicContests,
    getSharedContests,
    setOpenPlaygroundFullscreenDialog,
    updateAllContestById,
    updateAllContests
} from "../../actions";
import WorkingTableV2 from "../../components/working-table/working-table-v2";
import moment from 'moment';
import {isNullOrEmpty, isoToLocalDateString, msToTime} from "../../utils";
import Countdown from 'react-countdown-now';
import {useHistory} from "react-router";
import {CONTEST_TYPE_CODE, CONTEST_TYPE_TEXT, PAGE_PATHS} from "../../consts";
import Calculator from 'components/calculator/component/App';
import Collapse from "@material-ui/core/Collapse";
import PlaygroundContestItem from './playground-contest-item';

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    detailCell: {
        borderBottom: 0
    },
    countDownContainer: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'row'
    },
    countDownBox: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
        ...theme.shape,
        borderWidth: theme.spacing(1),
        borderColor: theme.palette.primary.main
    },
    numberCountDown: {
        ...theme.typography.h4
    },
    labelCountDown: {
        ...theme.typography.body1
    },
}));

function StartButtonWrapper(props) {
    const {onMount, onClick} = props;
    useEffect(() => {
        onMount && onMount();
    }, []);

    function handleClick() {
        onClick && onClick();
    }

    return <Button variant="contained" color="primary" onClick={handleClick}>Tham gia thi</Button>
}

export default function PlaygroundAllContestsPage() {
    const {contests} = useSelector(state => state.playgroundReducer) || {};
    const {isShowCircleLoading} = useSelector(state => state.uiEffectReducer);
    const [focusedDetailId, setFocusedDetailId] = useState(-1);
    const [focusedFiles, setFocusedFiles] = useState({});
    const history = useHistory();

    const dispatch = useDispatch();
    const classes = useStyles();
    useEffect(() => {
        dispatch(getSharedContests());
        dispatch(getPublicContests());
    }, []);
    useEffect(() => {
        if (contests.byId.length > 0) {
            setFocusedDetailId(contests.byId[0]);
            setFocusedFiles({[contests.byId[0]]: true});
        }
    }, [contests.byId]);

    function handleItemClick(id) {
        history.push({pathname: `${PAGE_PATHS.waiting}?contestId=${id}`});
        //history.push({pathname: `${PAGE_PATHS.playground}/${PAGE_PATHS.compete}`, state: {contestId: id}});
    }


    function renderContest(id) {
        const params = contests.byHash[id];
        return (<PlaygroundContestItem {...params} onItemClick={handleItemClick}/>)
    }

    return (<div className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={7} lg={8} alignItems='center' justify='center'
                      style={{display: 'flex', flexDirection: 'row'}}>
                    {isShowCircleLoading && <CircularProgress/>}
                </Grid>
                {contests.byId.map(renderContest)}
            </Grid>
        </Container>
    </div>)
}
