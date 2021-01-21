// Native
import { join, resolve } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, nativeImage, clipboard, Notification } from 'electron'
import isDev from 'electron-is-dev'

type CopyArg = {
  dataUrl: string
}

ipcMain.on('copy', (_, arg: CopyArg) => {
  console.log(`copy ipc event received`);
  const image = nativeImage.createFromDataURL(arg.dataUrl);
  clipboard.writeImage(image);

  const n = new Notification({
    title: 'animekun',
    body: `copied! ${image.getSize().width}x${image.getSize().height}`,
    icon: image,
  })
  n.show()
  setTimeout(() => {
    n.close()
  }, 500);
})


const showWindow = () => {
  const mainWindow = new BrowserWindow({
    title: 'relights',
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  const url = format({
      pathname: join(__dirname, 'renderer.html'),
      protocol: 'file:',
      slashes: true,
    })
  const inputFile = resolve(isDev ? process.argv[2] : process.argv[1])
  const urlWithParam = `${url}?inputFile=${inputFile}`;
  console.log(urlWithParam)
  mainWindow.loadURL(urlWithParam)
  return mainWindow;
}

// Prepare the renderer once the app is ready
//@ts-ignore TS6133: 'mainWindow' is declared but its value is never read.
let mainWindow: BrowserWindow | null = null;
app.on('ready', async () => {
  mainWindow = showWindow();
})
