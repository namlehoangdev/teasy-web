import {CONTEST_TYPE_CODE, CONTEST_TYPE_TEXT} from "../../consts";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton, makeStyles,
    Table, TableCell,
    TableRow,
    Typography
} from "@material-ui/core";
import moment from "moment";
import {isNullOrEmpty, isoToLocalDateString, msToTime} from "../../utils";
import {Folder as FolderIcon, ExpandMore as ExpandMoreIcon} from "@material-ui/icons";
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";
import React from "react";
import Countdown from "react-countdown-now";
import Button from "@material-ui/core/Button";
import Display from '../../components/calculator/component/Display';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
    root: {
      marginLeft:'auto',
      marginRight:'auto',
      display: 'flex',
      alignItems:'center',
      justifyContent:'center',
      marginBottom: theme.spacing(3)
    },
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

    card: {
      width: theme.spacing(80),
    },
    media: {
      maxHeight: theme.spacing(20),
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: theme.palette.primary,
    },
    actionContainer:{
      display:'flex',
      flexDirection:'column',
      marginLeft:'auto',
      marginTop:'auto'
    },
    vaophong:{
      marginLeft:'auto',
    },
    joiner:{
      marginLeft:'auto'
    },
    contentContainer:{
      display:'flex',
      flexDirection:'row',
    },
    createdBy:{
      position:'absolute',
      paddingBottom: theme.spacing(1),
      width: theme.spacing(50)
    },
    des:{
      paddingBottom: theme.spacing(2),
      maxWidth:theme.spacing(50)
    }

}));


export default function PlaygroundContestItem(props) {
    const {id, isLoading, name, backgroundUrl, onItemClick, description, type = CONTEST_TYPE_CODE.ELSE, startAt, joinedPerson = 0, createdAt, isPublic, code, isSecured, duration, password, permittedUsers, ownerName, test} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    function handleItemClick() {
        onItemClick && onItemClick(id);
    }

    return (
        <Grid className={classes.root} item xs={12} md={7} lg={8}>
            <Card className={classes.card}>
                {isLoading ? <Skeleton variant="rect" className={classes.media} height={120} /> : <CardMedia
                    component='img'
                    className={classes.media}
                    src={backgroundUrl || 'https://tech4gamers.com/wp-content/uploads/2019/05/How-To-Use-Tech-To-Overcome-Competition.png'}
                    title="Paella dish"
                />}
                <CardContent className={classes.contentContainer}>
                    <div>
                      {isLoading ? <Skeleton variant="rect" width={150} height={10}/> : <div>
                        {moment(startAt).year() === 1 ? <Typography variant="body2" color="primary" component="p">
                          Đang mở
                      </Typography> : ((moment(startAt).diff(moment.utc(), "ms") + duration) < 0 ? <Typography variant="body2" color="textSecondary" component="p">
                          Đã kết thúc
                      </Typography> : <Typography variant="body2" color="secondary" component="p">
                          {moment(startAt).locale('vi').format('llll').toUpperCase()}
                      </Typography>)
                      }
                      </div>}
                      { isLoading ? <Skeleton variant="rect" width={150} height={10}/> : <Typography variant="h5" component="h5">
                          {name && name}
                      </Typography> }                                
                      {type !== CONTEST_TYPE_CODE.ELSE &&
                      <Typography variant="body1" color="textSecondary" component="p">
                          Thể loại {CONTEST_TYPE_TEXT[type]}
                      </Typography>}
                      {!isLoading && <div>
                        {!isNullOrEmpty(description) ? <Typography className={classes.des} variant="body2" color="textSecondary" component="p">
                          {description.length > 100 ? description.substring(0, 100) + "..." : description}
                      </Typography> : <Typography className={classes.des} variant="body2" color="textSecondary" component="p">
                      </Typography>
                      }
                      </div>}
                      { isLoading ? <Skeleton variant="rect" className={classes.createdBy} width={150} height={10}/> : <Typography className={classes.createdBy} variant="body2" color="textSecondary" component="p">
                            Tạo bởi {ownerName}
                      </Typography>}
                    </div>
                
                   <CardActions className={classes.actionContainer}>
                      {isLoading ? <Skeleton variant="rect" className={classes.vaophong} width={100} height={15}/> : <div>
                        {((moment(startAt).diff(moment.utc(), "ms") + duration) > 0 ||  moment(startAt).year() === 1) && <Button className={classes.vaophong} size="small" color="primary" onClick={handleItemClick}>
                          Vào phòng thi
                        </Button>}
                        </div>}
                      {isLoading ? <Skeleton variant="rect" className={classes.joiner} width={70} height={10}/> : <Typography className={classes.joiner}  variant="body2" color="textSecondary" component="p">
                          {joinedPerson} {`lượt thi`}
                      </Typography>}
                   </CardActions>

                </CardContent>         
            </Card>
        </Grid>)
}
