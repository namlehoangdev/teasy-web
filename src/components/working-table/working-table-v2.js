import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
//import produce from 'immer';
import {
    Breadcrumbs,
    Button,
    makeStyles,
    Table,
    TableBody,
    TableHead,
    TableRow,
    CircularProgress, TableCell
} from "@material-ui/core";
import {Folder as FolderIcon, NavigateNext as NavigateNextIcon} from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";


const useStyles = makeStyles((theme) => ({
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
    loadingTable: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(45),
    }
}));


function isFolder(item) {
    return typeof item === 'string'
}

function isFile(item) {
    return typeof item === 'object' && item.directory;
}


function isSubPath(childPath, fullPath) {
    return fullPath.length > childPath.length && fullPath.slice(0, childPath.length).toString() === childPath.toString()
}

// function haveFolderNameInPath(fullPath, path, folderName) {
//     return isSubPath(path, fullPath) && folderName === fullPath[path.length]
// }


function isFileInPath(directory, currentPath) {
    return directory.length === currentPath.length && directory.toString() === currentPath.toString();
}


export default function WorkingTableV2(props) {
    //const dragFolderIcon = document.createElement('i');
    const dragGhost = document.createElement('div');
    const {
        filesByHash, selectedFilesHash, filesById, dragDisplayProperty, setFileById, draggable,
        onFileClick, onFolderClick, isLoading, numberOfColumns = 4, numberOfSkeletonRows = 15,
        renderFiles, renderFolders, renderHeaders, renderLoadingSkeleton,
    } = props;
    const [dragItem, setCurrentDrag] = useState(null);
    const [currentDragOver, setCurrentDragOver] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentFolders, setCurrentFolders] = useState([]);
    const classes = useStyles();


    useEffect(() => {
        //..dragFolderIcon.id = 'drag-folder-icon';
        dragGhost.id = 'drag-ghost';
        dragGhost.textNode = "Dragging";
        document.body.appendChild(dragGhost);

        return function cleanup() {
            document.body.removeChild(dragGhost);
        };
    });

    useEffect(() => {
        generateFolders(currentPath);
    }, [currentPath, filesById]);


    function generateFolders(path) {
        const currentFolderList = [];
        if (!filesById) {
            return;
        }
        filesById.forEach(id => {
            const {directory} = filesByHash[id];
            if (directory && isSubPath(currentPath, directory)) {
                const folderName = directory[path.length];
                if (!currentFolderList.includes(folderName)) {
                    currentFolderList.push(folderName);
                }
            }
        });
        setCurrentFolders(currentFolderList);
    }


    function preProcessDragOver(event) {
        event.preventDefault();
        return false
    }

    function hideGhost() {
        dragGhost.style.display = 'none';
        setCurrentDragOver(null);
    }

    function onStart(event, item) {
        event.dataTransfer.effectAllowed = "move";
        dragGhost.style.display = 'block';
        dragGhost.innerText = isFolder(item) ? item : item[dragDisplayProperty.toString()];
        setCurrentDrag(item);
        event.dataTransfer.setDragImage(dragGhost, -20, -20);
    }

    function handleDropInFolder(folder) {
        hideGhost();
        if (isFile(dragItem)) {
            const {id} = dragItem;
            if (id && filesByHash[id]) {
                let directory = [...filesByHash[id].directory, folder];
                setFileById && setFileById(id, {...filesByHash[id], directory})
            }
        } else {
            return;
            // const newCompetitions = files.map(file => {
            //     let directory = [...file.directory];
            //     if (haveFolderNameInPath(directory, currentPath, dragItem)) {
            //         directory.splice(currentPath.length, 0, folder);
            //         return {...file, directory: directory};
            //     }
            //     return file;
            // });
            // setFiles(newCompetitions);
        }
    }

    function handleDropInBreadcrumbs(breadcrumb, index) {
        if (isFolder(dragItem)) {
            return;
            // const newCompetitions = files.map(file => {
            //     let directory = [...file.directory];
            //     if (haveFolderNameInPath(directory, currentPath, dragItem)) {
            //         directory.splice(index + 1, currentPath.length - index - 1);
            //         return {...file, directory: directory};
            //     }
            //     return file;
            // });
            // setFiles(newCompetitions);
        } else {
            const {id} = dragItem;
            if (!breadcrumb) {
                setFileById && setFileById(id, {...filesByHash[id], directory: []});
            }

            if (id && filesByHash[id]) {
                let directory = [...filesByHash[id].directory];
                directory.splice(index + 1, currentPath.length - index - 1);
                setFileById && setFileById(id, {...filesByHash[id], directory});
            }
        }
    }

    function handleDragOverFolder(event, folder) {
        setCurrentDragOver(folder);
        preProcessDragOver(event);
    }


    function privateRenderFolders(folder, index) {
        return (
            <TableRow key={`folder${folder}${index}`} draggable={draggable}
                      onClick={() => {
                          setCurrentPath([...currentPath, folder]);
                          onFolderClick(folder, index);
                      }}
                      onDragStart={(event) => onStart(event, folder)}
                      onDragEnd={() => setCurrentDragOver(null)}
                      onDrop={() => handleDropInFolder(folder)}
                      onDragOver={(event) => handleDragOverFolder(event, folder)}
                      className={currentDragOver === folder && folder ? 'folder-hover' : ''}>
                {renderFolders && renderFolders(folder, index)}
            </TableRow>
        )
    }


    function privateRenderFiles(fileId, index) {
        if (isFileInPath(filesByHash[fileId].directory || [], currentPath))
            return (
                <TableRow key={`file${fileId}${index}`} draggable={draggable}
                          selected={!!selectedFilesHash[fileId]}
                          onDragStart={(event) => onStart(event, filesByHash[fileId])}
                          onDragEnd={() => setCurrentDragOver(null)}
                          onClick={() => onFileClick(fileId)}
                          onDrop={() => hideGhost()}>
                    {renderFiles && renderFiles(fileId, index)}
                </TableRow>
            )
    }

    function renderBreadcrumb(breadcrumb, index) {
        return (<Button draggable={draggable}
                        key={`breadcrumb'${breadcrumb}${index}`}
                        onDrop={() => handleDropInBreadcrumbs(breadcrumb, index)}
                        onClick={() => setCurrentPath(prev => prev.slice(0, index + 1))}>
                {breadcrumb}
            </Button>
        )
    }

    function _renderLoadingSkeleton() {
        if (renderLoadingSkeleton) {
            return renderLoadingSkeleton();
        }
        const skeletonRows = Array.from(new Array(numberOfSkeletonRows), (val, index) => index);
        console.log(skeletonRows);
        const skeletonColumns = Array.from(new Array(numberOfColumns), (val, index) => index);
        return skeletonRows.map((item, index) =>
            (<TableRow key={`skeleton-row${index}`}>
                {skeletonColumns.map((column, i) =>
                    (<TableCell key={`skeleton-column${i}`} align="left">
                        <Skeleton variant="rect" width='100%' height={20}/>
                    </TableCell>))}
            </TableRow>));
    }

    function renderBody() {
        if (!filesById || (filesById.length === 0 && currentFolders.length === 0)) {
            return (!isLoading && <TableRow className={classes.loadingTable}>Không có gì để hiển thị</TableRow>)
        }
        return (<React.Fragment>
            {currentFolders.map(privateRenderFolders)}
            {filesByHash && filesById && filesById.map(privateRenderFiles)}
        </React.Fragment>)
    };

    return (<div onDragOver={preProcessDragOver} className={classes.tableWrapper}>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small"/>}>
            {/* <Button draggable={draggable}
                    key={`breadcrumb'${-1}`}
                    onDrop={() => handleDropInBreadcrumbs(null, -1)}
                    onClick={() => setCurrentPath([])}>Home</Button> */}
            {currentPath.map(renderBreadcrumb)}
        </Breadcrumbs>
        <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table" size='medium'>
            <TableHead>
                <TableRow>
                    {renderHeaders && renderHeaders()}
                </TableRow>
            </TableHead>
            {/*{isLoading && <div className={classes.loadingTable}><CircularProgress/></div>}*/}
            <TableBody>
                {isLoading ? _renderLoadingSkeleton() : renderBody()}
            </TableBody>
        </Table>
    </div>)
}

WorkingTableV2.propTypes = {
    filesByHash: PropTypes.any,//must have name and directory properties
    filesById: PropTypes.any,//must have name and directory properties
    selectedFilesHash: PropTypes.any,
    //folders: PropTypes.array.required,
    setFiles: PropTypes.func,
    setFileById: PropTypes.func,
    //setCurrentFolders: PropTypes.func.required,
    renderFiles: PropTypes.func,
    renderFolders: PropTypes.func,
    renderHeaders: PropTypes.func,
    dragDisplayProperty: PropTypes.string,
    onFileClick: PropTypes.func,
    onFolderClick: PropTypes.func,
    draggable: PropTypes.bool,

};

WorkingTableV2.defaultProps = {
    setFiles: () => {
    },
    setFileById: () => {
    },
    onFileClick: () => {
    },
    onFolderClick: () => {
    },
    selectedFilesHash: {},
    draggable: true
};
