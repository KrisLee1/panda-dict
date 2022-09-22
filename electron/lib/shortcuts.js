/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-06 22:05:27
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-13 19:30:05
 * @FilePath: /VSCodeProjects/Electron/card-dict/electron/modules/shortcut-key.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { screen, BrowserWindow, desktopCapturer } = require('electron');
const robot = require('robotjs');
const { createCaptureWindow, createMainWindow } = require('./create_windows');

const shortcutKeys = {};

// 快捷显示窗口
const shortcutShowWindow = (focus) => {

    if(BrowserWindow.mainWindow.isDestroyed()) createMainWindow();

    const cursorPoint = screen.getCursorScreenPoint();
    const win = BrowserWindow.mainWindow;
    const screenBounds = screen.getDisplayNearestPoint(cursorPoint).bounds;
    const windowBounds = win.getBounds();

    if (cursorPoint.x + windowBounds.width > screenBounds.width){
        cursorPoint.x -= windowBounds.width;
    }
    if (cursorPoint.y + windowBounds.height > screenBounds.height){
        cursorPoint.y -= windowBounds.height;
    }
    
    win.setPosition(cursorPoint.x, cursorPoint.y, true);
    focus ? win.show() : win.showInactive();
}

// 快捷输入查询
const shortcutOpenSearch = () => {
    shortcutShowWindow(true);
    BrowserWindow.mainWindow.webContents.send('search-words');
}

// 快捷剪切板查询
const shortcutClipboardSearch = () => {
    const { clipboard } = require('electron');

    // 自动复制
    const cmdKey = process.platform === 'darwin' ? 'command' : 'control';
    robot.keyTap('c', cmdKey);
    
    shortcutShowWindow(true);
    // 等待文本复制到剪切板
    setTimeout(() => {
        const words = clipboard.readText();
        BrowserWindow.mainWindow.webContents.send('search-words', words);
    }, 100);
}

// 快捷截图查询
const shortcutCaptureImageSearch = () => {
    if(BrowserWindow.captureWindow.isDestroyed()) createCaptureWindow();
    if(BrowserWindow.captureWindow.isVisible()) return;

    const cursorPoint = screen.getCursorScreenPoint();
    const { id, size, scaleFactor } = screen.getDisplayNearestPoint(cursorPoint);

    // 显示截屏窗口
    BrowserWindow.captureWindow.setAlwaysOnTop(true, 'screen-saver');
    BrowserWindow.captureWindow.setBounds({x: 0, y: 0, width: size.width, height: size.height});
    BrowserWindow.captureWindow.show();

    desktopCapturer.getSources({ 
        types: ['screen'], 
        thumbnailSize: {
            width: size.width * scaleFactor, 
            height: size.height * scaleFactor
        } 
    }).then(async sources => {
        for (const source of sources) {
            if (source.display_id == id) {
                BrowserWindow.captureWindow.webContents.send('capture-screen', { sourceId: source.id, ...size, scaleFactor });
                break;
            }
        }
    }).catch((error) => console.error(error));
}

module.exports = { 
    shortcutKeys, 
    shortcutOpenSearch, 
    shortcutClipboardSearch,
    shortcutCaptureImageSearch,
    shortcutShowWindow
};