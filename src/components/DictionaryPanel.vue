<template>
  <div id="dictionaryPanel" @keydown.enter="search" tabindex="-1">
    <!-- 搜索框 -->
    <div class="searchBox">
      <textarea 
        placeholder="Search" 
        ref="searchInput" 
        v-model="words" 
        class="box input"
        :class="{shake: !isSucceed}" 
      >
      </textarea>
      <span class="clearBtn"  @click="clearText"></span>
    </div>

    <Transition name="search-results">
      <!-- 翻译结果 -->
      <div v-if="isActive && isSucceed" class="searchResults">
        <!-- 单词/短语 -->
        <div v-if="translateResult.isWord">
          <!--读音-->
          <div class="phoneticBox">
            <div 
              class="phoneticLabel us-phonetic box button" 
              v-if="translateResult.phonetic.us" 
              @click.stop="toSpeech(translateResult.speech.us)"
            >
              美&nbsp;/ {{translateResult.phonetic.us}} /
              <span class="play-icon"></span>
            </div>
            <div 
              class="phoneticLabel uk-phonetic box button" 
              v-if="translateResult.phonetic.uk" 
              @click.stop="toSpeech(translateResult.speech.uk)"
            >
              英&nbsp;/ {{translateResult.phonetic.uk}} /
              <span class="play-icon"></span>
            </div>
          </div>
          <!--解释-->
          <div class="searchResultBox explainsBox box" v-if="translateResult.explains">
            <div class="explain" v-for="(exp,index) in translateResult.explains" :key="'explain'+index">{{exp}}</div>
          </div>
          <!--单词变形-->
          <div class="searchResultBox wordFormationsBox box" v-if="translateResult.wordFormations">
            <div class="wordDeformation" v-for="(wf,index) in translateResult.wordFormations" :key="'wfs'+index">
              <span class="wf-name">{{wf.wf['name']}}</span>
              <span class="wf-value">{{wf.wf['value']}}</span>
            </div>
          </div>
          <!--等级-->
          <div class="searchResultBox levelsBox box" v-if="translateResult.levels">
            <div class="levelLabel" v-for="(level,index) in translateResult.levels" :key="'level'+index">{{level}}</div>
          </div>
        </div>

        <!-- 翻译 -->
        <div v-else>
          <div class="searchResultBox translationBox box">
            {{translateResult.translation}}
          </div>
        </div>
        
      </div>

      <!-- 翻译失败 -->
      <div class="searchError" v-else-if="!isSucceed">出错啦！(｡•́︿•̀｡)</div>
    </Transition>
    
  </div>
</template>

<script>
import axios from "axios";
import { throttled } from "../assets/script/utils"
import { YoudaoTranslateAPI, YoudaoOcrAPI, VolcengineTranslateAPI } from "../assets/script/APIs"


export default {
  name: "DictionaryPanel",
  props: ['apis', 'toLanguage'],
  data() {
    return {
      translateResult: {
        isWord: false,
        phonetic: {'us': "", 'uk': ""},
        speech: {'us': null, 'uk': null},
        explains: [],
        levels: [],
        wordFormations: [],
        translation: "",
      },
      isActive: false,
      isSucceed: true,
      words: ""
    }
  },
  watch: {
    words(){
      // 输入框自动调整高度
      this.$nextTick(() => {
        const searchInput = this.$refs.searchInput;
        searchInput.style.height = '0';

        let height = searchInput.scrollHeight;
        height = height > 200 ? 200 : height;
        searchInput.style.height = height + 'px';
      });
    }
  },
  methods: {
    test(){
      const accessKey = 'AKLTZmRhOTEwYTgwNDRiNGQ4NmIzYzY0OTFlNjBlZjllZDg';
      const secretKey = 'WkRRd09HRXdPV1kxTnprek5ERm1OVGxpT0RSaE5XSTJabUV6WkdVNU5UVQ==';
      const api = VolcengineTranslateAPI(this.words, accessKey, secretKey, this.toLanguage);
      this.useTranslateAPI(api);
    },
    searchInputFocus(){
      this.$refs.searchInput.focus();
    },
    search: throttled(function(){
      if(!this.apis.translateAPI.accessKey || !this.apis.translateAPI.secretKey){
        if(confirm("请先设置翻译API")){
          this.$emit('toSetting', true);
        }
        return;
      }
      // 查询words预处理
      this.words = this.words.replace(/ +/g, ' ');        //多个空格替换为1个
      this.words = this.words.replace(/[\r|\n]+/g, '\n'); //多个换行符替换为1个
      // 调用翻译API
      if (this.words) {
        const api = YoudaoTranslateAPI(
          this.words, 
          this.apis.translateAPI.accessKey, 
          this.apis.translateAPI.secretKey, 
          this.toLanguage
        );
        this.useTranslateAPI(api);
      }
    }, 400),
    // 翻译API
    useTranslateAPI(api){
      axios.post(api.getUrl(), api.getParams(), api.getConfig())
          .then((resp) => {
            this.isActive = true;
            this.isSucceed = true;
            this.translateResult = {...api.handelData(resp.data)};
          })
          .catch((err) => {
            this.isSucceed = false;
            setTimeout(() => {
              this.isActive = false;
              this.isSucceed = true;
            }, 1500)
          });
    },
    toSpeech(audio){
      audio && audio.play();
    },
    clearText(){
      this.words = "";
      this.isWord = false;
      this.isActive = false;
      this.isSucceed = true;
    },
    img2Text(img){
      if(!this.apis.ocrAPI.accessKey || !this.apis.ocrAPI.secretKey){
        if(confirm("请先设置文字识别API")){
          this.$emit('toSetting', true);
        }
        return;
      }

      img = img.replace(/data.*base64,/g, '');  // 去除base64前缀
      const api = YoudaoOcrAPI(img, this.apis.ocrAPI.accessKey, this.apis.ocrAPI.secretKey);
      this.useOcrAPI(api);
    },
    // 文字识别API
    useOcrAPI(api){
      axios.post(api.getUrl(), api.getParams(), api.getConfig())
          .then((resp) => {
            this.words = api.handelData(resp.data);
            this.searchInputFocus();
            this.search();
          })
          .catch((err) => {
            this.isActive = true;
            this.isSucceed = false;
            setTimeout(() => {
              this.isActive = false;
              this.isSucceed = true;
            }, 1500)
          });
    }
  }
}
</script>

<style scoped>

#dictionaryPanel{
  font-family: Arial;
  width: 100%;
  height: fit-content;
  min-height: 100%;
  padding: .5rem;
  /* padding-top: 30px; */
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  outline: none;
}

#dictionaryPanel .searchBox{
  position: relative;
  display: flex;
  align-items: center;
  height: max-content;
}
#dictionaryPanel .searchBox textarea{
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 4rem;
  font-size: 1rem;
  overflow-y: auto;
  padding: .3rem 2.5rem .3rem .5rem;
}

.searchBox .clearBtn{
  width: 20px;
  height: 20px;
  position: absolute;
  right: .5rem;
  background-image: url("../assets/image/clear_icon.png");
  background-size: cover;
  opacity: .2;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);
  transition: opacity 600ms ease;
}
.searchBox .clearBtn:hover {
  opacity: .5;
}

.search-results-enter-active,
.search-results-leave-active {
  transition: transform .3s ease-out,
              opacity .3s ease-out;
}
.search-results-enter-from,
.search-results-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.searchResults {
  z-index: 0;
}

.searchError{
  margin-top: .5rem;
  font-size: .9rem;
}
.phoneticBox{
  display: flex;
  margin-top: .3rem;
}
.phoneticBox .phoneticLabel{
  width: fit-content;
  border-radius: 5rem;
  padding: .4rem .7rem;
  margin-right: .5rem;
  display: flex;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  cursor: pointer;
}

.phoneticBox .phoneticLabel .play-icon{
  background-image: url("../assets/image/loudspeakers_icon.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: .5rem;
  width: 1.2rem;
  height: 1.2rem;
  display: inline-block;
  flex-shrink: 0;
}
.searchResultBox{
  -webkit-user-select: text;
}
.explainsBox .explain{
  margin: .3rem 0;
  text-align: start;
  border-bottom: 1px solid #55555580;
}
.explainsBox .explain:last-child {
  border-bottom: 0;
}
.wordFormationsBox{
  display: flex;
  flex-wrap: wrap;
}
.wordDeformation .wf-name{
  color: #777777;
  font-size: .9rem;
}
.wordDeformation .wf-value{
  margin-left: .3rem;
  margin-right: .7rem;
}
.levelsBox{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.levelsBox .levelLabel{
  font-size: .9rem;
  margin: .1rem .7rem .1rem 0;
  padding-left: .3rem;
  border-left: 2px solid var(--theme-color);
}

.translationBox {
  text-align: start;
  white-space: pre-wrap;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

@media (prefers-color-scheme: light) {
  .searchBox .clearBtn {
    opacity: .5;
  }
  .searchBox .clearBtn:hover {
    opacity: 1;
  }

  .explainsBox .explain{
    border-bottom: 1px solid #cccccc80;
  }
  
}

</style>