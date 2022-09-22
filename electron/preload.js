/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 13:51:32
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-12 12:00:02
 * @FilePath: /vscode projects/Electron/hello-world/preload.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector);
//         if(element) element.innerText = text;
//     }

//     for(const dependency of ['chrome', 'node', 'electron']){
//         replaceText(`${dependency}-version`,process.versions[dependency]);
//     }
// });

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSearchWord: (callback) => ipcRenderer.on('search-words',callback),
    getSearchImage: (callback) => ipcRenderer.on('search-image',callback),
    showSettingPanel: (callback) => ipcRenderer.on('setting',callback),
    hideWin: () => ipcRenderer.send('hide-win'),
    minimizeWin: () => ipcRenderer.send('minimize-win'),
    topWin: (value) => ipcRenderer.send('top-win',value),
    setShortcutClipboardSearchKeys: (value) => ipcRenderer.send('set-shortcut-clipboard-search-keys', value),
    setShortcutOpenSearchKeys: (value) => ipcRenderer.send('set-shortcut-open-search-keys', value),
    setShortcutImageSearchKeys: (value) => ipcRenderer.send('set-shortcut-image-search-keys', value),
    captureScreen: (callback) => ipcRenderer.on('capture-screen', callback),
    captured: () => ipcRenderer.send('captured'),
    captureImage: (image) => ipcRenderer.send('capture-image',image),
    noCapturePermission: () => ipcRenderer.send('no-capture-permission')
});