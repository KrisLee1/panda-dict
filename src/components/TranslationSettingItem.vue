<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-11 19:25:09
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-17 23:00:52
 * @FilePath: /VSCodeProjects/Electron/card-dict/src/components/TranslationSettingItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="translationSettingItem">
        <div class="settingItem box">
            目标语言：
            <select 
                id="to-language-select" 
                class="select input innerInput" 
                name="to-language-select"
                :value="translation['toLanguage']" 
                @change="handelUpdate('toLanguage', $event.target.value)"
            >
                <option 
                    v-for="(item, index) in langList"
                    :key="`${index}-${item.value}`"
                    :value="item['value']"
                >
                    {{item['name']}}
                </option>

            </select>
        </div>
    </div>
</template>

<script>
import { languageList } from '../assets/script/language.js'

export default {
    name: 'TranslationSettingItem',
    props: ['translation'],
    data(){
        return {
            langList: languageList
        }
    },
    methods: {
        handelUpdate(name, value) {
            this.translation[name] = value;
        }
    }
}
</script>

<style scoped>

</style>