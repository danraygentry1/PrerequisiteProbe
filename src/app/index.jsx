import { store } from './store'

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Main } from './components/Main'

ReactDOM.render(
        < Main />,
        document.getElementById("app")
);