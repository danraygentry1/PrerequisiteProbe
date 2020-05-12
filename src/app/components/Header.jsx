import React from 'react';
import { Link } from "react-router-dom"
import * as mutations from '../store/mutations'
import { connect } from 'react-redux';

export const HeaderComponent = ()=>{
    return <header>
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"/>
                </ol>
                <div className="carousel-inner" role="listbox">
                    <div className="carousel-item active">
                        <div className="parent d-flex justify-content-center flex align-items-center">
                            <img src="../../../images/Prerequiste Probe Cropped6_1024x1024.png" alt="" width={200} />
                        </div>
                    </div>
                </div>
        </div>
    </header>
}
