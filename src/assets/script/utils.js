/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-10 22:42:00
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-16 13:57:20
 * @FilePath: /VSCodeProjects/Electron/card-dict/src/assets/scripts/utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function debounce(func, wait = 200) {
	let timer = null;
	
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	}
}

export function throttled(func, delay = 200) {
	let timer = null;
	
	return function (...args) {
		if (!timer) {
			func.apply(this, args);
			timer = setTimeout(() => {
				timer = null;
			}, delay);
		}
	}
}
