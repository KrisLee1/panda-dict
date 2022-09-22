<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-07 20:50:15
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-18 23:35:36
 * @FilePath: /VSCodeProjects/Electron/card-dict/src/components/APISettingItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <!-- API -->
    <div id="APISettingItem">
        <div class="settingItem box">
            API平台:
            <select id="api-platform" class="select input innerInput" name="api-platform">
                <option value="youdao">有道智云</option>
            </select>

            <h4>翻译</h4>
            应用ID:
            <input 
                class="input innerInput" 
                placeholder="Access Key"
                spellcheck="false"
                :value="apis.translateAPI['accessKey']" 
                @input="handelInput('translateAPI','accessKey',$event.target.value)"
            />

            应用KEY:
            <input 
                class="input innerInput" 
                placeholder="Secret Key"
                spellcheck="false"
                :value="apis.translateAPI['secretKey']" 
                @input="handelInput('translateAPI','secretKey',$event.target.value)"
            />

            <h4>文字识别</h4>
            应用ID:
            <input 
                class="input innerInput" 
                placeholder="Access Key"
                spellcheck="false"
                :value="apis.ocrAPI['accessKey']" 
                @input="handelInput('ocrAPI','accessKey',$event.target.value)"
            />

            应用KEY:
            <input 
                class="input innerInput" 
                placeholder="Secret Key"
                spellcheck="false"
                :value="apis.ocrAPI['secretKey']" 
                @input="handelInput('ocrAPI','secretKey',$event.target.value)"
            />
            
        </div>
    </div>
</template>

<script>
export default {
    name: "APISettingItem",
    props: ['apis'],
    methods: {
        handelInput(APIName, name, value) {
            this.apis[APIName][name] = value;
        }
    }
}
</script>

<style scoped>
    h4 {
        margin: 1rem 0 .6rem 0;
        font-size: 1.1rem;
    }
</style>