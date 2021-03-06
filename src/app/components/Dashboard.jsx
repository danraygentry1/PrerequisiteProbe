import React from 'react';
import { connect } from 'react-redux'; // imports connect method
import { ConnectedTaskList } from './TaskList';
import { ConnectedNav } from './Nav';
import { HeaderComponent} from './Header';
import Grid from './Grid';
import { generatedata } from '../../sampledata/generatedata';
/* import { NavComponent } from './Nav'; */


export const Dashboard = ({ ptSchoolColumnsArray, ptSchoolRowsArray, ptSchoolCourseRowsArray }) => (

  <div>
    {/* <NavComponent firstName={firstName} /> */}
    <ConnectedNav />
    {/*<HeaderComponent />*/}

    <Grid columns={ptSchoolColumnsArray} rows={ptSchoolRowsArray} innerRows={ptSchoolCourseRowsArray} />

  </div>
  /* <div>
            {
        <NavComponent/>
        <Grid columns={ptSchoolColumnsArray} rows={ptSchoolRowsArray} innerRows ={ptSchoolCourseRowsArray}  />
        //<Grid/>
        }
    </div> */

);

function mapStateToProps(state) {
  return {
    ptSchoolColumnsArray: state.ptSchoolColumnsArray,
    ptSchoolRowsArray: state.ptSchoolRowsArray,
    ptSchoolCourseRowsArray: state.ptSchoolCourseRowsArray,
  };
} // connects groups.  Returns props of dashboard


export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);
