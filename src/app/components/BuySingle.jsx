import React from 'react';
import { connect } from 'react-redux';
import { ConnectedNav } from './Nav';
import * as mutations from '../store/mutations';


export const BuySingleComponent = () => {
  const url = window.location.href;
  let paypalUrl = '';
  const hashes = url.split('?');
  for (let i = 1; i < hashes.length; i++) {
    paypalUrl += hashes[i];
  }
  window.location.href = paypalUrl.toString();
  return (
    <div>
      <ConnectedNav />
      <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center">
        <div className="card-body">
          <p>
            <h2> Please wait while we redirect you to PayPal... </h2>
          </p>
        </div>
      </div>
    </div>
  );
};
