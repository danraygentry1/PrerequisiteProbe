import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as mutations from '../store/mutations';
/*import { NavComponent } from './Nav';*/
import { ConnectedNav } from './Nav';
import { isTokenVerified, logout } from "../../auth/Auth"
import {HeaderComponent} from "./Header";

export const LoginComponent = ({authenticateUser, createAccount, authenticated})=>{
  return <div>
      <ConnectedNav />
      <HeaderComponent />
        <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center">
            <div className="row p-3">
              <div className="card-body border-dark card border-1 m-1">
                    <h5 className="card-title">Please Login</h5>
                    <form onSubmit={authenticateUser}>
                        <input type="text" placeholder="username" name="username"
                               className="form-control"/>
                        <input type = "password" placeholder="password" name = "password"
                              defaultValue = "" className="form-control mt-2" />
                        {authenticated === mutations.NOT_AUTHENTICATED ? <p>
                            Login incorrect</p> : null}
                        <br/>
                        <button type="submit" className="form-control mt2 btn btn-primary">Login</button>
                        <span><Link to="/reset-password">Forgot user name or password?</Link></span>
                        <br/><br/>
                        <br/>
                    </form>
              </div>
              <div className="card-body border-dark card border-1 m-1">
                    <h5 className="card-title">New to Prerequisite Probe?</h5>
                  <p align="left">Create an account and purchase <br /> a lifetime membership for only $9.99!</p>
                    <button className="form-control mt2 btn btn-primary" onClick={createAccount}>Create Account</button>
              </div>
            </div>
        </div>
    </div>
};


const mapStateToProps = ({session})=>({
    authenticated:session.authenticated
});

const mapDispatchToProps = (dispatch)=>({
    authenticateUser(e){
    e.preventDefault();
        let username = e.target['username'].value;
        let password = e.target['password'].value;
        dispatch(mutations.requestAuthenticateUser(username,password));
        //dispatch(mutations.requestPurchaseProduct())
    },
    createAccount(e){
        dispatch(mutations.createAccount())
    }
});

export const ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);


/*
class LoginComponent extends Component {
    constructor(props) {
        super(props);
    }
    render()
    {
        return <div>
            <NavComponent/>
            <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center">
                <div className="card-body">
                    <h5 className="card-title">Please Login</h5>
                    <form onSubmit={authenticateUser}>
                        <input type="text" placeholder="username" name="username"
                               className="form-control"/>
                        <input type="password" placeholder="password" name="password"
                               defaultValue="" className="form-control mt-2"/>
                        {authenticated === mutations.NOT_AUTHENTICATED ? <p>
                            Login incorrect</p> : null}
                        <br/>
                        <button type="submit" className="form-control mt2 btn btn-primary">Login</button>
                        <br/><br/>
                        New to Prerequisite Probe?
                        <br/>
                        <button className="form-control mt2" onClick={createAccount}>Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    }
};
//component, store, saga, back to component
//bootstrap - col-6 is column width of 6*/
