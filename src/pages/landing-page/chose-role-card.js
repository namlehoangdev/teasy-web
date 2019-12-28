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
    marginBottom: theme.spacing(2)
  },
  tickIcon: {
    marginRight: theme.spacing(1)
  },
  cardMedia:{
    height:theme.spacing(20)
  },
  gridCard:{
    marginTop:-theme.spacing(5),
  },
  cardContent:{
     height:theme.spacing(20)
  }
}))
  ;


function ChoseRoleCard() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.authReducer);
  const {language} = useSelector(state => state.settingReducer);

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
        <Grid className={classes.gridCard} item xs={6} sm={6}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                className={classes.cardMedia}
                image="https://cdn.vietnambiz.vn/thumb_w/685/2019/12/4/photo-1-15754715097782086394465-crop-15754715601931924426073.jpg"
                title="Contemplative Reptile"
              />
              <CardContent className={classes.cardContent}>
                <Typography style={{marginBottom:17}} noWrap gutterBottom variant="h5" component="h2">
                  {language.gotoPlayground}
                </Typography>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography noWrap variant="body2" color="textSecondary" component="p">
                    {language.easyCompetitionCompete}
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography noWrap variant="body2" color="textSecondary" component="p">
                    {language.easyPublicCompete}
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography noWrap variant="body2" color="textSecondary" component="p">
                    {language.easyManageResult}
                </Typography>
                </div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button fullWidth variant="contained" color="primary"
                onClick={handlePlaygroundClick}>
                {language.joinContest}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid className={classes.gridCard} item xs={6} sm={6}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                className={classes.cardMedia}
                image="https://cdn.vietnambiz.vn/thumb_w/685/2019/12/4/photo-1-15754715097782086394465-crop-15754715601931924426073.jpg"
                title="Contemplative Reptile"
              />
              <CardContent className={classes.cardContent}>
                <Typography style={{marginBottom:17}} noWrap gutterBottom variant="h5" component="h2">
                  {language.gotoAdmin}
                </Typography>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography noWrap variant="body2" color="textSecondary" component="p">
                    {language.easyContestCreate}
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography noWrap variant="body2" color="textSecondary" component="p">
                    {language.easyTestCreate}
                </Typography>
                </div>
                <div className={classes.criteria}>
                  <CheckIcon className={classes.tickIcon} color="primary"></CheckIcon>
                  <Typography noWrap variant="body2" color="textSecondary" component="p">
                    {language.easyQuestionCreate}
                </Typography>
                </div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button fullWidth variant="contained" color="primary"
                onClick={handleAdminPageClick}>
                {language.createContest}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={12}>
          <Button fullWidth variant="contained" color="primary"
            onClick={handleAdminPageClick}>
            {language.gotoAdmin}
          </Button>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Button fullWidth variant="contained" color="primary"
            onClick={handlePlaygroundClick}>
            {language.gotoPlayground}
          </Button>
        </Grid> */}
      </Grid>
    </div>
  )
}


export default ChoseRoleCard;
