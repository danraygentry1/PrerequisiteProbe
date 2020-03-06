//parent of Dashboard
import React from 'react';
import {connect, Provider} from 'react-redux';
import { store } from '../store'
import { ConnectedDashboard } from "./Dashboard";
import { ConnectedLogin } from './Login'
import { AboutComponent } from './About'
import { NavComponent} from "./Nav";
import { HeaderComponent} from "./Header"
import { isTokenVerified, logout } from "../../auth/Auth"
import { ConnectedAccountPayWizard } from './wizard/wizard'
import { Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
//Router - parent component that all routes have to be inside
//Router - component that displays different depending what the URL is
import { history } from '../store/history';
import { ConnectedNavigation } from './Navigation';
import { ConnectTaskDetail } from './TaskDetail';
import { Redirect } from 'react-router';
import  Cookies  from 'js-cookie'


const RouteGuard = Component =>({match}) =>{
    console.info("Route guard", match);
    //!verifyToken(store.getState().session.userToken) &&
    //if(!verifyToken(Cookies.get('auth')))
    //if (!store.getState().session.authenticated &&  match.url != "/wizard")
    //if(verifyToken(store.getState().session.userToken))
    //let tokenVerified = verifyToken(Cookies.get('auth'))
    if(!isTokenVerified(Cookies.get('auth')) && match.url != "/wizard")
    {
        return <Redirect to="/"/>}
    else {
        if (match.url === "/"){
            logout()
            return <Component match={match}/>
        } else {
            return <Component match={match}/>
        }
    }
}
//RouteGuard is a method that takes a component as an argument, which
//returns another method that takes an object as an argument and we just
//want the property of the object know as match.

export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                < ConnectedNavigation />
                < NavComponent/>
                < HeaderComponent/>
               {/*<Route exact
                       path ="/"
                       render={RouteGuard(ConnectedDashboard)}
                       //component={AboutComponent}
               />*/}
              {/*  <Route exact path ="/">
                    {<Redirect to="/login" />}
                </Route>*/}
                <Route exact
                       path ="/"
                       component={ConnectedLogin} />
                <Route exact path ="/about" component={AboutComponent}/>
                <Route exact
                       path ="/wizard"
                       render={RouteGuard(ConnectedAccountPayWizard)}/>
                <Route
                    exact
                    path="/dashboard"
                    render={RouteGuard(ConnectedDashboard)}
                />
                <Route path='/buysingle' component={() => {
                    let url = window.location.href
                    let paypalUrl = ""
                    let hashes = url.split("?")
                    for (let i = 1; i < hashes.length; i++) {
                        paypalUrl += hashes[i]
                    }
                    window.location.href = paypalUrl.toString();
                    return null;
                }}/>
            </div>
        </Provider>
    </Router>

)
