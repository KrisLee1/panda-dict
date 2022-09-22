<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 22:15:03
 * @LastEditors: KrisLee 2030000020@qq.com
 * @LastEditTime: 2022-09-22 17:14:49
 * @FilePath: /vscode projects/Electron/card-dict/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :id="settingConfig.appearance.theme">
    <div id="titleBar">
      <!-- 控制按钮 -->
      <div class="winControlBox" :class="settingConfig.appearance.controlBtnPosition">
        <button class="winControlBtn closeWinBtn" @click.stop="hideWin" title="关闭" >
          <img src="./assets/image/close_icon.png" alt="">
        </button>
        <button class="winControlBtn minimizeWinBtn" @click.stop="minimizeWin" title="最小化" >
          <img src="./assets/image/minimize_icon.png" alt="" />
        </button>
        <button class="winControlBtn topWinBtn" @click.stop="topWin" title="置顶" >
          <img v-show="isTopWin" src="./assets/image/top_icon_1.png" alt="" />
          <img v-show="!isTopWin" src="./assets/image/top_icon_0.png" alt="" />
        </button>
      </div>
      <!-- 标题 -->
      <h4 class="title">{{ title }}</h4>
    </div>

    <div class="main-container">
      <Transition name="panel">
        <!-- 词典 -->
        <DictionaryPanel 
          v-show="!isSetting" 
          ref="dictionaryPanel" 
          :toLanguage="settingConfig.translation['toLanguage']"
          :apis="settingConfig['APIs']"
          @toSetting="isSetting=$event"
        />
      </Transition>
      
      <Transition name="panel">
        <!-- 设置 -->
        <SettingPanel 
          v-show="isSetting"
          @back="isSetting=$event" 
          :settingConfig="settingConfig"
          @updateSetting="settingConfig=$event"
        />
      </Transition>
    </div>

  </div>
</template>

<script>
  import DictionaryPanel from './components/DictionaryPanel.vue';
  import SettingPanel from './components/SettingPanel.vue';
  export default {
    name: 'App',
    components: {
        DictionaryPanel,
        SettingPanel
    },
    data() {
      return {
        title: '',
        isSetting: false,
        isTopWin: false,
        settingConfig: {
          topWin: false,
          translation: {
            toLanguage: 'auto'
          },
          appearance: {
            theme: '',
            controlBtnPosition: 'controlBtnPositionLeft'
          },
          APIs: {
            translateAPI: {
              accessKey: '',
              secretKey: ''
            },
            ocrAPI:{
              accessKey: '',
              secretKey: ''
            }
          },
          shortcutKeys: {
            open: ['Alt', 'D'],
            search: ['Alt', 'A'],
            imgSearch: ['Alt', 'S']
          }
        }
      }
    },
    mounted() {
      // 获取设置数据
      const configData = JSON.parse(localStorage.getItem('setting-config') || '{}');
      this.settingConfig = {...this.settingConfig, ...configData};
      // 注册快捷键
      window.electronAPI.setShortcutOpenSearchKeys(this.settingConfig.shortcutKeys['open'].join('+'));
      window.electronAPI.setShortcutClipboardSearchKeys(this.settingConfig.shortcutKeys['search'].join('+'));
      window.electronAPI.setShortcutImageSearchKeys(this.settingConfig.shortcutKeys['imgSearch'].join('+'));

      this.settingConfig.topWin && this.topWin();
    },
    watch: {
      isSetting(){
        if(this.isSetting) 
          this.title = '设置';
        else 
          this.title = '';
      }
    },
    methods: {
      hideWin(){
        window.electronAPI.hideWin();
      },
      minimizeWin(){
        window.electronAPI.minimizeWin();
      },
      topWin(){
        this.isTopWin = !this.isTopWin;
        this.settingConfig.topWin = this.isTopWin;
        localStorage.setItem("setting-config", JSON.stringify(this.settingConfig));
        window.electronAPI.topWin(this.isTopWin);
      }
    }
  }
  </script>

<style scoped>
#titleBar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  z-index: 10000;
  /* -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px); */
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

#titleBar .winControlBox {
  height: 30px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  position: absolute;
}
#titleBar .controlBtnPositionRight {
  right: 0;
  flex-direction: row-reverse;
}

#titleBar .winControlBtn {
  width: 16px;
  height: 16px;
  border-radius: 12px;
  margin: 3px;
  border: 0;
  overflow: hidden;
  outline: none;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: none;
  background: rgb(60, 60, 60, .5);
  transition: background-color .6s ease;
}

#titleBar .winControlBtn img {
  width: 8px;
  opacity: 0;
  transition: opacity .6s ease;
}

#titleBar .winControlBox:hover img{
  opacity: 1;
}


#app:hover .closeWinBtn {
  background-color: rgb(255, 74, 74);
}

#app:hover .minimizeWinBtn {
  background-color: rgb(255, 195, 44);
}

#app:hover .topWinBtn {
  background-color: rgb(40, 200, 64);
}

#titleBar .title{
  word-break: keep-all;
  overflow: hidden;
  padding: 0 82px;
}

.main-container {
  height: 100vh;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.panel-enter-active,
.panel-leave-active {
  position: absolute;
  transition: all .3s ease-out;
}
.panel-enter-from,
.panel-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

@media (prefers-color-scheme: light) {
  #titleBar .winControlBtn {
    background-color: #DEDEDE90;
  }
}
</style>
