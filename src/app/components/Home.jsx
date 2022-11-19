import React from 'react';
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
        <div className="card p-0 col-md-12 border-0 text-nowrap flex-grow-0 flex align-items-center justify-content-center">
          <div className="card-body">
              <div className="mb-1" style={{fontSize: 16, fontWeight: 'bold' }}>
                  Youtube Link:
                  {' '}
                  <a href="https://youtu.be/Pg-hBnJnEMU" target="_blank">Click Here</a>
              </div>


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
