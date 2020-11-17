import React from 'react';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { spinner } from './LoaderIndicator.module.scss';

const Loader = () => <Spin size="large" tip="Loading" className={spinner} />;

export default Loader;
