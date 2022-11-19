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
        <div
          className="parent d-flex justify-content-center flex align-items-center"
          style={{ marginTop: '30px', marginBottom: '25px' }}

        >
          <img src="../../../images/Pre%20PT%20Grind/pt_school_match_gold_large_15.png" alt="" />
        </div>
      </header>
    </div>
  );
};
