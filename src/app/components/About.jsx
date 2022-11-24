import React from 'react';
import { connect } from 'react-redux';
import { ConnectedNav } from './Nav';
import * as mutations from '../store/mutations';
import { HeaderComponent } from './Header';


export const AboutComponent = () => (
  <div>
    <ConnectedNav />
    <HeaderComponent />
    <div className="card border-0 ">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card-body border-dark card border-1">
            <img className="card-img-top" src="../../../images/Pre%20PT%20Grind/pre-pt-grind-and-dan.jpg" alt="" />
          </div>
        </div>
        <div className="col-md-5">
          <div className="card-body border-dark card border-1">
            <h5 className="card-title">About Us:</h5>
            <p>
              We are the PT School Match team, which is a partnered resource between the Co-founders of Pre-PT Grind LLC, Joses Ngugi & Casey Coleman along with the creator of this software, Daniel Gentry!
            </p>
            <p>
              Dr. Joses & Dr. Casey are both physical therapists who realized that many students struggled to get into physical therapy school and have dedicated the past 8+ years helping students get into DPT programs without wasting time or money!
            </p>
            <p>
              We are the PT School Match team, which is a partnered resource between the Co-founders of Pre-PT Grind LLC, Joses Ngugi & Casey Coleman along with the creator of this software, Daniel Gentry!
            </p>
            <p>
              We are the PT School Match team, which is a partnered resource between the Co-founders of Pre-PT Grind LLC, Joses Ngugi & Casey Coleman along with the creator of this software, Daniel Gentry!
            </p>
            <p>
              {/* eslint-disable-next-line max-len */}
              That is why ‘PT School Match’ was built, as a way to help students match their stats with school-specific requirements. And since each individual student has specific criteria like cost, GRE score, GPA and observation hours that factor into their school application decisions. Currently, no easy way exists where this critical information is compiled into one place in an easily searchable format...Until Now.”
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
