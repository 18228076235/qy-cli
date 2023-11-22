import * as qiniu from 'qiniu-js';

export class Qiniu {
  observable: qiniu.Observable;
  constructor() {}
  /**
   *
   * @param file 文件
   * @param key 文件名
   * @param token 上传凭证
   */
  upload(
    file: Blob,
    key: string,
    token: string,
    putExtra: Partial<qiniu.Extra> = {},
    config: Partial<qiniu.Config> = {}
  ) {
    this.observable = qiniu.upload(file, key, token, putExtra, config);
    return this.observable;
  }
}
// new Qiniu().upload(new Blob(), '1', ';1').subscribe({
//   next(res) {},
//   error(err) {},
//   complete(res) {}
// });
