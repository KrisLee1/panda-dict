<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 22:15:03
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-17 21:05:21
 * @FilePath: /vscode projects/Electron/card-dict/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="settingPanel">
        <div class="wrapper">
            <!-- 返回主界面 -->
            <button class="backMainBtn box button" @click.stop="backMain">
                返回主界面
            </button>

            <!-- 翻译 -->
            <h4 class="settingItemTitle">翻译</h4>
            <TranslationSettingItem 
                :translation="settingConfig['translation']"
            />

            <!-- 界面 -->
            <h4 class="settingItemTitle">界面</h4>
            <AppearanceSettingItem 
                :appearance="settingConfig['appearance']" 
                :themes="themes"
            />

            <!-- 翻译API -->
            <h4 class="settingItemTitle">API</h4>
            <APISettingItem 
                :apis="settingConfig['APIs']"
            />

            <!-- 快捷键 -->
            <h4 class="settingItemTitle">快捷键</h4>
            <ShortcutSettingItem 
                :shortcutKeys="settingConfig['shortcutKeys']" 
                @updateKeys="handelUpdateKeys($event)"
            />
        </div>
    </div>
</template>

<script>
import APISettingItem from './APISettingItem.vue';
import ShortcutSettingItem from './ShortcutSettingItem.vue';
import AppearanceSettingItem from './AppearanceSettingItem.vue';
import TranslationSettingItem from './TranslationSettingItem.vue';
export default {
    name: "SettingPanel",
    props: ["settingConfig"],
    components: {
    APISettingItem,
    ShortcutSettingItem,
    AppearanceSettingItem,
    TranslationSettingItem
},
    data() {
        return {
            themes: [
                {name: '默认', value: ''},
                {name: '卡通', value: 'cartoonTheme'},
                {name: '青竹', value: 'bambooTheme'}
            ]
        };
    },
    methods: {
        backMain() {
            // 保存设置配置
            localStorage.setItem("setting-config", JSON.stringify(this.settingConfig));
            this.$emit("updateSetting", this.settingConfig);
            this.$emit("back", false);
        },
        handelUpdateKeys(keys) {
            this.settingConfig['shortcutKeys'] = keys;
            localStorage.setItem("setting-config", JSON.stringify(this.settingConfig));
        },
    }
}
</script>

<style scoped>
#settingPanel {
    width: 100%;
    height: fit-content;
    min-height: 100%;
    padding: .5rem;
    /* padding-top: 30px; */
    overflow-y: auto;
    scroll-behavior: smooth;
}

#settingPanel .wrapper {
    min-width: 10rem;
    max-width: 30rem;
    margin: 0 auto;
}

.backMainBtn {
    font-size: 1rem;
    width: 100%;
    height: 2.4rem;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: .4rem;
    transition: color 800ms ease,
                border 800ms ease,
                background-color 800ms ease;
}

.backMainBtn:hover {
    color: var(--theme-color);
}

.settingItemTitle {
    padding: .5rem 0 0 .5rem;
    text-align: start;
}


@media (prefers-color-scheme: light) {
    .backMainBtn {
        color: #000;
    }

}
</style>
