//parent of Dashboard
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store'
import { ConnectedDashboard } from "./Dashboard";
import { ConnectedLogin } from './Login'
import { AboutComponent } from './About'
import { ConnectedAccountPayWizard } from './wizard/wizard'
import { Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
//Router - parent component that all routes have to be inside
//Router - component that displays different depending what the URL is
import { history } from '../store/history';
import { ConnectedNavigation } from './Navigation';
import { ConnectTaskDetail } from './TaskDetail';
import { Redirect } from 'react-router';




const RouteGuard = Component =>({match}) =>{
    console.info("Route guard", match);
    if (!store.getState().session.authenticated && match.url != "/wizard")
    {
        return <Redirect to="/"/>
    } {
        return <Component match={match}/>
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
                <Route exact path ="/" component={ConnectedLogin}/>
                <Route exact path ="/about" component={AboutComponent}/>
                <Route exact
                       path ="/wizard"
                       render={RouteGuard(ConnectedAccountPayWizard)}/>
                <Route
                    exact
                    path="/dashboard"
                    render={RouteGuard(ConnectedDashboard)}
                />
                <Route
                    exact
                    path="/task/:id"
                    render={RouteGuard(ConnectTaskDetail)}
                    //render={({match})=>(<ConnectTaskDetail match={match}/>)}
                />
            </div>
        </Provider>
    </Router>

)