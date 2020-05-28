// parent of Dashboard
import React from 'react';
import { BuySingleComponent } from './BuySingle';
import Cookies from 'js-cookie';
import { connect, Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { AboutComponent } from './About';
import ChangePasswordPageContainer from './ChangePasswordPageContainer';
import { ConnectedDashboard } from './Dashboard';
import { ConnectedLogin } from './Login';


// import { NavComponent } from './Nav';
import { ConnectedNav } from './Nav';
import DevTools from './DevTools';
import ErrorBox from './ErrorBoxContainer';
import { HomeComponent } from './Home';
import { HeaderComponent } from './Header';
import { history } from '../store/history';
import { isTokenVerified, logout } from '../../auth/Auth';
import ResetPasswordPage from './ResetPasswordPageContainer';
import RegistrationPageContainer from './RegistrationPageContainer';
import OrderPageContainer from './OrderPageContainer';
// Router - parent component that all routes have to be inside
// Router - component that displays different depending what the URL is
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

  /* if (!isTokenVerified(Cookies.get('auth'))) {
    return <Redirect to="/login" />;
  } */

  if (isTokenVerified(Cookies.get('auth')) && (match.url != '/dashboard' && match.url != '/' && match.url != '/about' && match.url != '/buysingle' && match.url != '/success' && match.url != '/cancel')) {
    logout();
    return <Redirect to="/login" />;
  }

  /* if (match.url === '/') {
    logout();
    return <Component match={match} />;
  } */
  return <Component match={match} />;
};

export const Main = () => (
  <Router history={history}>
    <Provider store={store}>
      <div>
        <ConnectedNav />
        <HeaderComponent />
        <section className="page-content container-fluid">
          <ErrorBox />
          <Route exact path="/" render={RouteGuard(HomeComponent)} />
          <Route exact path="/login" component={ConnectedLogin} />
          {/*<Route exact path="/change-password/" render={RouteGuard(ChangePasswordPageContainer)} />*/}
          <Route exact path="/change-password/:hash" render={RouteGuard(ChangePasswordPageContainer)} />
          <Route exact path="/about" render={RouteGuard(AboutComponent)} />

          {/*<Route
            path="/buysingle"
            component={() => {
              const url = window.location.href;
              let paypalUrl = '';
              const hashes = url.split('?');
              for (let i = 1; i < hashes.length; i++) {
                paypalUrl += hashes[i];
              }
              window.location.href = paypalUrl.toString();
              return <p> Please wait while we redirect you to PayPal </p>;
            }}
          />*/}
          <Route exact path="/dashboard" render={RouteGuard(ConnectedDashboard)} />
          <Route exact path="/reset-password" render={RouteGuard(ResetPasswordPage)} />
          <Route exact path="/register-user" render={RouteGuard(RegistrationPageContainer)} />
          <Route exact path="/order" render={RouteGuard(OrderPageContainer)} />
          <Route exact path="/buysingle" render={RouteGuard(BuySingleComponent)} />

        </section>
        <DevTools />
      </div>
      {/* // call spinner if app is running slow
        <div className="loader-wrapper" style={progress > 0 ? { display: 'block' } : { display: 'none' }}>
            <div className="loader-box">
                <div className="loader">Loading...</div>
            </div>
        </div>, */}
    </Provider>
  </Router>

);
