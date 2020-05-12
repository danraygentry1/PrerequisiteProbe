import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import * as mutations from '../store/mutations';
import { isTokenVerified, logout } from '../../auth/Auth';
import { LoginComponent } from './Login';
import { store } from '../store';
import { Dashboard } from './Dashboard';


export const NavComponent = ({ firstName }) => (

  <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div className="container">
      {/*<img src="../../../images/FullColor_IconOnly_10%25x10%25_72dpi.png" alt="" />*/}
      <Link className="collapse navbar-collapse" to="/">Home</Link>
      {/*<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>*/}
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="mailto:danraygentry@gmail.com?subject=Prerequisite Probe Question" target="_blank">Contact</a>
          </li>
          <li className="nav-item">
            {isTokenVerified(Cookies.get('auth'))
              ? (
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              ) : ''}
          </li>
          <li className="nav-item">
            {isTokenVerified(Cookies.get('auth'))
              ? (
                <Link className="nav-link" onClick={logout} to="/login">
                  Welcome,
                  {' '}
                  {firstName}
                  {' '}
                  | Logout
                </Link>
              )
              : <Link className="nav-link" to="/login">Login</Link>}
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

function mapStateToProps(state) {
  return {
    firstName: state.firstName,
  };
} // connects groups.  Returns props of dashboard*/

export const ConnectedNav = connect(mapStateToProps)(NavComponent);
