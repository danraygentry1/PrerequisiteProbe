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
      <Link className="nav-link" to="/"><img src="../../../images/PT%20School%20Probe/PtSchoolProbe_250x25_72dpi.png" alt="" /></Link>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/terms">Terms</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/testimonials">Testimonials</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="mailto:ptschoolprobe@gmail.com?subject=PT School Probe Question" target="_blank">Contact</a>
          </li>
          <li className="nav-item">
            {isTokenVerified(Cookies.get('auth'))
              ? (
             <Link className="nav-link" to="/dashboard">Dashboard</Link>
              ) : ''}
          </li>
          <li className="nav-item">
            {!isTokenVerified(Cookies.get('auth'))
              ? (
                <Link className="nav-link" to="/register-user">Create Account</Link>
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
