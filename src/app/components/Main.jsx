// parent of Dashboard
import React from 'react';
import { AboutComponent } from './About';
import ChangePasswordPage from './ChangePasswordPageContainer';
import { ConnectedDashboard } from './Dashboard';
import { ConnectedLogin } from './Login';
import { ConnectedAccountPayWizard } from './wizard/wizard';
import { ConnectedNavigation } from './Navigation';
import Cookies from 'js-cookie';
import { connect, Provider } from 'react-redux';
import DevTools from './DevTools';
import ErrorBox from './ErrorBoxContainer';
import { HeaderComponent } from './Header';
import { history } from '../store/history';
import { isTokenVerified, logout } from '../../auth/Auth';
import { NavComponent } from './Nav';
import ResetPasswordPage from './ResetPasswordPageContainer';
// Router - parent component that all routes have to be inside
// Router - component that displays different depending what the URL is
import { Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { store } from '../store';


// RouteGuard is a method that takes a component as an argument, which
// returns another method that takes an object as an argument and we just
// want the property of the object know as match.
const RouteGuard = (Component) => ({ match }) => {
  console.info('Route guard', match);
  //! verifyToken(store.getState().session.userToken) &&
  // if(!verifyToken(Cookies.get('auth')))
  // if (!store.getState().session.authenticated &&  match.url != "/wizard")
  // if(verifyToken(store.getState().session.userToken))
  // let tokenVerified = verifyToken(Cookies.get('auth'))
  if (!isTokenVerified(Cookies.get('auth')) && match.url != '/wizard') {
    return <Redirect to="/" />;
  }
  if (match.url === '/') {
    logout();
    return <Component match={match} />;
  }
  return <Component match={match} />;
};

export const Main = () => (
  <Router history={history}>
    <Provider store={store}>
      <div>
        <ConnectedNavigation />
        <NavComponent />
        <HeaderComponent />
        <ErrorBox />
        <Route exact path="/" component={ConnectedLogin} />
        <Route exact path="/about" component={AboutComponent} />
        <Route exact path="/change-password/:hash" component={ChangePasswordPage} />
        <Route
              path="/buysingle"
              component={() => {
                const url = window.location.href;
                let paypalUrl = '';
                const hashes = url.split('?');
                for (let i = 1; i < hashes.length; i++) {
                  paypalUrl += hashes[i];
                }
                window.location.href = paypalUrl.toString();
                return null;
              }}
        />
        <Route exact path="/dashboard" render={RouteGuard(ConnectedDashboard)} />
        <Route exact path="/reset-password" component={ResetPasswordPage} />
        <Route exact path="/wizard" render={RouteGuard(ConnectedAccountPayWizard)} />
        <DevTools />
      </div>
        {/* // call spinner if app is running slow
        <div className="loader-wrapper" style={progress > 0 ? { display: 'block' } : { display: 'none' }}>
            <div className="loader-box">
                <div className="loader">Loading...</div>
            </div>
        </div>,*/}
    </Provider>
  </Router>

);
