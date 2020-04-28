
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { store } from './store';
import { Main } from './components/Main';

ReactDOM.render(
  <Main />,
  document.getElementById('app'),
);
