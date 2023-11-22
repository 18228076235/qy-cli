import React, { useState, useEffect, useRef } from 'react';
import { LinkageModel } from './ModelLibrary/Components/LinkageModel';
import { useMount, useUnmount } from 'hooks';
import { debounce } from 'lodash-es';
import { Button } from 'antd';
import { Qiniu } from 'utils/Qiniu';
export default function A() {
  const [style, setStyle] = useState({
    height: window.innerHeight,
    width: window.innerWidth / 2 // 30二分之一的裁剪值
  });
  const testRef = useRef<any>();
  const resize = debounce(() => {
    setStyle({
      height: window.innerHeight,
      width: window.innerWidth / 2
    });
  }, 16.7);
  useMount(() => {
    window.addEventListener('resize', resize);
  });
  useUnmount(() => {
    window.removeEventListener('resize', resize);
  });
  const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr = dataurl.split(','),
      // @ts-ignore
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  const click = () => {
    let cvs = document.createElement('canvas') as HTMLCanvasElement;
    cvs.height = window.innerHeight;
    cvs.width = window.innerWidth;
    const ctx = cvs.getContext('2d');
    const v1 = testRef.current.leftBaseModel.canvas;
    const v2 = testRef.current.rightBaseModel.canvas;

    ctx?.drawImage(v1, 0, 0);
    ctx?.drawImage(v2, window.innerWidth / 2, 0);
    cvs.toBlob(r => {
      if (r) {
        new Qiniu().upload(r, '这里是文件名', '这是token').subscribe({
          next(res) {
            // 这里是进度
          },
          error(err) {
            // 这里是error
          },
          complete(res) {
            // 完成
          }
        });
      }
    });
    // cvs = null;
  };
  return (
    <div
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%'
      }}
    >
      <Button onClick={click}>12312312</Button>
      <LinkageModel
        height={style.height}
        width={style.width}
        modelUrlRight={'http://cdn.3d.neurongenius.com/1575430770751/'}
        modelUrl={'http://cdn.3d.neurongenius.com/1575430770751/'}
        id={'aa'}
        index={1}
        modelLabels=""
        modelLabelsRight=""
        showLabels={false}
        //@ts-ignore
        ref={testRef}
      />
      //@ts-ignore
      <LinkageModel
        modelUrlRight={'http://cdn.3d.neurongenius.com/1575430770751/'}
        height={style.height}
        width={style.width}
        modelLabels=""
        modelLabelsRight=""
        showLabels={false}
        modelUrl={'http://cdn.3d.neurongenius.com/1575430770751/'}
        id={'bb'}
        index={2}
      />
    </div>
  );
}
