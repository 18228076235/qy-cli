/*
 * @Author: qiuying
 * @Date: 2019-08-19 11:27:42
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-02 16:00:40
 */

import React, { SFC, memo } from 'react';
import { Popover } from 'antd';
import './index.scss';
export interface IProps {
  len?: number;
  val: string | string[];
  block?: boolean;
  className?: string;
}
const QUEllipsis: SFC<IProps> = ({
  len = 8,
  val,
  block = true,
  className = ''
}) => {
  const type = typeof val;
  let data = '';
  let getValue = null;
  data = val ? val.toString() : '';
  if (type === 'object' && val instanceof Array) {
    let arrayVal = val || [];
    arrayVal = arrayVal.filter((text: string) => text);
    const content = arrayVal.map((item: string, key: number) => (
      <span className={block ? `` : `quEllipsis_project`} key={key}>
        {item}
        {block && arrayVal.length - 1 !== key && '，'}
      </span>
    ));

    const popoverCont = arrayVal.map((item: string, key: number) => (
      <li
        className={block ? 'quEllipsis_block p-2' : 'quEllipsis_popoverCont_li'}
        key={key}
      >
        {item}
      </li>
    ));
    const sliceArray = arrayVal.slice(0, len);
    getValue =
      !val || !val.length ? (
        '-'
      ) : arrayVal.length > len ? (
        <Popover
          placement="bottomRight"
          overlayClassName="quEllipsis_overlayPopover"
          content={
            <ul className="quEllipsis_popoverCont mb-0">{popoverCont}</ul>
          }
          trigger="hover"
        >
          <span className="csp">
            {sliceArray.map((item: string, key: number) => (
              <span className={block ? '' : `quEllipsis_project`} key={key}>
                {item}
                {block && len - 1 !== key && '，'}
              </span>
            ))}
            <span>...</span>
          </span>
        </Popover>
      ) : (
        content
      );
  } else if (typeof val === 'string') {
    getValue = !val ? (
      '-'
    ) : data.length > len ? (
      <Popover
        overlayClassName="quEllipsis_overlayPopover"
        placement="bottomRight"
        content={
          <div
            dangerouslySetInnerHTML={{
              __html: val.replace(/[\n\r]/g, '<br/>')
            }}
          />
        }
        trigger="hover"
      >
        <span className="csp">
          {data.length > len ? `${data.substr(0, len)}...` : data}
        </span>
      </Popover>
    ) : (
      val
    );
  } else {
    getValue = '-';
  }
  return <span className={`${className} quEllipsis`}>{getValue}</span>;
};

export default memo(QUEllipsis);
