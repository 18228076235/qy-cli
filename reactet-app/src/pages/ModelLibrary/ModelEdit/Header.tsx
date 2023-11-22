import React, { FC, memo } from 'react';
import { Button, Checkbox } from 'antd';
import { FullScreen } from 'utils/Tools';
interface IProps {
  isEdit: boolean;
  showLandmark: boolean;
  showLabels: boolean;
  buttonLoading: boolean;
  changeShowLandmark: (e: boolean) => void;
  changeShowLabels: (e: boolean) => void;
  exit: () => void;
  save: () => void;
}
const Header: FC<IProps> = props => {
  const {
    isEdit,
    showLandmark,
    showLabels,
    changeShowLandmark,
    changeShowLabels,
    exit,
    save,
    buttonLoading
  } = props;
  return (
    <>
      <header className="model_edit_header flex">
        <div>
          <Button
            type={'primary'}
            className="model_edit_header_button"
            onClick={save}
            loading={buttonLoading}
          >
            {isEdit ? '保存' : '只读模式'}
          </Button>
          <Button
            type={'primary'}
            className="model_edit_header_button ml-4"
            onClick={() => {
              FullScreen(document.body);
            }}
          >
            全屏
          </Button>
        </div>
        <div>
          <Checkbox
            onChange={e => changeShowLabels(e.target.checked)}
            checked={showLabels}
          >
            显示标注
          </Checkbox>
          <Checkbox
            onChange={e => changeShowLandmark(e.target.checked)}
            checked={showLandmark}
          >
            显示特征点
          </Checkbox>
        </div>
        <div className="model_edit_header_exit" onClick={exit}>
          退出
        </div>
      </header>
    </>
  );
};
export default memo(Header);
