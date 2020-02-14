import React from 'react'
import { connect } from 'react-redux'; //imports connect method
import { ConnectedTaskList } from './TaskList'
import Grid from './Grid'
import {generatedata} from "../../sampledata/generatedata";

export const Dashboard = ({ptSchoolColumnsArray, ptSchoolRowsArray, ptSchoolCourseRowsArray})=>(
    <div>
        {
            <Grid columns={ptSchoolColumnsArray} rows={ptSchoolRowsArray} innerRows ={ptSchoolCourseRowsArray}  />
            //<Grid/>
        }
    </div>
)

function mapStateToProps(state){
    return {
        ptSchoolColumnsArray:state.ptSchoolColumnsArray,
        ptSchoolRowsArray:state.ptSchoolRowsArray,
        ptSchoolCourseRowsArray:state.ptSchoolCourseRowsArray
    }
    console.log(state.ptSchoolCourseRowsArray)
} //connects groups.  Returns props of dashboard


export const ConnectedDashboard = connect(mapStateToProps)(Dashboard)