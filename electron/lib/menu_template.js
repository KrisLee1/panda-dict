/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-06 21:39:24
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-15 02:36:49
 * @FilePath: /VSCodeProjects/Electron/card-dict/electron/menu_template.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { BrowserWindow, app, Menu } = require('electron');
const { shortcutOpenSearch, shortcutClipboardSearch, shortcutCaptureImageSearch } = require('./shortcuts');

// 设置系统菜单
const appMenu = Menu.buildFromTemplate([
    {
        label: app.name,
        submenu: [
            {
                label: '关于胖哒词典',
                click: () => app.showAboutPanel()
            },
            {
                label: '偏好设置',
                click: () => {
                    BrowserWindow.mainWindow.webContents.send('setting', true);
                    BrowserWindow.mainWindow.show();
                }
            },
            // {
            //     label: '调试工具',
            //     click: () => BrowserWindow.mainWindow.webContents.openDevTools()
            // },
            {
                label: '退出胖哒词典',
                click: () => app.quit()
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
            { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
            { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
            { label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]
    },
    {
        label: '查询',
        submenu: [
            {
                label: '输入查询',
                click: () => shortcutOpenSearch()
            },
            {
                label: '从剪切板查询',
                click: () => shortcutClipboardSearch()
            },
            {
                label: '截图查询',
                click: () => shortcutCaptureImageSearch()
            }
        ]
    }
]); 

// 托盘菜单
const contextMenu = Menu.buildFromTemplate([
    {
        label: '输入查询',
        click: () => shortcutOpenSearch()
    },
    {
        label: '从剪切板查询',
        click: () => shortcutClipboardSearch()
    },
    {
        label: '截图查询',
        click: () => shortcutCaptureImageSearch()
    },
    {
        label: '偏好设置',
        click: () => {
            BrowserWindow.mainWindow.webContents.send('setting', true);
            BrowserWindow.mainWindow.show();
        }
    },
    {
        label: '关于胖哒词典',
        click: () => app.showAboutPanel()
    },
    // {
    //     label: '调试工具',
    //     click: () => BrowserWindow.mainWindow.webContents.openDevTools()
    // },
    {
        label: '退出胖哒词典',
        click: () => app.quit()
    }
]);

module.exports = { appMenu, contextMenu };
