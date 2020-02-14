import React, { useState } from 'react';
import ReactDataGrid from 'react-data-grid';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'; //imports connect method
//import { Toolbar, Data } from 'react-data-grid-addons';

const Dashboard = ({ptSchoolColumnsArray, ptSchoolRowsArray})=>(
    //const [rows, setRows] = useState(ptSchoolRowsArray);
    //const dong = 1;
    //<div>
        <ReactDataGrid
            columns={ptSchoolColumnsArray}
            rowGetter={i => ptSchoolRowsArray[i]}
            rowsCount={60}
            minHeight={500} />
            //onGridSort={(sortColumn, sortDirection) =>
            //   setRows(sortRows(ptSchoolRowsArray, sortColumn, sortDirection))
            //}
       // />
    //</div>
)

function mapStateToProps(state){
    return {
        ptSchoolColumnsArray:state.ptSchoolColumnsArray,
        ptSchoolRowsArray:state.ptSchoolRowsArray
    }
} //connects groups.  Returns props of dashboard


const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
        if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
    };
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
};




export const ConnectedDashboard = connect(mapStateToProps)(Dashboard)