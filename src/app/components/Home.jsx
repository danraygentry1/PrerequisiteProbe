import React from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { ConnectedNav } from './Nav';
import * as mutations from '../store/mutations';
import { HeaderComponent } from './Header';


export const HomeComponent = () => (
  <div>
    <ConnectedNav />
    <HeaderComponent />
    <div className="container-fluid text-nowrap">
      <div className="row text-nowrap">
        <div className="card p-0 col-md-2 border-0 text-nowrap flex-grow-0 flex align-items-center justify-content-center">
          <div className="card-body">
            {/* <span className="text-nowrap flex-grow-0 flex align-items-left justify-content-left"> */}
            {' '}
            <a href="http://www.preptgrind.com" target="_blank"><img src="../../../images/Pre%20PT%20Grind/Pre-Pt%20Grind%20Blue%2030%25%20partnership.png" alt="" /></a>
            {' '}
            {/* </span> */}
          </div>
        </div>
        <div className="card p-0 col-md-8 border-0 text-nowrap flex-grow-0 flex align-items-center justify-content-center">
          <div className="card-body">
            {/* <span className="text-nowrap flex-grow-0 flex align-items-center justify-content-center"> */}
             Youtube Link: <a href="https://youtu.be/Pg-hBnJnEMU" target="_blank">Click Here</a>
              <ReactPlayer
                  playing
                  url="https://youtu.be/Pg-hBnJnEMU"
              />
            {/* </span> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);
