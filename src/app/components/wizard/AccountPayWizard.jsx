import React from 'react';
import * as mutations from '../../store/mutations'
import { connect } from 'react-redux';
import StepWizard from 'react-step-wizard';

class Account extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <form>
                <h2>Account {this.props.currentStep}</h2>
                <p>Total Steps: {this.props.totalSteps}</p>
                <p>Is Active: {this.props.isActive}</p>
                <p><button onClick={this.props.previousStep}>Previous Step</button></p>
                <p><button onClick={this.props.nextStep}>Next Step</button></p>
                <p><button onClick={()=>this.props.goToStep(2)}>Step 2</button></p>
                <p><button onClick={this.props.firstStep}>First Step</button></p>
                <p><button onClick={this.props.lastStep}>Last Step</button></p>

            </form>
        );
    }
}
class Pay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <form>
                <h2>Pay {this.props.currentStep}</h2>
                <p>Total Steps: {this.props.totalSteps}</p>
                <p>Is Active: {this.props.isActive}</p>
                <p><button onClick={this.props.previousStep}>Previous Step</button></p>
                <p><button onClick={this.props.nextStep}>Next Step</button></p>
                <p><button onClick={()=>this.props.goToStep(2)}>Step 2</button></p>
                <p><button onClick={this.props.firstStep}>First Step</button></p>
                <p><button onClick={this.props.lastStep}>Last Step</button></p>

            </form>
        );
    }
}


const AccountPayWizardComponent = ({authenticated})=>{

    return <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center">
        <div className="card-body">
            <h5 className="card-title">Create Account</h5>
            <StepWizard>
                <div>
                    <Account />
                </div>

                <div>
                    <Pay />
                </div>

            </StepWizard>

        </div>
    </div>

};  //authenticateUser is a destructed argument.
    //component, store, saga, back to component
    //bootstrap - col-6 is column width of 6

const mapStateToProps = ({session})=>({
    authenticated:session.authenticated
});

export const ConnectedAccountPayWizard = connect(mapStateToProps)(AccountPayWizardComponent);

