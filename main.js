console.log('main process is running');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 650,});
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    })    
}

app.on('ready', createWindow);

app.on('window-all-closed', () =>{
    if (process.platform != 'darwin'){
        app.quit()
    }
})

app.on('activate', () =>{
    if (mainWindow === null){
        createWindow()
    }
})
