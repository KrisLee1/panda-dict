/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-13 18:38:28
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-17 22:07:08
 * @FilePath: /VSCodeProjects/Electron/card-dict/electron/lib/create_windows.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { BrowserWindow, Menu, ipcMain, globalShortcut,screen } = require('electron');
const path = require('path');
const { appMenu } = require('./menu_template');
const { shortcutKeys, shortcutOpenSearch, shortcutClipboardSearch, shortcutCaptureImageSearch, shortcutShowWindow } = require('./shortcuts');
const { appIcon } = require('./icons');

const NODE_ENV = process.env.NODE_ENV;
const URL = NODE_ENV === 'development' ? 'http://localhost:5173' : `file://${path.join(__dirname, '../../dist/index.html')}`;


// 主窗口
const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 340,
        height: 400,
        resizable: true,
        show: false,
        frame: false,
        icon: appIcon,
        vibrancy: 'hud',
        visualEffectState: 'active',
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, '../preload.js')
        }
    });

    // 设置系统菜单
    Menu.setApplicationMenu(appMenu);

    // 隐藏窗口
    ipcMain.on('hide-win', (event) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.hide();
    });

    // 最小化窗口
    ipcMain.on('minimize-win', (event) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.minimize();
    });

    // 置顶窗口
    ipcMain.on('top-win', (event, value) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.setAlwaysOnTop(value,'modal-panel');
    });

    // 注册剪切板查询快捷键
    ipcMain.on('set-shortcut-clipboard-search-keys', (event, value) => {
        const oldKey = shortcutKeys['set-shortcut-clipboard-search-keys'];
        // 注销原有快捷键
        oldKey && globalShortcut.unregister(oldKey);
        // 注册新快捷键
        value && globalShortcut.register(value, shortcutClipboardSearch);
        // 记录快捷键
        shortcutKeys['set-shortcut-clipboard-search-keys'] = value;
    });

    // 注册打开查询快捷键
    ipcMain.on('set-shortcut-open-search-keys', (event, value) => {
        const oldKey = shortcutKeys['set-shortcut-open-search-keys'];
        // 注销原有快捷键
        oldKey && globalShortcut.unregister(oldKey);
        // 注册新快捷键
        value && globalShortcut.register(value, shortcutOpenSearch);
        // 记录快捷键
        shortcutKeys['set-shortcut-open-search-keys'] = value;
    });

    // 注册截图查询快捷键
    ipcMain.on('set-shortcut-image-search-keys', (event, value) => {
        const oldKey = shortcutKeys['set-shortcut-image-search-keys'];
        // 注销原有快捷键
        oldKey && globalShortcut.unregister(oldKey);
        // 注册新快捷键
        value && globalShortcut.register(value, shortcutCaptureImageSearch);
        // 记录快捷键
        shortcutKeys['set-shortcut-image-search-keys'] = value;
    });

    // mainWindow.loadFile('dist/index.html');
    mainWindow.loadURL(URL);
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })

    // 开发环境打开开发者工具
    if (NODE_ENV === 'development') mainWindow.webContents.openDevTools();

    BrowserWindow.mainWindow = mainWindow;
}

// 截屏窗口
const createCaptureWindow = () => {
    const cursorPoint = screen.getCursorScreenPoint();
    const { size } = screen.getDisplayNearestPoint(cursorPoint);
    captureWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        transparent: true,
        show: false,
        resizable: false,
        movable: false,
        frame: false,
        skipTaskbar: true,
        enableLargerThanScreen: true,
        hasShadow: false,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js')
        }
    });

    // captureWindow.webContents.openDevTools();

    captureWindow.loadURL(`file://${path.join(__dirname, 'screen_capture.html')}`);

    captureWindow.on('hide', () => {
        captureWindow.setSimpleFullScreen(false);
    });

    ipcMain.on('no-capture-permission', () => {
        captureWindow.hide();
    });

    ipcMain.on('captured', (event) => {
        captureWindow.setSimpleFullScreen(true);
    });

    ipcMain.on('capture-image', (event, image) => {
        captureWindow.hide();
        BrowserWindow.mainWindow.webContents.send('search-image', image);
        shortcutShowWindow(true);
    });

    globalShortcut.register('Esc', () => {
        if (captureWindow) {
            captureWindow.hide();
            captureWindow.loadURL(`file://${path.join(__dirname, 'screen_capture.html')}`);
        }
    })

    BrowserWindow.captureWindow = captureWindow;
}

module.exports = {
    createMainWindow,
    createCaptureWindow
}