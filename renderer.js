/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 15:03:34
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-13 19:32:21
 * @FilePath: /vscode projects/Electron/hello-world/renderer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// const NOTIFICATION_TITLE = 'Title'
// const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
// const CLICK_MESSAGE = 'Notification clicked!'

// new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
//   .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE

// 从剪切板获取查询文本
window.electronAPI.getSearchWord((event, words) => {
    vue.isSetting = false;
    if(words){
        vue.$refs.dictionaryPanel.words = words;
        vue.$refs.dictionaryPanel.search();
    }
    vue.$refs.dictionaryPanel.searchInputFocus();
});

// 显示设置面板
window.electronAPI.showSettingPanel((event, value) => {
    vue.isSetting = value;
});

// 截图翻译
window.electronAPI.getSearchImage((event, img) => {
    vue.$refs.dictionaryPanel.img2Text(img);
});