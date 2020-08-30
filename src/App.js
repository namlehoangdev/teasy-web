import React, { useState, useEffect } from 'react';
import './App.css';
import { Grid, Paper, List, Input, Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import a from './temp';
import { act } from 'react-dom/test-utils';

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'row'
  },
  result: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing(5),
    backgroundColor: '#cfd8dc'
  },
  search: {
    width: theme.spacing(50),
    marginTop: theme.spacing(10),
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  button: {

    marginTop: 'auto',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  item: {
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  tt: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row'
  }
}));

function App() {
  const classes = useStyles();
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState(null);

  useEffect(() => {
    // Update the document title using the browser API
  }, [searchValue]);

  function removeAccents(str) {

    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  function searchStringInArray(str) {
    let rs = [];
    if (str === '') return;
    for (let j = 0; j < a.length; j++) {
      if (removeAccents(a[j]["HO_TEN"]).toLocaleLowerCase().match(removeAccents(str).toLocaleLowerCase())) {
        rs.push(a[j])
      };
    }
    setSearchResults(rs);
  }

  function onChange(event) {
    setSearchValue(event.target.value);
  }

  return (
    // <Reading></Reading>
    <Box display="flex" flexDirection="column" alignItems="center" height="100vh" bgcolor="#cfd8dc">
      <Box display="flex" flexDirection="row" alignItems="center"
        className={classes.header}>
        <Typography
          color='secondary'
          className={classes.tt}
          variant="h4" gutterBottom>
          <Typography
            className={classes.tt}
            color='primary'
            variant="h4" gutterBottom>
            Tra cứu điểm thi ĐH
      </Typography>
          {'THEO TÊN'}
          <Typography
            className={classes.tt}
            color='primary'
            variant="h4" gutterBottom>
            tỉnh Phú Yên
      </Typography>
        </Typography>

      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center" width='100%' bgcolor="#cfd8dc">
        <Input
          placeholder="Nhập tên thí sinh.."
          className={classes.search}
          value={searchValue}
          onChange={onChange}
        >
        </Input>
        <Button
          size="small"
          className={classes.button}
          onClick={() => { searchStringInArray(searchValue) }}
          variant="contained" color="primary">
          Soi Điểm
        </Button>
      </Box>
      <Box display="flex" className={classes.result}>
        <Grid container spacing={3}>

          {
            // eslint-disable-next-line react/jsx-key
            searchResults.map(student => <Grid item xs={6}>
              <Paper className={classes.item}>
                <Typography variant="h6" gutterBottom>
                  {student["HO_TEN"]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {student["NGAY_SINH"]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {student["DIEM_THI"]}
                </Typography>
              </Paper>
            </Grid>)
          }
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
