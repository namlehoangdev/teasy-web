import React from 'react';
import { Button, Grid, makeStyles, Typography, Card, CardActionArea, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { TEXT, PAGE_PATHS, LOGIN_MODE } from "../../consts";
import { useHistory } from "react-router";
import { updateLoginMode } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from '@material-ui/icons/Check';
//
const useStyles = makeStyles(theme => ({
  "@keyframes fadeAnimation": {
    from: { opacity: 0 },
    to: { opacity: 1 },
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
  }
}))
  ;


function ChoseRoleCard() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.authReducer);

  function handleAdminPageClick() {
    dispatch(updateLoginMode(LOGIN_MODE.admin));
    history.push(PAGE_PATHS.admin);
  }

  function handlePlaygroundClick() {
    dispatch(updateLoginMode(LOGIN_MODE.playground));
    history.push(PAGE_PATHS.playground);
  }


  return (
    <div className={token ? classes.paperAnim : classes.paper}>
      <Grid container spacing={2} direction="row" >
        <Grid item xs={6} sm={6}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image="https://cdn.vietnambiz.vn/thumb_w/685/2019/12/4/photo-1-15754715097782086394465-crop-15754715601931924426073.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {TEXT.gotoAdmin}
                </Typography>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Tạo cuộc thi dễ dàng
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Tạo đề thi đa dạng
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Quản lý ngân hàng câu hỏi
                </Typography>
                </div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button fullWidth variant="contained" color="primary"
                onClick={handleAdminPageClick}>
                {TEXT.createContest}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image="https://cdn.vietnambiz.vn/thumb_w/685/2019/12/4/photo-1-15754715097782086394465-crop-15754715601931924426073.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {TEXT.gotoPlayground}
                </Typography>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Tham gia thi dễ dàng
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Đề thi đạng từ cộng đồng
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Quản lý kết quả thi hiệu quả
                </Typography>
                </div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button fullWidth variant="contained" color="primary"
                onClick={handlePlaygroundClick}>
                {TEXT.joinContest}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={12}>
          <Button fullWidth variant="contained" color="primary"
            onClick={handleAdminPageClick}>
            {TEXT.gotoAdmin}
          </Button>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Button fullWidth variant="contained" color="primary"
            onClick={handlePlaygroundClick}>
            {TEXT.gotoPlayground}
          </Button>
        </Grid> */}
      </Grid>
    </div>
  )
}


export default ChoseRoleCard;
