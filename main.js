const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const contextMenu = require('electron-context-menu');
app.commandLine.appendSwitch('enable-tcp-fastopen')
app.commandLine.appendSwitch('widevine-cdm-version', '1.4.9.1088')
const path = require('path');
let pluginName
switch (process.platform) {
 case 'win32':
   pluginName = './drmlib/libwidevinecdm.dll'
   break
 case 'darwin':
   pluginName = './drmlib/libwidevinecdm.dylib'
   break
 case 'linux':
   pluginName = './drmlib/libwidevinecdm.so'
   break
}

contextMenu({
	prepend: (defaultActions, params, browserWindow, dictionarySuggestions) => [
		{
			label: 'Search Google for “{selection}”',
			// Only show it when right-clicking text
			visible: params.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
			}
		}
	]
});

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 750,
    icon: __dirname + '/icon.png',
    backgroundColor: '#2C2C2C',
    webPreferences: {
     contextIsolation: true,
     spellcheck: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('splash.html')
  setTimeout(function () {
    mainWindow.loadURL('https://www.netflix.com/browse');
  }, 3000) // Load store page after 3 secs
  mainWindow.maximize() // start maximized
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setMenu(null)
  mainWindow.show();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('widevine-ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
