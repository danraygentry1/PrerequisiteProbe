import { Route } from 'react-router';
import React from 'react';

export default (
  <Route>
    <Route exact path="/" />
    <Route exact path="/login" />
    <Route exact path="/about" />
    <Route exact path="/terms" />
    <Route exact path="/privacy" />

    <Route exact path="/dashboard" />
    <Route exact path="/reset-password" />
    <Route exact path="/register-user" />
    <Route exact path="/order" />
    <Route exact path="/buysingle" />
  </Route>
);
