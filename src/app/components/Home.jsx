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
    <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center">
      <div className="card-body">
        <h5 className="card-title">About Us:</h5>
        {/*   <p>
                    I know first hand how difficult the process of finding the right graduate school(s) can be.  As a Software Developer turned Pre-Physical therapy student
                    who was eventually accepted into school, I despised the difficult process of finding the right school;
                    Thus, I created a way to help students match their stats with school-specific requirements.  Indeed, each individual student has specific
                    criteria like cost, GRE score, GPA and observation hours that factor into their school application decisions.  Currently, no easy way exists where
                    this critical information is compiled into one place in an easily searchable format...Until Now.
                </p> */}
        <ReactPlayer
          playing
          url="https://youtu.be/9IOi2EB5wNI"
        />
      </div>
    </div>
  </div>
);
