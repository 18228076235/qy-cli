import React, { FC, useState } from 'react';
import Sidebar from './Sidebar';
import { LayoutRouter } from 'router';
import './index.scss';

const NGLayout: FC = () => {
  return (
    <div className="flex ngLayout">
      <Sidebar />
      <section className="ngLayout_section">
        <LayoutRouter />
      </section>
    </div>
  );
};

export default NGLayout;
