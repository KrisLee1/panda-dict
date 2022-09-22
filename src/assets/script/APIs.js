/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-16 14:31:51
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-19 15:48:02
 * @FilePath: /VSCodeProjects/Electron/panda-dict/src/assets/scripts/APIs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { uuid } from 'vue-uuid'
import CryptoJS from "crypto-js"


// 翻译结果
const translateResult = {
    isWord: false,
    phonetic: {'us': "", 'uk': ""},
    speech: {'us': null, 'uk': null},
    explains: [],
    levels: [],
    wordFormations: [],
    translation: "",
};

// 有道翻译API
function youdaoTruncate(q){
    const len = q.length;
    if(len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}

export const YoudaoTranslateAPI = function(words, accessKey, secretKey, toLang) {
    return {
        getUrl: function(){
            return 'https://openapi.youdao.com/api';
        },
    
        getConfig: function(){
            return {};
        },
    
        getParams: function() {
            const curTime = Math.round(new Date().getTime()/1000);
            const to = toLang;
            const from = 'auto';
            const salt = uuid.v1() + curTime;
            const str1 = accessKey + youdaoTruncate(words) + salt + curTime + secretKey;
            const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
            const params = new URLSearchParams();
            params.append('q', words);
            params.append('appKey', accessKey); // 应用ID
            params.append('salt', salt);
            params.append('from', from);
            params.append('to', to);
            params.append('sign', sign);
            params.append('signType', "v3");
            params.append('curtime', curTime);
            return params;
        },
    
        handelData: function(data) {
            translateResult.isWord = data.isWord;
            if(translateResult.isWord){
                // 发音
                translateResult.phonetic.us = data.basic['us-phonetic'];
                translateResult.phonetic.uk = data.basic['uk-phonetic'];
                translateResult.speech.us = new Audio(data.basic['us-speech']);
                translateResult.speech.uk = new Audio(data.basic['uk-speech']);
                // 解释
                translateResult.explains = data.basic['explains'];
                // 水平
                translateResult.levels = data.basic['exam_type'];
                // 单词变形
                translateResult.wordFormations = data.basic['wfs'];
            } else {
                // 翻译
                translateResult.translation = data['translation'][0];
            }
            return translateResult;
        }   
    }
}


// 有道OCR API
export const YoudaoOcrAPI = function(img, accessKey, secretKey){
    return {
        getUrl: function(){
            return 'https://openapi.youdao.com/ocrapi';
        },
    
        getConfig: function(){
            return {};
        },
    
        getParams: function(){
            const curTime = Math.round(new Date().getTime()/1000);
            const salt = uuid.v1() + curTime;
            const str1 = accessKey + youdaoTruncate(img) + salt + curTime + secretKey;
            const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
            return new URLSearchParams({
                'img': img,
                'langType': 'auto',
                'detectType': '10012',
                'imageType': '1',       // Base64
                'appKey': accessKey,        // 应用ID
                'salt': salt,
                'sign': sign,
                'signType': 'v3',
                'docType': 'json',
                'curtime': curTime,
                'column': 'columns'
            });
        },
    
        handelData: function(data){
            const regions = data.Result.regions;    // 段落
            let text = '';
            for(const region of regions) {
        
              const lines = region.lines;   // 行
        
              for(const line of lines) {
                text += line.text + '\n';
              }
            }
            return text;
        }
    }
}



export const VolcengineTranslateAPI = function(words, accessKey, secretKey, toLang) {
    const Query = {
        query: {
            'Action': 'TranslateText',
            'Version': '2020-06-01'
        },
        toString: function() {
            let queryList = [];
            for(let key of Object.keys(this.query).sort()){
                queryList.push(`${key}=${this.query[key]}`)
            }
            return queryList.join('&');
        }
    }
    
    const Body = {
        body: {
            'TargetLanguage': toLang,
            'TextList': [words]
        },
        toString: function() {
            return JSON.stringify(this.body);
        }
    }

    const Credentials = {
        ak: accessKey,
        sk: secretKey,
        service: 'translate',
        region: 'cn-north-1'
    }

    function getXDate(){
        function leftPad(n){
            return n < 10 ? '0' + n : n;
        }
        const now = new Date();
        const format = [
            now.getUTCFullYear(),
            leftPad(now.getUTCMonth()+1),
            leftPad(now.getUTCDate()),
            'T',
            leftPad(now.getUTCHours()),
            leftPad(now.getUTCMinutes()),
            leftPad(now.getUTCSeconds()),
            'Z'
        ]
        return format.join('');
    }

    const curTime = getXDate();

    const MetaData = {
        algorithm: 'HMAC-SHA256',
        service: Credentials.service,
        region: Credentials.region,
        date: curTime.substring(0,8),
        getCredentialScope: function(){
            return `${this.date}/${this.region}/${this.service}/request`;
        }
    }

    const Header = {
        headers: {
            // 'Host': 'open.volcengineapi.com',
            'Content-Type': 'application/json',
            'X-Date': curTime,
            'X-Content-Sha256': CryptoJS.SHA256(Body.toString()).toString(CryptoJS.enc.Hex),
        },
        getSignedHeaders: function(){
            let headerList = [];
            for(let key of Object.keys(this.headers).sort()){
                headerList.push(key.toLocaleLowerCase());
            }
            return headerList.join(';');
        },
        toString: function() {
            let str = '';
            for(let key of Object.keys(this.headers).sort()){
                str += `${key.toLocaleLowerCase()}:${this.headers[key]}\n`
            }
            return str;
        }
    }

    const getSigningKey = function(sk, date, region, service) {
        const kdate = CryptoJS.HmacSHA256(date, sk);
        const kregion = CryptoJS.HmacSHA256(region, kdate);
        const kservice = CryptoJS.HmacSHA256(service, kregion);
        return CryptoJS.HmacSHA256('request', kservice);
    }

    const canonicalRequest = ['POST', '/', Query.toString(), Header.toString(), Header.getSignedHeaders(), Header.headers['X-Content-Sha256']].join('\n');
    const hashCanonicalRequest = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);
    const signing_str = [MetaData.algorithm, curTime, MetaData.getCredentialScope(), hashCanonicalRequest].join('\n');
    const signing_key = getSigningKey(Credentials.sk, MetaData.date, MetaData.region, MetaData.service);
    const sign = CryptoJS.HmacSHA256(signing_str, signing_key).toString(CryptoJS.enc.Hex);

    const Authorization = [
        `${MetaData.algorithm} Credential=${Credentials.ak}/${MetaData.getCredentialScope()}`,
        'SignedHeaders=' + Header.getSignedHeaders(),
        `Signature=${sign}`
    ];

    Header.headers['Authorization'] = Authorization.join(', ');

    return {
        getUrl: function(){
            return 'http://open.volcengineapi.com/?' + Query.toString();
        },
    
        getConfig: function(){
            return {
                headers: Header.headers
            };
        },

        getParams: function() {
            return Body.body;
        },
        
        handelData: function(data) {
            translateResult.isWord = false;
            // 翻译
            translateResult.translation = data['TranslationList'][0]['Translation'];
            return translateResult;
        }
    }

}
