import React, {useEffect, useState} from 'react';
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
    Checkbox
} from "@material-ui/core";
import EnhancedTableHead from "./enhanced-table-head";
import EnhancedTableToolbar from "./enhanced-table-toolbar";
import {PAGE_PATHS} from "../../consts";
import {SpeedDial, SpeedDialIcon, SpeedDialAction} from '@material-ui/lab';
import {useHistory} from "react-router";
import {TEXT} from "../../consts";
import {useDispatch, useSelector} from "react-redux";
import {
    CreateNewFolder as CreateNewFolderIcon,
    PostAdd as PostAddIcon,
    NavigateNext as NavigateNextIcon
} from '@material-ui/icons'
import {getOwnContests, setOpenAdminFullscreenDialog} from "../../actions";
import adminReducer from "../../reducers/admin-reducer";
import useClickAndDoubleClick from "../../utils/use-click-and-double-click";

function createData(id, name, isFolder, startDate, status) {
    return {id, name, isFolder, startDate, status};
}

const rows = [
    createData(1, 'Cupcake', true, '14/10/2019', true),
    createData(2, 'Donut', false, '14/10/2019', false),
    createData(3, 'Eclair', true, '14/10/2019', true),
    createData(4, 'Frozen yoghurt', false, '14/10/2019', false),
    createData(5, 'Gingerbread', true, '14/10/2019', false),
    createData(6, 'Honeycomb', true, '14/10/2019', true),
    createData(7, 'Ice cream sandwich', false, '14/10/2019', true),
    createData(8, 'Jelly Bean', true, '14/10/2019', true),
    createData(9, 'KitKat', false, '14/10/2019', false),
    createData(10, 'Lollipop', false, '14/10/2019', true),
    createData(11, 'Marshmallow', false, '14/10/2019', false),
    createData(12, 'Nougat', false, '14/10/2019', false),
    createData(13, 'Oreo', true, '14/10/2019', true)
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

    const {contests: contestReducer} = useSelector(state => state.adminReducer);
    const {entities, result: ownedContestIds} = contestReducer;
    const {contests} = entities;

    const [selectedItems, setSelectedItems] = React.useState([]);
    const [enableSelectMode, setEnableSelectMode] = React.useState(false);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(getOwnContests());
    }, []);

    function handleCreateNewFolderClick() {
    }

    function handleCreateNewContestClick() {
        dispatch(setOpenAdminFullscreenDialog(true));
        history.push(`${PAGE_PATHS.createContest}`)
    }

    const handleRequestSort = (event, property) => {
        console.log('order by :', orderBy, property);

        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            setSelectedItems(rows.map(newItem => newItem.name));
            return;
        }
        setSelectedItems([]);
    };

    const handleItemClick = (event, name) => {
        if (!enableSelectMode) {
            console.log('not enable selected mode');
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
                      onClick={event => handleEnhancedClick(event, row)}
                      onDoubleClick={handleEnhanceDoubleClick}
                //onClick={event => handleClick(event, row.name)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}>
                <TableCell padding="checkbox">
                    {enableSelectMode && <Checkbox checked={isItemSelected} inputProps={{'aria-labelledby': labelId}}/>}
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

    function handleItemDoubleClick(event) {
        console.log(event);
    }

    const [handleEnhancedClick, handleEnhanceDoubleClick] = useClickAndDoubleClick(handleItemClick, handleItemDoubleClick);

    return (<div className={classes.root}>
            <Backdrop open={openSpeedDial} timeout={Infinity}/>
            <SpeedDial ariaLabel="Tạo mới" open={openSpeedDial} className={classes.speedDial} icon={<SpeedDialIcon/>}
                       onClose={() => setOpenSpeedDial(false)} onOpen={() => setOpenSpeedDial(true)}>
                <SpeedDialAction key={0} title={TEXT.folder} icon={<CreateNewFolderIcon/>}
                                 onClick={handleCreateNewFolderClick}/>
                <SpeedDialAction key={1} title={TEXT.contest} icon={<PostAddIcon/>}
                                 onClick={handleCreateNewContestClick}/>
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
                <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table" size='medium'>
                    <EnhancedTableHead classes={classes}
                                       numSelected={selectedItems.length}
                                       order={order} orderBy={orderBy}
                                       onSelectAllClick={handleSelectAllClick}
                                       onRequestSort={handleRequestSort}
                                       rowCount={ownedContestIds.length}/>
                    <TableBody> {stableSort(rows, getSorting(order, orderBy)).map(renderContestTableRows)} </TableBody>
                </Table>
            </div>

        </div>
    );
}
