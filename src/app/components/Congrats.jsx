import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ConnectedNav } from './Nav';
import * as mutations from '../store/mutations';
import { HeaderComponent } from './Header';


export const CongratsComponent = () => (
  <div>
    <ConnectedNav />
    <HeaderComponent />
    <div className="card border-0 ">
      <div className="row justify-content-center align-content-center">
        <div className="mb-1" style={{ fontSize: 14, fontWeight: 'bold' }}>
          <p>Congrats on purchasing PT School Match.  Your Pre-Pt Journey just got a lot easier!</p>
          Return to Login Page
          {' '}
          <Link className="login" to="/login">Login</Link>
        </div>
      </div>
    </div>
  </div>
);
