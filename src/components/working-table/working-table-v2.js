import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import {Breadcrumbs, Button, makeStyles, Table, TableBody, TableHead, TableRow} from "@material-ui/core";
import {NavigateNext as NavigateNextIcon} from "@material-ui/icons";


const useStyles = makeStyles(() => ({
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


function isFolder(item) {
    return typeof item === 'string'
}

function isFile(item) {
    return typeof item === 'object' && item.directory;
}


function isSubPath(childPath, fullPath) {
    return fullPath.length > childPath.length && fullPath.slice(0, childPath.length).toString() === childPath.toString()
}

function haveFolderNameInPath(fullPath, path, folderName) {
    return isSubPath(path, fullPath) && folderName === fullPath[path.length]
}


function isFileInPath(directory, currentPath) {
    return directory.length === currentPath.length && directory.toString() === currentPath.toString();
}


export default function WorkingTableV2(props) {
    //const dragFolderIcon = document.createElement('i');
    const dragGhost = document.createElement('div');
    const {files, setFiles, renderFiles, renderFolders, renderHeaders, dragDisplayProperty, setFileById} = props;
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
    }, [currentPath, files.byId]);


    function generateFolders(path) {
        const currentFolderList = [];
        console.log('generateFolders', files, path);
        files.byId.forEach(id => {
            const {directory} = files.byHash[id];
            if (directory && isSubPath(currentPath, directory)) {
                const folderName = directory[path.length];
                if (!currentFolderList.includes(folderName)) {
                    currentFolderList.push(folderName);
                }
            }
        });
        setCurrentFolders(currentFolderList)
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
            if (id && files.byHash[id]) {
                let directory = [...files.byHash[id].directory, folder];
                setFileById && setFileById(id, {...files.byHash[id], directory})
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
                setFileById && setFileById(id, {...files.byHash[id], directory: []});
            }

            if (id && files.byHash[id]) {
                let directory = [...files.byHash[id].directory];
                directory.splice(index + 1, currentPath.length - index - 1);
                setFileById && setFileById(id, {...files.byHash[id], directory});
            }
        }
    }

    function handleDragOverFolder(event, folder) {
        setCurrentDragOver(folder);
        preProcessDragOver(event);
    }


    function privateRenderFolders(folder, index) {
        return (
            <TableRow key={`folder${folder}${index}`} draggable='true'
                      onClick={() => setCurrentPath([...currentPath, folder])}
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
        if (isFileInPath(files.byHash[fileId].directory, currentPath))
            return (
                <TableRow key={`file${fileId}${index}`} draggable='true'
                          onDragStart={(event) => onStart(event, files.byHash[fileId])}
                          onDragEnd={() => setCurrentDragOver(null)}
                          onDrop={() => hideGhost()}>
                    {renderFiles && renderFiles(fileId, index)}
                </TableRow>
            )
    }

    function renderBreadcrumb(breadcrumb, index) {
        return (<Button draggable='true'
                        key={`breadcrumb'${breadcrumb}${index}`}
                        onDrop={() => handleDropInBreadcrumbs(breadcrumb, index)}
                        onClick={() => setCurrentPath(prev => prev.slice(0, index + 1))}>
                {breadcrumb}
            </Button>
        )
    }

    return (<div onDragOver={preProcessDragOver} className={classes.tableWrapper}>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small"/>}>
            <Button draggable='true'
                    key={`breadcrumb'${-1}`}
                    onDrop={() => handleDropInBreadcrumbs(null, -1)}
                    onClick={() => setCurrentPath([])}>Home</Button>
            {currentPath.map(renderBreadcrumb)}
        </Breadcrumbs>
        <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table" size='medium'>
            <TableHead>
                <TableRow>
                    {renderHeaders && renderHeaders()}
                </TableRow>
            </TableHead>
            <TableBody>
                {currentFolders.map(privateRenderFolders)}
                {files && files.byId && files.byId.map(privateRenderFiles)}
            </TableBody>
        </Table>
    </div>)
}

WorkingTableV2.propTypes = {
    files: PropTypes.any,//must have name and directory properties
    //folders: PropTypes.array.required,
    setFiles: PropTypes.func,
    setFileById: PropTypes.func,
    //setCurrentFolders: PropTypes.func.required,
    renderFiles: PropTypes.func,
    renderFolders: PropTypes.func,
    renderHeaders: PropTypes.func,
    dragDisplayProperty: PropTypes.string
};
