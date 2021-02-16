const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const {Menu} = require('electron')
const fs = require('fs');
Menu.setApplicationMenu(null);

function createWindow() {
    // 关闭顶部导航菜单栏
    const win = new BrowserWindow({
        width: 1288,
        height: 858,
        // fullscreen:true,//全屏展示
        center: true, // 窗口居中
        resizable: true, // 窗口大小是否可改变
        maximizable: true, // 窗口是否可以最大化
        frame: true, // 是否显示顶部导航栏
        title: '美帮主会员管理系统',
        // backgroundColor: '#fff',
        icon: path.join(__dirname, './zhijia.svg'), // 更换图标， 这里的图标仅支持svg 和icon 图标
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('./app/index.html')
    // win.loadURL('http://localhost:8000/?#/vip')
    // win.webContents.openDevTools()
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


ipcMain.on("on-back-up", (event, data, name) => {
    if (data) {
        const path = require('path');
        const _path = path.join(__dirname, 'backup');
        const fileName = name && `bak_${new Date().getTime()}`
        const file = path.join(_path, `${name || fileName}.json`);

        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }
        fs.writeFile(file, data && JSON.stringify(data), function (err) {
            if (err) {
                event.reply("on-back-up", "文件备份失败，路径：" + file);
                console.log('error:', err);
            } else {
                event.reply("on-back-up", "文件备份成功，路径：" + file);
            }
        })
    }
})

ipcMain.on("on-import", (event, fileName) => {
    if (fileName) {
        const path = require('path');
        const _path = path.join(__dirname, 'backup');
        const file = path.join(_path, fileName);

        if (!fs.existsSync(file)) {
            event.reply("on-import", {
                success: false,
                message: "文件不存在，路径：" + file
            });
        }
        event.reply("on-import", {
            success: true,
            data: require(file)
        });
    }
})
