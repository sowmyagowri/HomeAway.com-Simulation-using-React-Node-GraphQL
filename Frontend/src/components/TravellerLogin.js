import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Navbar} from "react-bootstrap";
import './OwnerLogin.css';

import { Mutation } from 'react-apollo'
import { travellerloginmutation } from '../mutations/signupLoginProfilemutations';

//Define a Login Component
class TravellerLogin extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email : "",
            password : "",
            submitted: false,
            message: "",
        }
        //Bind the handlers to this class
        this.changeHandler = this.changeHandler.bind(this);
    }

    //email and password change handler to update state variable with the text entered by the user
    changeHandler(e) {
        console.log(e.target.value);
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleValidation(){
        let formIsValid = true;

        //Email
        if(!this.state.email){
           formIsValid = false;
           alert("Login ID is a Required field");
           console.log("Login ID cannot be empty");
        }

        //Password
        if(!this.state.password){
            formIsValid = false;
            alert("Password is a Required field");
            console.log("Password cannot be empty");
        }
        
       return formIsValid;
   }

    submitlogin = async (data) => {
        const { cookie1, cookie2, cookie3, message } = data.travellerlogin
        sessionStorage.clear();
        sessionStorage.setItem('cookie1', cookie1);
        sessionStorage.setItem('cookie2', cookie2);
        sessionStorage.setItem('cookie3', cookie3);
        this.setState({ 
            submitted: true,
            message:  message
        });
    }

    render(){
        const { email, password, submitted, message } = this.state;
        //redirect based on successful login
        let redirectVar = null;
        console.log("Cookie is", sessionStorage.getItem('cookie1'));
        if(sessionStorage.getItem('cookie1') === 'travellercookie'){
            redirectVar = <Redirect to= "/"/>
        }
        
        return(
            <div>
                {redirectVar}
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                        </Navbar.Brand> 
                        <div className="col-sm-12 col-sm-offset-12" style={{left: "595px", fontSize: "15px"}}>
                        {message &&
                            <div className={`alert alert-danger`}>{message}</div>
                        }
                        </div>
                    </Navbar.Header>
                    <img src={require('./logo.png')} alt="Homeaway Logo"/>
                </Navbar>  
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="center">
                    <div id="yourdiv">
                        <h1 className="display-5">Log in to HomeAway</h1>
                        <h2><small>Need an account? <a className="bg-default" href="/traveller/signup1">Sign Up</a></small></h2>
                    </div>
                </div>
                <div className="container">
                    <div className="col-sm-6 col-sm-offset-6" style={{left: "400px"}}>
                        <div className="login-form">
                            <h2>Account Login</h2>  
                            <hr width="98%"></hr>         
                            <br></br>
                            <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                                <input onChange = {this.changeHandler} type="text" className="form-control" name="email" value={email} placeholder="Email Address" required/>
                                {submitted && !email &&
                                    <div className="help-block">Login ID is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                                <input onChange = {this.changeHandler} type="password" className="form-control" name="password" value={password} placeholder="Password" required/>
                                {submitted && !password &&
                                    <div className="help-block">Password is required</div>
                                }
                            </div>
                            <button id="opener_guid" type="button">Forgot Password?</button>
                            <br></br>
                            <br></br>
                            <div>
                                <Mutation
                                    mutation={travellerloginmutation}
                                    variables={{ email, password }}
                                    onCompleted={data => this.submitlogin(data)}
                                >
                                    {mutation => (
                                        <button onClick = {mutation} className="btn btn-warning" style={{width:"100%"}} >Log In</button>
                                    )}
                                </Mutation>
                            </div>
                            <br></br>
                            <div className="mydiv">
                                <span className="myspan">or</span>
                            </div>
                            <br></br>
                            <div>
                                <button className="mybtn facebook_button">Log in with Facebook</button>
                            </div>
                            <br></br>
                            <div>
                                <button className="mybtn google_button" >Log in with Google</button>
                            </div>
                            <br></br>
                            <font size="2">We don't post anything without your permission.</font>
                            <br></br>
                            <br></br>
                    </div>
                </div>
                </div>
                <br></br>
                <div className="center" id= "yourdiv">
                    <font size="1">Use of this Web site constitutes acceptance of the HomeAway.com Terms and Conditions and Privacy Policy.
                        <br></br>
                        ©2018 HomeAway. All rights reserved.</font>
                </div>
            </div>
        )
    }
}
//export Traveller Login Component
export default TravellerLogin;