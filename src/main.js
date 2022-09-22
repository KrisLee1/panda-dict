/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 22:15:03
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-07 15:33:56
 * @FilePath: /VSCodeProjects/Electron/card-dict/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import './style.css'
import './theme/cartoon_theme.css'
import './theme/bamboo_theme.css'
import App from './App.vue'

window.vue = createApp(App).mount('#app')
