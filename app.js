const { app, BrowserWindow } = require('electron')
const Ant = require('ant-plus');
var usbStick = new Ant.GarminStick2;
var hbSensor = new Ant.HeartRateSensor(usbStick);
process.heartRate = 0;
usbStick.on('startup', function () {hbSensor.attach(0, 0)});
if (!usbStick.open()){process.exit()}


function createWindow() {
    const win = new BrowserWindow({
        width: 100,
        height: 100,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
    hbSensor.on('hbData', function (data) {
        win.webContents.send('store-data', data.ComputedHeartRate);
    });

}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})