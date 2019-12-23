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
      maxWidth: theme.spacing(80),
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
    }

}));


export default function PlaygroundContestItem(props) {
    const {id, name, backgroundUrl, onItemClick, description, type = CONTEST_TYPE_CODE.ELSE, startAt, joinedPerson = 0, createdAt, isPublic, code, isSecured, duration, password, permittedUsers, ownerName, test} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    function renderDetail(props) {
        return (<Table size="small">
            <TableRow>
                <TableCell className={classes.detailCell}>Tên cuộc thi</TableCell>
                <TableCell className={classes.detailCell}>{name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.detailCell}>Mô tả</TableCell>
                <TableCell className={classes.detailCell}>{description}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.detailCell}>Trạng thái</TableCell>
                <TableCell className={classes.detailCell}>{isPublic ? 'công khai' : 'riêng tư'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.detailCell}>Người tạo</TableCell>
                <TableCell className={classes.detailCell}>{ownerName}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.detailCell}>Thời gian bắt đầu</TableCell>
                <TableCell
                    className={classes.detailCell}>{isoToLocalDateString(startAt)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.detailCell}>Diễn ra trong</TableCell>
                <TableCell className={classes.detailCell}>{msToTime(duration)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className={classes.detailCell}>Ngày tạo</TableCell>
                <TableCell className={classes.detailCell}>{isoToLocalDateString(createdAt)}</TableCell>
            </TableRow>
        </Table>)
    }

    function handleItemClick() {
        onItemClick && onItemClick(id);
    }

    return (
        <Grid className={classes.root} item xs={12} md={7} lg={8}>
            <Card className={classes.card} onClick={handleItemClick}>
                <CardMedia
                    component='img'
                    className={classes.media}
                    src={backgroundUrl || 'https://tech4gamers.com/wp-content/uploads/2019/05/How-To-Use-Tech-To-Overcome-Competition.png'}
                    title="Paella dish"
                />
                <CardContent className={classes.contentContainer}>
                    <div>
                      <Typography variant="body2" color="textSecondary" component="p">
                          {moment(startAt).locale('vi').format('llll').toUpperCase()}
                      </Typography>
                      <Typography variant="h5" component="h5">
                          {name && name}
                      </Typography>                                 
                      {type !== CONTEST_TYPE_CODE.ELSE &&
                      <Typography variant="body1" color="textSecondary" component="p">
                          Thể loại {CONTEST_TYPE_TEXT[type]}
                      </Typography>}
                      {!isNullOrEmpty(description) ? <Typography variant="body2" color="textSecondary" component="p">
                          {description.length > 20 ? description.substring(0, 20) + "..." : description}
                      </Typography> : <Typography variant="body2" color="textSecondary" component="p">
                          ...
                      </Typography>
                      }
                      <Typography variant="body2" color="textSecondary" component="p">
                            Tạo bởi {ownerName}
                      </Typography>
                    </div>
                
                   <CardActions className={classes.actionContainer}>
                      <Button className={classes.vaophong} size="small" color="primary" onClick={handleItemClick}>
                          Vào phòng thi
                      </Button>
                      <Typography className={classes.joiner}  variant="body2" color="textSecondary" component="p">
                          {joinedPerson} {`lượt thi`}
                      </Typography>
                   </CardActions>

                </CardContent>         
            </Card>
        </Grid>)
}
