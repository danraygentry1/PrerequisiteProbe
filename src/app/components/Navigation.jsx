import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';


const Navigation = ()=>(
    <div>
        <Link to="/dashboard">

        </Link>
    </div>

); //DOM component connected to rest of application via connect method

export const ConnectedNavigation = connect(state=>state)(Navigation);
//invokes on (Navigation)

