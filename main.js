const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
//const config = require(__dirname + '/scripts/configReader');
const config = require('./scripts/configReader');

let mainWindow;
let editableFilePath = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        backgroundColor: '#FFF',
        icon: __dirname + '/img/icon.png',
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // load index.html
    mainWindow.loadFile('index.html');

    // handle closing window
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // keyboard shortcuts
    let menu = Menu.buildFromTemplate([
        {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click() {
                // save command
            }
        },
        {
            label: 'Open',
            accelerator: 'CmdOrCtrl+O',
            click() {
                // open command
            }
        },
        {
            label: 'Settings',
            accelerator: 'CmdOrCtrl+F11',
            click() {
                mainWindow.loadFile('./views/settings.html');
            }
        },
        {
            label: 'Dev Tools',
            accelerator: 'CmdOrCtrl+F12',
            click() {
                mainWindow.webContents.openDevTools();
            }
        }
    ]);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
app.on('ready', createWindow);

// disable warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

ipcMain.on('openfile', function() {
    openFile();
});

ipcMain.on('newfile', function() {
    newFile();
});

ipcMain.on('getfilepath', (event, arg) => {
    event.returnValue = editableFilePath;
});

ipcMain.on('getsavepath', (event, arg) => {
    saveFile();
    event.returnValue = editableFilePath;
});

function newFile() {
    editableFilePath = null;
    mainWindow.loadFile(__dirname + '/views/editor.html');
}

function openFile() {
    const files = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'text file', extensions: ['txt'] }]
    });

    // error checking
    if (!files) {
        return;
    }

    editableFilePath = files[0].toString();
    addToRecents(editableFilePath);

    // load editor
    mainWindow.loadFile(__dirname + '/views/editor.html');
}

function saveFile() {
    const path = dialog.showSaveDialogSync(mainWindow, {
        filters: [{ name: 'text file', extensions: ['txt'] }]
    });

    // error checking
    if (!path) {
        return;
    }

    editableFilePath = path;
    addToRecents(editableFilePath);
}

function addToRecents(file) {
    let recentFiles = config.readConfig('files-recent');

    // remove the file from recent if its already in it
    if (recentFiles.includes(file)) {
        recentFiles.splice(recentFiles.indexOf(file), 1);
    }

    // add file to first position of array to keep recent files chronological
    recentFiles.splice(0, 0, file);
    config.writeConfig('files-recent', recentFiles);

    console.log(recentFiles);
}
