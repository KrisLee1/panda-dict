/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-09 14:28:03
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-13 16:36:56
 * @FilePath: /VSCodeProjects/Electron/card-dict/electron/lib/capture_renderer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const video = document.querySelector('#video');
const canvas = document.querySelector('#rect');
const ctx = canvas.getContext('2d');

const rect = {x: 0, y: 0, w: 0, h: 0};  // 选取框
let start = false;  // 开始画图
let scale = 1;      // 屏幕缩放倍数

// 画选取框
const draw = (rect) => {
    // 清除
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 蒙版
    ctx.save();
    ctx.fillStyle = '#00000020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    // 剪切框选区域
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    // 画框
    ctx.save();
    ctx.strokeStyle = '#1BADF7FF';
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
}

// 鼠标按下开始画框
canvas.addEventListener('mousedown', (e) => {
    rect.x = e.offsetX;
    rect.y = e.offsetY;
    start = true;
});

// 画框
canvas.addEventListener('mousemove', (e) => {
    if(start){
        rect.w = e.offsetX - rect.x;
        rect.h = e.offsetY - rect.y;
        draw(rect);
    }
});

// 鼠标放开截取图片
canvas.addEventListener('mouseup', (e) => {
    start = false;
    // 存放截取图片的canvas
    const sliceCanvas = document.querySelector('#slice');
    const sliceCtx = sliceCanvas.getContext('2d');

    sliceCanvas.width = rect.w * scale;
    sliceCanvas.height = rect.h * scale;
    // 截取选框图片
    sliceCtx.drawImage(
        video, 
        rect.x * scale, rect.y * scale, rect.w * scale, rect.h * scale, 
        0, 0, rect.w * scale, rect.h * scale
    );

    // 获取图片数据，发送给electron主进程
    const imgURL = sliceCanvas.toDataURL('image/jpeg', 0.5 / scale);
    window.electronAPI.captureImage(imgURL);
    // 清空
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    video.srcObject = null;

});

window.electronAPI.captureScreen(async (event, value) => {
    const { sourceId, scaleFactor,  ...screenSize } = value;
    scale = scaleFactor;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: screenSize.width * scaleFactor,
                    maxWidth: screenSize.width * scaleFactor,
                    minHeight: screenSize.height * scaleFactor,
                    maxHeight: screenSize.height *scaleFactor
                }
            }
        })
        handleStream(stream, screenSize);
    } catch (e) {
        handleError(e);
    }
})

function handleStream (stream, screenSize) {
    video.width = screenSize.width;
    video.height = screenSize.height;
    canvas.width = screenSize.width;
    canvas.height = screenSize.height;
    canvas.style.display = 'none';
    
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
        setTimeout(() => {
            video.play();
            video.pause();
            closeStream(stream);

            canvas.style.display = 'unset';
            window.electronAPI.captured();
        }, 50);
    }
}

function handleError (e) {
    alert('获取屏幕录制权限失败!');
    window.electronAPI.noCapturePermission();
}

function closeStream(stream) {
    const tracks = stream.getTracks() || [];
    for(const track of tracks){
        track.stop();
    }
}