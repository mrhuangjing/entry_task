import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import 'antd-mobile/dist/antd-mobile.css';  // or 'antd-mobile/dist/antd-mobile.less'
import { Provider } from 'react-redux';
import store from './store';
import enUS from 'antd-mobile/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd-mobile';

ReactDOM.render(
    <Provider store={store}>
        <LocaleProvider locale={enUS}>
            <App />
        </LocaleProvider>
    </Provider>,
    document.getElementById('wrapper')
);