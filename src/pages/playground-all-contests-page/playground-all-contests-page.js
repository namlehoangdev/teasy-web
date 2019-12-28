import React, {useEffect, useState} from 'react';
import {
    makeStyles,
    Button,
    fade,
    Paper,
    Typography,
    Grid,Link,
    Container, CircularProgress,InputBase,Divider
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
import {isNullOrEmpty, isoToLocalDateString, msToTime, trimSign} from "../../utils";
import Countdown from 'react-countdown-now';
import {useHistory} from "react-router";
import {CONTEST_TYPE_CODE, CONTEST_TYPE_TEXT, PAGE_PATHS} from "../../consts";
import Calculator from 'components/calculator/component/App';
import Collapse from "@material-ui/core/Collapse";
import PlaygroundContestItem from './playground-contest-item';
import Slider from "react-slick";
import {Search as SearchIcon} from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        display:'flex',
        flexDirection:'column'
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
    hotContest:{
      display:'flex',
      flexDirection:"row"
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
    searchContainer:{
      display:'flex',
      alignSelf:'center',
      marginTop: theme.spacing(2)
    },
    circle:{
      alignSelf:'center',
    },
    cateContainer:{
      display:'flex',
      flexDirection:'column'
    }
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
    const [searchValue, setSearchValue] = useState('');
    const [selectedCate, setSelectedCate] = useState('Mới nhất');

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
        // console.log('history: ', history);
        history.push(`${PAGE_PATHS.waiting}?contestId=${id}`);
        //history.push({pathname: `${PAGE_PATHS.playground} /${PAGE_PATHS.compete}`, state: {contestId: id}});
    }


    function renderContest(id) {
        const params = contests.byHash[id];
        return (<PlaygroundContestItem isLoading={isShowCircleLoading} {...params} onItemClick={handleItemClick}/>)
    }

    function handleCateClicked(item){
      setSelectedCate(item);
    }

    function renderCateContest(item) {
    return (<Link underline={(item===selectedCate) ? 'always' : 'hover'} onClick={()=>{handleCateClicked(item)}}>{item}</Link>)
    }

    
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    function handleSearchInputChange(event) {
        setSearchValue(event.target.value);
    }

    function sortContests(a,b){
      if(selectedCate === 'Mới nhất')
        return moment(contests.byHash[b].createdAt).diff(moment(contests.byHash[a].createdAt), "ms")
      else if(selectedCate === 'Hot nhất')
        return contests.byHash[b].joinedPerson - contests.byHash[a].joinedPerson
      else if(selectedCate === 'Sắp diễn ra')
        return moment(contests.byHash[b].startAt).diff(contests.byHash[a].startAt, "ms")
    }

    return (<div className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
               <Typography gutterBottom className={classes.searchContainer} variant="h5" component="h5">
                          Cuộc thi từ cộng đồng
                </Typography>   
             <div className={classes.searchContainer}>
               <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon/>
                </div>
                <InputBase
                    placeholder="Tìm kiếm cuộc thi…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                    value={searchValue}
                    onChange={handleSearchInputChange}
                />
               </div>
             </div>
            <Divider variant="middle" />
            <Grid container spacing={3}>
                <Grid item xs={12} md={7} lg={8} alignItems='center' justify='center'
                      style={{display: 'flex', flexDirection: 'row', marginLeft:'auto', marginRight:'auto', marginTop: 10}}>
                    {isShowCircleLoading && <CircularProgress/>}
                </Grid>
                <Grid item xs={10} >
                    {[...contests.byId].filter(id => trimSign(contests.byHash[id].name.toLowerCase()).includes(trimSign(searchValue.toLowerCase()))).sort((a,b) => sortContests(a,b)).map(renderContest)}
                </Grid>

                <Grid item xs={2} >
                    <Typography gutterBottom className={classes.searchContainer} variant="h5" component="h5">
                          Sắp xếp
                     </Typography> 
                    <div className={classes.cateContainer}>
                      {['Mới nhất', 'Hot nhất','Sắp diễn ra'].map((item) => renderCateContest(item))}
                    </div>
                </Grid>
                
            </Grid>
        </Container>
    </div>)
}
