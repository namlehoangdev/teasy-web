import React, {useState, useEffect} from 'react';

function isFolder(item) {
    return typeof item === 'string'
}

function isSamePath(directory, currentPath) {
    return directory.slice(0, currentPath.length).toString() === currentPath.toString()
}


export default function WorkingTable(props) {
    const dragGhost = document.createElement('div');
    const {files, setFiles} =props;

    const [dragItem, setCurrentDrag] = useState(null);
    const [currentDragOver, setCurrentDragOver] = useState(null);
    const [files, setFiles] = useState();
    const [currentPath, setCurrentPath] = useState([]);
    const [currentFolders, setCurrentFolders] = useState([]);


    useEffect(() => {
        dragGhost.id = 'drag-ghost';
        dragGhost.textNode = "Dragging";
        document.body.appendChild(dragGhost);
        return function cleanup() {
            document.body.removeChild(dragGhost);
        };
    });

    useEffect(() => {
        generateCurrentFolders(currentPath);
    }, [currentPath, files]);


    function generateCurrentFolders(path) {
        const currentFolderList = [];
        files.forEach(item => {
            if (item.directory && item.directory.length > path.length && isSamePath(item.directory, currentPath)) {
                const folderName = item.directory[path.length];
                if (!currentFolderList.includes(folderName)) {
                    currentFolderList.push(folderName);
                }
            }
        });
        setCurrentFolders(currentFolderList)
    }


    function onStart(event, item) {
        event.dataTransfer.effectAllowed = "move";
        dragGhost.style.display = 'block';
        if (isFolder(item)) {
            dragGhost.innerText = item;
            setCurrentDrag(item);
        } else {
            dragGhost.innerText = item.name;
            setCurrentDrag(item);
        }
        event.dataTransfer.setDragImage(dragGhost, -20, -20);
    };

    function hideGhost() {
        dragGhost.style.display = 'none';
        setCurrentDragOver(null);
    }


    function handleDropInFolder(folder) {
        hideGhost();
        if (isFolder(dragItem)) {
            const newCompetitions = files.map(file => {
                if (isSamePath(file.directory, currentPath)) {
                    if (dragItem === file.directory[currentPath.length]) {
                        let directory = [...file.directory];
                        directory.splice(currentPath.length, 0, folder);
                        return {...file, directory: directory};
                    }
                }
                return file;
            });
            setFiles(newCompetitions);
        } else {
            let i = files.findIndex(item => item.id === dragItem.id);
            i !== -1 && setFiles(produce(draft => {
                draft[i].directory.push(folder);
            }))
        }
    }

    function handleDragOverFolder(event, folder) {
        setCurrentDragOver(folder);
        event.preventDefault();
        return false;
    }


    function renderFolders(folder, index) {
        return (
            <tr key={`folder${folder}`}
                draggable='true'
                onClick={() => setCurrentPath([...currentPath, folder])}
                onDragStart={(event) => onStart(event, folder)}
                onDragEnd={() => setCurrentDragOver(null)}
                onDrop={(event) => handleDropInFolder(folder)}
                onDragOver={(event) => handleDragOverFolder(event, folder)}
                className={currentDragOver === folder && folder ? 'folder-hover' : ''}>
                <td>{folder}</td>
                <td/>
                <td/>
            </tr>
        )
    }


    function renderFiles(item, index) {
        if (!item.directory)
            return;
        if (item.directory.length === currentPath.length && item.directory.toString() === currentPath.toString())
            return (
                <tr key={`file${item.name}`}
                    draggable='true'
                    onDragStart={(event) => onStart(event, item)}
                    onDragEnd={() => setCurrentDragOver(null)}
                    onDrop={() => hideGhost()}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.directory}</td>
                </tr>
            )
    }

    function renderBreadcrumb() {
        return (
            <div>
                <button onClick={() => {
                    setCurrentPath([])
                }}>Home
                </button>
                {currentPath.map((item, index) =>
                    (<span key={`breadcrumb'${item}${index}`}
                           draggable='true'
                           style={{width: 200, height: 30, backgroundColor: 'red', marginRight: 30}}
                           onDrop={() => {
                               if (isFolder(dragItem)) {
                                   const newCompetitions = files.map(file => {
                                       if (isSamePath(file.directory, currentPath) && dragItem === file.directory[currentPath.length]) {
                                           let directory = [...file.directory];
                                           directory.splice(index + 1, currentPath.length - index - 1);
                                           return {...file, directory: directory};
                                       }
                                       return file;
                                   });
                                   setFiles(newCompetitions);
                               } else {
                                   let i = files.findIndex(item => item.id === dragItem.id);
                                   i !== -1 && setFiles(produce(draft => {
                                       draft[i].directory.splice(index + 1, currentPath.length - index - 1);
                                   }))

                               }
                           }}
                           onClick={() => setCurrentPath(prev => prev.slice(0, index + 1))}>
                    {item}
                    </span>))}
            </div>
        )
    }

    return (<div onDragOver={event => {
        event.preventDefault();
        return false
    }}>
        {renderBreadcrumb()}
        <table id="customers">
            <thead>
            <tr>
                <th>name</th>
                <th>price</th>
                <th>dir</th>
            </tr>
            </thead>
            <tbody>
            {currentFolders.map(renderFolders)}
            {files.map(renderFiles)}
            </tbody>
        </table>
    </div>)
}
