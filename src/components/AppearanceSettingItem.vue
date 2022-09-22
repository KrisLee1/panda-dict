<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-07 20:54:42
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-08 00:39:18
 * @FilePath: /VSCodeProjects/Electron/card-dict/src/components/AppearanceSettingItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="appearanceSettingItem">
        <div class="settingItem box">
            主题:
            <select 
                id="theme-select" 
                class="select input innerInput" 
                name="theme-select"
                :value="appearance['theme']" 
                @change="handelUpdate('theme',$event.target.value)"
            >
                <option 
                    v-for="(item,index) in themes" 
                    :key="`theme${index}`"
                    :value="item['value']"
                >
                    {{ item['name'] }}
                </option>
            </select>
            
            控制按钮：
            <select 
                id="control-btn-position-select" 
                class="select input innerInput" 
                name="control-btn-position-select"
                :value="appearance['controlBtnPosition']" 
                @change="handelUpdate('controlBtnPosition',$event.target.value)"
            >
                <option value="controlBtnPositionLeft">左侧</option>
                <option value="controlBtnPositionRight">右侧</option>
            </select>

        </div>
    </div>
</template>

<script>
export default {
    name: "AppearanceSettingItem",
    props: ['appearance', 'themes'],
    data() {
        return {

        }
    },
    methods: {
        handelUpdate(name, value) {
            this.appearance[name] = value;
        }
    }
}
</script>

<style scoped>

</style>