const electron = require('electron');

const app = electron.app;

var BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', function () {
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1000,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  /*mainWindow.webContents.on('did-fail-load', () => {
    console.log('did-fail-load');
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
    // REDIRECT TO FIRST WEBPAGE AGAIN
      });*/

});

