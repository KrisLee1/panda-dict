/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-13 19:14:36
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-15 00:58:34
 * @FilePath: /VSCodeProjects/Electron/card-dict/electron/lib/icons.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const path = require('path');
const { nativeImage } = require('electron');

const appIcon = nativeImage.createFromPath(path.join(__dirname, '../images/win_tray_icon.png'));

const trayIconSrc = process.platform === 'darwin' ? '../images/mac_tray_icon.png' : '../images/win_tray_icon.png'
const trayIcon = nativeImage.createFromPath(path.join(__dirname, trayIconSrc));

module.exports = {
    appIcon,
    trayIcon
}