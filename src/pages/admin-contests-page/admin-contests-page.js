import React, {useState} from 'react';
import './admin-contests-page.scss'
import {
    Button,
    CssBaseline,
    Backdrop,
    makeStyles,
    Breadcrumbs,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Checkbox
} from "@material-ui/core";
import EnhancedTableHead from "./enhanced-table-head";
import EnhancedTableToolbar from "./enhanced-table-toolbar";
import {PATH} from "../../consts";
import {SpeedDial, SpeedDialIcon, SpeedDialAction} from '@material-ui/lab';
import {useHistory, useRouteMatch} from "react-router";
import {TEXT} from "../../consts";
import {useDispatch} from "react-redux";
import {
    CreateNewFolder as CreateNewFolderIcon,
    PostAdd as PostAddIcon,
    NavigateNext as NavigateNextIcon
} from '@material-ui/icons'
import {setOpenAdminFullscreenDialog} from "../../actions";

function createData(name, isFolder, startDate, status) {
    return {name, isFolder, startDate, status};
}

const rows = [
    createData('Cupcake', true, '14/10/2019', true),
    createData('Donut', false, '14/10/2019', false),
    createData('Eclair', true, '14/10/2019', true),
    createData('Frozen yoghurt', false, '14/10/2019', false),
    createData('Gingerbread', true, '14/10/2019', false),
    createData('Honeycomb', true, '14/10/2019', true),
    createData('Ice cream sandwich', false, '14/10/2019', true),
    createData('Jelly Bean', true, '14/10/2019', true),
    createData('KitKat', false, '14/10/2019', false),
    createData('Lollipop', false, '14/10/2019', true),
    createData('Marshmallow', false, '14/10/2019', false),
    createData('Nougat', false, '14/10/2019', false),
    createData('Oreo', true, '14/10/2019', true)
];

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));


export default function AdminContestPage() {
    //const {path} = useRouteMatch();
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [enableSelectMode, setEnableSelectMode] = React.useState(false);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    // function handleClose() {
    //     history.goBack();
    //     dispatch(setOpenAdminFullscreenDialog(false));
    // }

    function handleCreateNewFolderClick() {
    }

    function handleCreateNewContestClick() {
        dispatch(setOpenAdminFullscreenDialog(true));
        history.push(`${PATH.createContest}`)
    }

    const handleRequestSort = (event, property) => {
        console.log('order by :', orderBy, property);

        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.name);
            setSelectedItems(newSelecteds);
            return;
        }
        setSelectedItems([]);
    };

    const handleClick = (event, name) => {
        if (!enableSelectMode) {

        } else {
            const selectedIndex = selectedItems.indexOf(name);
            let newSelected = [];
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selectedItems, name);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selectedItems.slice(1));
            } else if (selectedIndex === selectedItems.length - 1) {
                newSelected = newSelected.concat(selectedItems.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selectedItems.slice(0, selectedIndex),
                    selectedItems.slice(selectedIndex + 1),
                );
            }
            setSelectedItems(newSelected);
        }
    };

    const isSelected = name => selectedItems.indexOf(name) !== -1;

    function renderContestTableRows(row, index) {
        const isItemSelected = isSelected(row.name);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow key={row.name}
                      hover role="checkbox"
                      onClick={event => handleClick(event, row.name)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}>
                <TableCell padding="checkbox">
                    {enableSelectMode ? (
                        <Checkbox checked={isItemSelected} inputProps={{'aria-labelledby': labelId}}/>)}
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" padding="none">
                    {row.name}
                </TableCell>
                <TableCell align="left">{row.isFolder ? 'a' : 'b'}</TableCell>
                <TableCell align="left">{row.startDate}</TableCell>
                <TableCell align="left">{row.status ? 'a' : 'b'}</TableCell>
            </TableRow>
        );
    }


    return (<div className={classes.root}>
            <Backdrop open={openSpeedDial}/>
            <SpeedDial ariaLabel="Tạo mới" open={openSpeedDial} className={classes.speedDial} icon={<SpeedDialIcon/>}
                       onClose={() => setOpenSpeedDial(false)} onOpen={() => setOpenSpeedDial(true)}>
                <SpeedDialAction key={0} icon={<CreateNewFolderIcon/>} onClick={handleCreateNewFolderClick}/>
                <SpeedDialAction key={1} icon={<PostAddIcon/>} onClick={handleCreateNewContestClick}/>
            </SpeedDial>
            <div className={classes.header}>
            </div>
            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small"/>}>
                <Button>asd</Button>
                <Button>asd</Button>
            </Breadcrumbs>
            <CssBaseline/>
            <EnhancedTableToolbar numSelected={selectedItems.length} title={TEXT.contest}/>
            <div className={classes.tableWrapper}>
                <Table className={classes.table}
                       aria-labelledby="tableTitle"
                       aria-label="enhanced table"
                       size='medium'>
                    <EnhancedTableHead classes={classes}
                                       numSelected={selectedItems.length}
                                       order={order}
                                       orderBy={orderBy}
                                       onSelectAllClick={handleSelectAllClick}
                                       onRequestSort={handleRequestSort}
                                       rowCount={rows.length}/>
                    <TableBody> {stableSort(rows, getSorting(order, orderBy)).map(renderContestTableRows)} </TableBody>
                </Table>
            </div>

        </div>
    );
}
