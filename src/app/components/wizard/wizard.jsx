import React, { Component, Fragment } from 'react';
import StepWizard from 'react-step-wizard';
import { connect } from 'react-redux';
import md5 from 'md5';

import Nav from './nav';
import Plugs from './Plugs';

import styles from './wizard.less';
import transitions from './transitions.css';
import * as mutations from "../../store/mutations";
/* eslint react/prop-types: 0 */

/**
 * A basic demonstration of how to use the step wizard
 */
 class Wizard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {},
            transitions: {
                enterRight: `${transitions.animated} ${transitions.enterRight}`,
                enterLeft: `${transitions.animated} ${transitions.enterLeft}`,
                exitRight: `${transitions.animated} ${transitions.exitRight}`,
                exitLeft: `${transitions.animated} ${transitions.exitLeft}`,
                intro: `${transitions.animated} ${transitions.intro}`,
            },
            // demo: true, // uncomment to see more
        };
    }

    updateForm = (key, value) => {
        const { form } = this.state;

        form[key] = value;
        this.setState({ form });
    }

    // Do something on step change
    onStepChange = (stats) => {
        // console.log(stats);
    }

    setInstance = SW => this.setState({ SW })

    render() {
        const { SW, demo } = this.state;

        return (
            <div className='container-fluid'>
                <div className={'jumbotron'}>
                    <div className='row'>
                        <div className={`col-12 col-sm-6 offset-sm-3 ${styles['rsw-wrapper']}`}>
                            <StepWizard
                                onStepChange={this.onStepChange}
                                isHashEnabled
                                transitions={this.state.transitions} // comment out this line to use default transitions
                                nav={<Nav />}
                                instance={this.setInstance}
                            >
                                <First hashKey={'FirstStep'} update={this.updateForm} createUser={this.props.createUser} />
                                <Second hashKey={'SecondStep'} form={this.state.form} purchaseProduct={this.props.purchaseProduct} />
                                {/* <Progress />
                                <Last hashKey={'TheEnd!'} />*/}
                            </StepWizard>
                        </div>
                    </div>
                </div>
                { (demo && SW) && <InstanceDemo SW={SW} /> }
            </div>
        );
    }
}

/** Demo of using instance */
const InstanceDemo = ({ SW }) => (
    <Fragment>
        <h4>Control from outside component</h4>
        <button className={'btn btn-secondary'} onClick={SW.previousStep}>Previous Step</button>
        &nbsp;
        <button className={'btn btn-secondary'} onClick={SW.nextStep}>Next Step</button>
    </Fragment>
);

/**
 * Stats Component - to illustrate the possible functions
 * Could be used for nav buttons or overview
 */
const Stats = ({
                   currentStep,
                   firstStep,
                   goToStep,
                   lastStep,
                   nextStep,
                   previousStep,
                   totalSteps,
                   step,
                   purchaseProduct,
                   createUser,
                   userObj,
                   isValid
               }) => (
    <div>
        <hr />
        { step < totalSteps ?
            //onClick={nextStep}
            //onClick={createUser(userObj)}
            <button className='form-control mt2 btn btn-primary' onClick={nextStep} >Continue</button>
            :
            <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center wizard-background">
                <div className="card-body">
                    <button onClick={purchaseProduct}>
                        <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" alt="PayPal" />
                    </button>
                </div>
            </div>

        }
        <hr />
        { step > 1 &&
        <button className="form-control mt2 btn btn-primary flex-grow-0 flex align-items-center justify-content-center" onClick={previousStep}>Go Back</button>
        }
        {/*<hr />
        <div style={{ fontSize: '21px', fontWeight: '200' }}>
            <h4>Other Functions</h4>
            <div>Current Step: {currentStep}</div>
            <div>Total Steps: {totalSteps}</div>
            <button className='btn btn-block btn-default' onClick={firstStep}>First Step</button>
            <button className='btn btn-block btn-default' onClick={lastStep}>Last Step</button>
            <button className='btn btn-block btn-default' onClick={() => goToStep(2)}>Go to Step 2</button>
        </div>*/}
    </div>
);
const initialState = {
    first_name: "",
    last_name: "",
    user_name: "",
    password: "",
    password_hash: "",
    subscribed: false,
    email_address: "",
    isValid: false,

    userNameError: "",
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    passwordError: "",
};

/** Steps */

/*class First extends Component {
    update = (e) => {
        this.props.update(e.target.name, e.target.value);
    }

    render() {
        return (
            <div>
                <h3 className='text-center'>Create Account</h3>

                <label>Email</label>
                <input type='text' className='form-control' name='email' placeholder='xxx@gmail.com'
                       onChange={this.update} />
                <label>User Name</label>
                <input type='text' className='form-control' name='username'
                       onChange={this.update} />
                <label>Password</label>
                <input type='text' className='form-control' name='password'
                       onChange={this.update} />
                <Stats step={1} {...this.props} />
            </div>
        );
    }
}*/

export class First extends Component {
    state = initialState;

    handleChange = event => {
        const isCheckbox = event.target.type === "checkbox";
        this.setState({
            [event.target.name]: isCheckbox
                ? event.target.checked
                : event.target.value
        });
    };

    validate = () => {
        let userNameError = "";
        let emailError = "";
        let firstNameError = "";
        let lastNameError = "";
        // let passwordError = "";


        if (!this.state.user_name) {
            userNameError = "name cannot be blank";
        }

        if (!this.state.email_address.includes("@")) {
            emailError = "invalid email";
        }

        if (emailError || userNameError) {
            this.setState({ emailError, userNameError });
            return false;
        }
        this.setState({isValid: true})
        return true;
    };

    handleValidate = async () => {
         const isValid = this.validate();
        if (isValid) {
            await this.props.createUser(this.state)
            console.log(this.state);
            // clear form
            this.setState(initialState);
            this.props.nextStep();

        }
    };

    render() {
        return (
            <div>
                <h3 className='text-center'>Create Account</h3>
                <div className="row">
                    <hr />
                    <div className="card p-0 col-md-6 border-0">
                        <div className="card-body p-1">
                            <label>First Name</label>
                            <input
                                className='form-control'
                                name="first_name"
                                placeholder="First Name"
                                value={this.state.first_name}
                                onChange={this.handleChange}
                            />
                            <div style={{ fontSize: 12, color: "red" }}>
                                {this.state.firstNameError}
                            </div>
                        </div>
                    </div>
                    <div className="card p-0 col-md-6 border-0">
                        <div className="card-body p-1">
                            <label>Last Name</label>
                            <input
                                className='form-control'
                                name="last_name"
                                placeholder="Last Name"
                                value={this.state.last_name}
                                onChange={this.handleChange}
                            />
                            <div style={{ fontSize: 12, color: "red" }}>
                                {this.state.lastNameError}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <hr />
                    <div className="card p-0 col-md-6 border-0">
                        <div className="card-body p-1">
                            <label>User Name</label>
                            <input
                                className='form-control'
                                name="user_name"
                                placeholder="User Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                            <div style={{ fontSize: 12, color: "red" }}>
                                {this.state.userNameError}
                            </div>
                        </div>
                    </div>
                    <div className="card p-0 col-md-6 border-0">
                        <div className="card-body p-1">
                            <label>Password</label>
                            <input
                                className='form-control'
                                type="password"
                                name="password"
                                placeholder="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                            <div style={{ fontSize: 12, color: "red" }}>
                                {this.state.passwordError}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card p-0 col-md-6 border-0">
                        <div className="card-body p-1">
                            <label>Email</label>
                            <input
                                className='form-control'
                                name="email_address"
                                placeholder="Email Address"
                                value={this.state.email_address}
                                onChange={this.handleChange}
                            />
                            <div style={{ fontSize: 12, color: "red" }}>
                                {this.state.emailError}
                            </div>
                        </div>
                    </div>
                    <div className="card p-0 col-md-6 border-0">
                        <div className="card-body p-1">
                            <Stats step={1} {...this.props} nextStep={this.handleValidate} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Second extends Component {
    validate = () => {
        if (confirm('Are you sure you want to go back?')) { // eslint-disable-line
            this.props.previousStep();
        }
    }

    render() {
        return (
            <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center wizard-background">
                <div className="card-body">
                    { this.props.form.first_name && <h3>Hey {this.props.form.first_name}! 👋</h3> }
                    <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center wizard-background">
                        Click PayPal button below to order for $9.99!
                    </div>
                    <Stats step={2} {...this.props} previousStep={this.validate} purchaseProduct={this.props.purchaseProduct} />
                </div>
            </div>
        );
    }
}


class Last extends Component {
    submit = () => {
        alert('You did it! Yay!') // eslint-disable-line
    }

    render() {
        return (
            <div>
                <div className={'text-center'}>
                    <h3>This is the last step in this example!</h3>
                    <hr />
                    <Plugs />
                </div>
                <Stats step={4} {...this.props} nextStep={this.submit} />
            </div>
        );
    }
}

const AccountPayWizardComponent = ({authenticated, purchaseProduct, createUser})=>{

 return <div>
     <Wizard purchaseProduct={purchaseProduct} createUser={createUser} />
 </div>

};  //authenticateUser is a destructed argument.
    //component, store, saga, back to component
    //bootstrap - col-6 is column width of 6

const mapStateToProps = ()=>({

});
const mapDispatchToProps = (dispatch)=>({
    purchaseProduct(e){
        e.preventDefault();
        dispatch(mutations.requestPurchaseProduct());
    },
    async createUser (userObj) {
        let isFoundUser
        userObj.password_hash = md5(userObj.password)
         isFoundUser = dispatch(mutations.createUser(userObj))
    }
});

export const ConnectedAccountPayWizard = connect(mapStateToProps, mapDispatchToProps)(AccountPayWizardComponent);
