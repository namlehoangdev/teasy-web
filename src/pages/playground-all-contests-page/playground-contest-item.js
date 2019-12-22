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

    card: {},
    media: {
        maxHeight: 300
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
        <Grid item xs={12} md={7} lg={8}>
            <Card className={classes.card} onClick={handleItemClick}>
                <CardMedia
                    component='img'
                    className={classes.media}
                    src={backgroundUrl || 'https://tech4gamers.com/wp-content/uploads/2019/05/How-To-Use-Tech-To-Overcome-Competition.png'}
                    title="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {moment(startAt).locale('vi').format('llll').toUpperCase()}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        {name && name.toUpperCase()}
                    </Typography>
                    {<Typography variant="body1" color="textSecondary" component="p">
                        {joinedPerson} {`người đã tham gia`.toUpperCase()}
                    </Typography>}
                    {type !== CONTEST_TYPE_CODE.ELSE &&
                    <Typography variant="body1" color="textSecondary" component="p">
                        Thể loại {CONTEST_TYPE_TEXT[type]}
                    </Typography>}
                    {!isNullOrEmpty(description) && <Typography variant="body2" color="textSecondary" component="p">
                        {description}
                    </Typography>}
                </CardContent>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Tạo bởi {ownerName}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={handleItemClick}>
                        Vào phòng chờ
                    </Button>
                </CardActions>
                {/*<CardActions disableSpacing>*/}
                {/*    <IconButton*/}
                {/*        className={clsx(classes.expand, {*/}
                {/*            [classes.expandOpen]: expanded,*/}
                {/*        })}*/}
                {/*        onClick={handleExpandClick}*/}
                {/*        aria-expanded={expanded}*/}
                {/*        aria-label="show more"*/}
                {/*    >*/}
                {/*        <ExpandMoreIcon/>*/}
                {/*    </IconButton>*/}
                {/*</CardActions>*/}
                {/*<Collapse in={expanded} timeout="auto" unmountOnExit>*/}
                {/*    {renderDetail()}*/}
                {/*</Collapse>*/}
            </Card>
        </Grid>)
}
