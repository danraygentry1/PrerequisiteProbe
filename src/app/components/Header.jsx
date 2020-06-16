import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as mutations from '../store/mutations';

export const HeaderComponent = () => {
  const url = window.location.href;
  const hashes = url.split('/');
  const currentPage = hashes[3];

  return (
    <div>
      <header>
        <div className="parent d-flex justify-content-center flex align-items-center">
          <img src="../../../images/Prerequiste%20Probe%20Cropped9_1024x1024.png" alt="" width={200} />
        </div>
      </header>
    </div>
  );
};
