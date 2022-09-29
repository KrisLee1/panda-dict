/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 13:31:46
 * @LastEditors: KrisLee 2030000020@qq.com
 * @LastEditTime: 2022-09-29 20:54:01
 * @FilePath: /vscode projects/Electron/hello-world/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { app, BrowserWindow, globalShortcut, Tray } = require('electron');
const { createMainWindow, createCaptureWindow } = require('./lib/create_windows')
const { contextMenu } = require('./lib/menu_template');
const { appIcon, trayIcon } = require('./lib/icons');

let tray = null;

app.whenReady().then(() => {
    // 系统托盘
    tray = new Tray(trayIcon);

    // 设置托盘菜单
    tray.setContextMenu(contextMenu);
    tray.setToolTip('胖哒词典');
    
    tray.on('click', () => {
        if(process.platform !== 'darwin'){
            if(BrowserWindow.mainWindow.isDestroyed()) {
                createMainWindow();
            } else if(!BrowserWindow.mainWindow.isVisible()) {
                BrowserWindow.mainWindow.show();
            }
        }
    });

}).then(() => {
    createMainWindow();
    createCaptureWindow();
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    } else if(!BrowserWindow.mainWindow.isVisible()) {
        BrowserWindow.mainWindow.show();
    }
});

app.on('will-quit', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll();
    // 销毁托盘图标
    tray.destroy();
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

