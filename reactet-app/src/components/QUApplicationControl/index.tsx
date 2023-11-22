/**
 * /*
 *
 * @format
 * @Author: hanlike
 * @Date: 2018-11-07 16:18:17
 * @Last Modified by: huyixing
 * @Last Modified time: 2019-08-13 18:30:11
 */

import React, { SFC } from 'react';
import './index.scss';

interface IProps {
  color: string;
}

const QUApplicationControl: SFC<IProps> = ({ color }) => {
  return (
    <div className="flex control">
      <div className="control_box">
        <h1 className="flex_column login_logo">
          <i className="icon_logo mb-12" />
        </h1>
      </div>
    </div>
  );
};

export default React.memo(QUApplicationControl);
