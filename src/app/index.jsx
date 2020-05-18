import React from 'react';
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { store } from './store';
import { Main } from './components/Main';

// CSS from a module
// CSS from a module
import 'bootstrap/dist/css/bootstrap.css'; // gives webpack access to bootstrap.css

import '../../css/modern-business.css';


/*


import '../../vendor/bootstrap/css/JQXGrid/jqx.base.css';

import '../../vendor/bootstrap/css/JQXGrid/jqx.bootstrap.css';


import '../../vendor/jquery/jquery.min.js';

import '../../vendor/bootstrap/js/bootstrap.bundle.min.js';*/


/* const renderApp = () => {
  ReactDOM.render(
    <Main />,
    document.getElementById('app'),
  );
}; */

const renderApp = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
};


// run once to initialize the component, and again if anything changes
console.log('Hot Render 1');
renderApp(Main);


// the "module" where looking for is provided by webpack when bundling
if (module && module.hot) {
  module.hot.accept('./components/Main', () => {
    // run again to re-initialize the component, which allows the hot reloader
    // to show changes without a full page reset.
    console.log('Hot Render 2');
    renderApp(Main);
  });
}
