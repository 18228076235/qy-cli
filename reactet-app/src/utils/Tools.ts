/*
 * @Author: huxianyong
 * @Date: 2019-11-27 16:59:49
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-11-27 17:07:55
 */
import { createCipheriv, createDecipheriv } from 'crypto';
// aes-128 key iv 必须是16字节长
const key = 'huangdazhuisfift';
export const AesEncrypt = (loginInfo: any | string) => {
  const tempStr = JSON.stringify(loginInfo);
  const cipher = createCipheriv('aes-128-ctr', key, key);
  let crypted = cipher.update(tempStr, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};
export const AesDecrypt = (encrypted: string) => {
  const decipher = createDecipheriv('aes-128-ctr', key, key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};

export const AesEncrypt_qrcode = (data: string) => {
  const cipher = createCipheriv('aes-128-ctr', key, key);
  let crypted = cipher.update(data, 'utf8', 'base64');
  crypted += cipher.final('base64');
  return crypted;
};

/**
 * 全屏
 * @param dom 需要全屏的元素
 */
export const FullScreen = (dom: any) => {
  if (dom.requestFullscreen) {
    dom.requestFullscreen();
  } else if (dom.mozRequestFullScreen) {
    dom.mozRequestFullScreen();
  } else if (dom.webkitRequestFullScreen) {
    dom.webkitRequestFullScreen();
  } else if (dom.msRequestFullScreen) {
    dom.msRequestFullScreen();
  }
};
export const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    //@ts-ignore
  } else if (document.msExitFullscreen) {
    //@ts-ignore

    document.msExitFullscreen();
    //@ts-ignore
  } else if (document.mozCancelFullScreen) {
    //@ts-ignore

    document.mozCancelFullScreen();
    //@ts-ignore
  } else if (document.webkitExitFullscreen) {
    //@ts-ignore
    document.webkitExitFullscreen();
  }
};
/**
 * 判断元素是否为全屏
 * @param dom 用于判断全屏的元素
 */
export const IsFullScreen = (dom: Element) => {
  //console.log(dom);
  return new Promise((resolve, reject) => {
    const el = document.fullscreenElement;
    if (el !== null && el === dom) {
      resolve(true);
    }
    return reject(false);
  });
};
export const searchToObj = (str: string) => {
  const arr = str.slice(1).split('&');
  const obj: { [x: string]: any } = {};
  arr.forEach((item: string) => {
    const objMap = item.split('=');
    obj[objMap[0]] = objMap[1];
  });
  return obj;
};
