<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-07 20:51:02
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-10 01:30:25
 * @FilePath: /VSCodeProjects/Electron/card-dict/src/components/ShortcutSettingItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="shortSettingItem">
        <div class="settingItem box">
            快捷打开:
            <div class="shortcutKeyInput input innerInput" 
                @keydown="setShortcutKey($event,'open')" 
                tabindex="0" 
            >
                <span 
                    class="shortcutKey box"
                    v-for="(item,index) in shortcutKeys['open']" 
                    :key="`key${item}${index}`"
                >
                    {{ formattingKey(item) }}
                </span>
            </div>

            快捷查询:
            <div class="shortcutKeyInput input innerInput" 
                @keydown="setShortcutKey($event,'search')" 
                tabindex="0" 
            >
                <span 
                    class="shortcutKey box"
                    v-for="(item,index) in shortcutKeys['search']" 
                    :key="`key${item}${index}`"
                >
                    {{ formattingKey(item) }}
                </span>
            </div>

            截图查询:
            <div class="shortcutKeyInput input innerInput" 
                @keydown="setShortcutKey($event,'imgSearch')" 
                tabindex="0" 
            >
                <span 
                    class="shortcutKey box"
                    v-for="(item,index) in shortcutKeys['imgSearch']" 
                    :key="`key${item}${index}`"
                >
                    {{ formattingKey(item) }}
                </span>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "ShortSettingItem",
    props: ['shortcutKeys'],
    methods: {
        setShortcutKey(event, target) {
            const functionKeys = ["Shift", "Alt", "Meta", "Control"];
            let key = /^Key[A-Z]$/.test(event.code) ? event.code.replace("Key", "") : event.key;
            let keys = this.shortcutKeys[target];
            // 按键已使用，则返回
            if (keys.includes(key))
                return;
            if (key === "Backspace") {
                keys = [];
            }
            else if (keys.length === 0 && functionKeys.includes(key)) {
                // 第一个必须是功能键
                keys.push(key);
            }
            else if (keys.length > 0) {
                // 最后一个必须为普通键，才算完成输入
                if (functionKeys.includes(keys[keys.length - 1])) {
                    // 当前最后一个是功能键，可继续输入，否则不能再输入
                    keys.push(key);
                }
                else {
                    return;
                }
            }

            this.shortcutKeys[target] = keys;
            
            // 最后一个为普通键，则输入完成
            if (this.checkShortcutKey(keys)) {
                switch (target) {
                    case "open":
                        window.electronAPI.setShortcutOpenSearchKeys(keys.join("+"));
                        break;
                    case "search":
                        window.electronAPI.setShortcutClipboardSearchKeys(keys.join("+"));
                        break;
                    case "imgSearch":
                        window.electronAPI.setShortcutImageSearchKeys(keys.join("+"));
                        break;
                    default:
                }
                this.$emit("updateKeys", this.shortcutKeys);
            }
        },
        checkShortcutKey(keys) {
            const functionKeys = ["Shift", "Alt", "Meta", "Control"];
            return !functionKeys.includes(keys[keys.length - 1]);
        },
        formattingKey(key) {
            const isMac = /.*mac.*/gi.test(window.navigator.platform);
            if (isMac) {
                switch (key) {
                    case "Alt":
                        key = "⌥ Opt";
                        break;
                    case "Meta":
                        key = "⌘ Cmd";
                        break;
                    default:
                }
            }
            else {
                switch (key) {
                    case "Meta":
                        key = "⊞ Win";
                        break;
                    default:
                }
            }
            return key;
        },
    }
    
}
</script>

<style scoped>
.shortcutKeyInput {
    display: flex;
    height: 3rem;
    padding: 0 .4rem;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
}

.shortcutKey {
    flex-shrink: 0;
    margin: .2rem;
    padding: 0 .3rem;
    border-radius: .3rem;
}
</style>