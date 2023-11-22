import React, { FC } from 'react';

interface IProps {
  style?: React.CSSProperties;
  name: string;
  active?: boolean;
  onClick?: (flag: boolean) => void;
}

const TypeButton: FC<IProps> = props => {
  const { style, name, active } = props;
  const handleClick = () => {
    props.onClick && props.onClick(!active);
  };
  return (
    <div
      onClick={handleClick}
      className={`photo_edit_drawer_typebutton ${
        active ? 'typebutton-active' : ''
      }`}
      style={style}
    >
      {name}
    </div>
  );
};

export default TypeButton;
