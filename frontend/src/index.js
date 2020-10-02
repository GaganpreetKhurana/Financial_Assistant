import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './components';
import {configureStore} from './store';
import {Provider} from 'react-redux';

const store = configureStore();


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);


