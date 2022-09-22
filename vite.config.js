/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 22:15:03
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-11 00:00:40
 * @FilePath: /vscode projects/Electron/card-dict/vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  // server: {
  //   proxy: {
  //     '/translate':{
  //         target: "https://openapi.youdao.com",
  //         changeOrigin: true,
  //         rewrite: (path) => path.replace(/^\/translate/, '/api')
  //     },
  //     '/ocr':{
  //       target: "https://openapi.youdao.com",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/ocr/, '/ocrapi')
  //   },
  //   }
  // }
})

