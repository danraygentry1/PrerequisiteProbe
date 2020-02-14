import React from 'react'
import { connect } from 'react-redux'; //imports connect method
import { ConnectedTaskList } from '../TaskList'

export const Dashboard = ({groups})=>(
    <div className={"row"}>
        {groups.map(group=>(
            <ConnectedTaskList key={group.id} id={group.id} name={group.name}
                               className={"col"}/>
        ))}
    </div>
)

function mapStateToProps(state){
    return {
        groups:state.groups
    }


} //connects groups.  Returns props of dashboard

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard)