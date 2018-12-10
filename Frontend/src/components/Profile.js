import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './Profile.css';
import {Navbar} from "react-bootstrap";

import { Query, Mutation } from 'react-apollo'
import { profilesavemutation } from '../mutations/signupLoginProfilemutations';
import { profilefetchquery } from '../queries/profilequery';

//var canEdit = false;
//Define a Login Component
class Profile extends Component{
    
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = { 
            profiledata : [], 
            year : "" , 
            firstnameisValid: true, 
            firstnameMessage: "" , 
            lastnameisValid: true, 
            lastnameMessage: "",
            message: "",
            canEdit: false
        };

        //Bind the handlers to this class
        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.makeEditable = this.makeEditable.bind(this);
    }

    logout = () => {
        sessionStorage.clear();
        console.log("All cookies removed!")
        window.location = "/"
    }

    profileFetch = async (data) => {
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

    firstnameChangeHandler = (e) => {
        this.setState({ 
            firstname: e.target.value,
            firstnameisValid: true, 
            firstnameMessage: "" , 
         });
    }

    lastnameChangeHandler = (e) => {
        this.setState({ 
            lastname: e.target.value,
            lastnameisValid: true, 
            lastnameMessage: "" , 
         });   
    }

    //change handler to update state variable with the text entered by the user
    changeHandler = (e) => {

        this.setState({ [e.target.name]: e.target.value });
    }

    handleValidation(){
        let formIsValid = true;

        //Firstname
        if(!this.state.firstname){
            formIsValid = false;
            this.setState({
                firstnameMessage: "First Name is a Required field",
                firstnameisValid: false,
            });
            console.log("First Name cannot be empty");
        } else if(typeof this.state.firstname !== "undefined"){
            if(!this.state.firstname.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                this.setState({
                    firstnameMessage: "First Name cannot contain numbers",
                    firstnameisValid: false,
                })
                console.log("First Name cannot contain numbers");
            }        
        }

        //Lastname
        if(!this.state.lastname){
            formIsValid = false;
            this.setState({
                lastnameMessage: "Last Name is a Required field",
                lastnameisValid: false,
            });
            console.log("Last Name cannot be empty");
        } else if(typeof this.state.lastname !== "undefined"){
            if(!this.state.lastname.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                this.setState({
                    firstnameMessage: "Last Name cannot contain numbers",
                    firstnameisValid: false,
                })
                console.log("Last Name cannot contain numbers");
            }        
        }

        return formIsValid;
   }

    makeEditable = (fetchedData) => {
        
        this.state.created = fetchedData.created;
        this.state.firstname = fetchedData.firstname;
        this.state.lastname = fetchedData.lastname;
        this.state.aboutMe = fetchedData.aboutMe;
        this.state.city = fetchedData.city;
        this.state.state = fetchedData.state;
        this.state.country = fetchedData.country;
        this.state.company = fetchedData.company;
        this.state.school = fetchedData.school;
        this.state.hometown = fetchedData.hometown;
        this.state.languages = fetchedData.languages;
        this.state.gender = fetchedData.gender;
        this.state.phone = fetchedData.phone;
        this.setState ({
            canEdit: true
        })
    }

    displayMessage = async (data) => {
        if (this.handleValidation()) {
            const { status, message } = data.profilesave
            if (status === 200) {
                this.setState({
                    message:  message
                });
            }
        }
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(!sessionStorage.getItem('cookie1')){
            redirectVar = <Redirect to= "/"/>
        }
        
        return(
            <div>
                {redirectVar}
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                        </Navbar.Brand> 
                        <div className="col-sm-12 col-sm-offset-8" style={{ marginBottom: "-2rem", left: "400px", fontSize: "18px"}}>
                        {this.state.message &&
                            <div className={`alert alert-success`}>{this.state.message}</div>
                        }
                        </div>
                    </Navbar.Header>
                    <div>
                        {(sessionStorage.getItem('cookie1') === 'travellercookie') 
                        ?
                        (
                        <div className="btn btn-group" id="white">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {sessionStorage.getItem('cookie3')} </button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a>
                                <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item"  onClick= {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        )
                        :
                        (
                        <div className="btn btn-group" id="white">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {sessionStorage.getItem('cookie3')}</button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a>
                                <a className="dropdown-item" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a>
                                <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item" onClick = {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        )
                    }
                    <img style={{marginLeft: "50px"}} src={require('./logo.png')} alt="Homeaway Logo"/>
                    </div>
                </Navbar>
                <div className="container">
                </div>
                <div style={{backgroundColor: "white", borderLeftColor:"white",borderRightColor:"white",borderBottomColor: "#d6d7da", borderTopColor: "#d6d7da", borderStyle: "solid"}}>
                {(sessionStorage.getItem('cookie1') === 'travellercookie') 
                ?
                (
                    <div id="conttab" className="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" className="one"><a id="linktab" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a></li>
                            <li id="ulinktab" className="two"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                            <hr id="hrtab" />
                        </ul>
                    </div>
                )
                :
                (
                    <div id="conttab" className="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" className="one"><a id="linktab" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a></li>
                            <li id="ulinktab" className="two"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                            <li id="ulinktab" className="three"><a id="linktab" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a></li>
                            <hr id="hrtab" />
                        </ul>
                    </div>
                )
                }
                </div>
                <div className="image ">
                </div>
                {(!this.state.canEdit) 
                ?
                (
                    <Query 
                        query={profilefetchquery}
                        variables={{ email: sessionStorage.getItem('cookie2') }}
                    >
                        { ({ loading, error, data }) => {
                            if (loading) return <div> Fetching Profile Data....</div>;
                            if (error) return <div> Error </div>;
                            console.log(data.profilefetch)
                            return (
                                <div id = "profilehref" className="myprofilecontainer">
                                    <div className="login-form">
                                        <h1>{sessionStorage.getItem('cookie3')}</h1>
                                        <h2><small>Member since  <input id = "year" value={data.profilefetch.created} type="text" readOnly="readonly" /> </small></h2>
                                        <h1><small>Profile Information</small></h1>
                                        <br></br>
                                        <input type="text" className="form-control" name="firstname" value={data.profilefetch.firstname} placeholder="First Name" readOnly="readonly"/>
                                        <input type="text" className="form-control" name="lastname" value={data.profilefetch.lastname} placeholder="Last Name" readOnly="readonly"/>
                                        <div className="form-group">
                                            <textarea style={{height : "100px", cols:"40", rows: "5", }} type="text" className="form-control input-lg" name="aboutMe" value={data.profilefetch.aboutMe} placeholder="About me" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" name="city" value={data.profilefetch.city} placeholder="City" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <select style={{width:"100%"}} value={data.profilefetch.state} name="state" disabled="disabled">
                                                <option style={{color: "#ccc",}} value="" hidden>State</option>
                                                <option value="Alabama">Alabama</option>
                                                <option value="Alaska">Alaska</option>
                                                <option value="Arizona">Arizona</option>
                                                <option value="Arkansas">Arkansas</option>
                                                <option value="California">California</option>
                                                <option value="Colorado">Colorado</option>
                                                <option value="Connecticut">Connecticut</option>
                                                <option value="Delaware">Delaware</option>
                                                <option value="District of Columbia">District of Columbia</option>
                                                <option value="Florida">Florida</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="Guam">Guam</option>
                                                <option value="Hawaii">Hawaii</option>
                                                <option value="Idaho">Idaho</option>
                                                <option value="Illinois">Illinois</option>
                                                <option value="Indiana">Indiana</option>
                                                <option value="Iowa">Iowa</option>
                                                <option value="Kansas">Kansas</option>
                                                <option value="Kentucky">Kentucky</option>
                                                <option value="Louisiana">Louisiana</option>
                                                <option value="Maine">Maine</option>
                                                <option value="Maryland">Maryland</option>
                                                <option value="Massachusetts">Massachusetts</option>
                                                <option value="Michigan">Michigan</option>
                                                <option value="Minnesota">Minnesota</option>
                                                <option value="Mississippi">Mississippi</option>
                                                <option value="Missouri">Missouri</option>
                                                <option value="Montana">Montana</option>
                                                <option value="Nebraska">Nebraska</option>
                                                <option value="Nevada">Nevada</option>
                                                <option value="New Hampshire">New Hampshire</option>
                                                <option value="New Jersey">New Jersey</option>
                                                <option value="New Mexico">New Mexico</option>
                                                <option value="New York">New York</option>
                                                <option value="North Carolina">North Carolina</option>
                                                <option value="North Dakota">North Dakota</option>
                                                <option value="Northern Marianas Islands">Northern Marianas Islands</option>
                                                <option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option>
                                                <option value="Oregon">Oregon</option>
                                                <option value="Pennsylvania">Pennsylvania</option>
                                                <option value="Puerto Rico">Puerto Rico</option>
                                                <option value="Rhode Island">Rhode Island</option>
                                                <option value="South Carolina">South Carolina</option>
                                                <option value="South Dakota">South Dakota</option>
                                                <option value="Tennessee">Tennessee</option>
                                                <option value="Texas">Texas</option>
                                                <option value="Utah">Utah</option>
                                                <option value="Vermont">Vermont</option>
                                                <option value="Virginia">Virginia</option>
                                                <option value="Virgin Islands">Virgin Islands</option>
                                                <option value="Washington">Washington</option>
                                                <option value="West Virginia">West Virginia</option>
                                                <option value="Wisconsin">Wisconsin</option>
                                                <option value="Wyoming">Wyoming</option>
                                            </select>
                                            <br/>
                                        </div>
                                        <div className="form-group">
                                            <input value={data.profilefetch.country} type="text" className="form-control" name="country" placeholder="Country" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <input value={data.profilefetch.company} type="text" className="form-control" name="company" placeholder="Company" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <input value={data.profilefetch.school} type="text" className="form-control" name="school" placeholder="School" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <input value={data.profilefetch.hometown} type="text" className="form-control" name="hometown" placeholder="Hometown" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <input value={data.profilefetch.languages} type="text" className="form-control" name="languages" placeholder="Languages" readOnly="readonly"/>
                                        </div>
                                        <div className="form-group">
                                            <select style={{width:"100%"}} value={data.profilefetch.gender} name="gender" disabled="disabled">
                                                <option style={{color: "#ccc",}} value="" hidden>Gender</option>
                                                <option name="male"> Male</option>
                                                <option name="female">Female</option>
                                                <option name="other">Other</option>
                                            </select><br/>
                                            <h6 align = "left"><small>This is never shared</small></h6>
                                        </div>
                                        <div className="form-group">
                                            <input value={data.profilefetch.phone} type="text" className="form-control" name="phone" placeholder="Phone Number" readOnly="readonly"/>
                                        </div>
                                    </div>  
                                    <br></br>
                                    {this.makeEditable(data.profilefetch)} 
                                    <br/>
                                </div>
                            );
                        }}
                    </Query>
                )
                :
                (
                    <div id = "profilehref" className="myprofilecontainer">
                        <div className="login-form">
                            <h1>{sessionStorage.getItem('cookie3')}</h1>
                            <h2><small>Member since  <input id = "year" value={this.state.created} type="text" readOnly="readonly" /> </small></h2>
                            <h1><small>Profile Information</small></h1>
                            <br></br>
                            <div className={'form-group' + (!this.state.firstname ? ' has-error' : !this.state.firstnameisValid)}>
                                <input onChange = {this.firstnameChangeHandler} type="text" className="form-control" name="firstname" value={this.state.firstname} placeholder="First Name"/>
                                <div className="help-block">{this.state.firstnameMessage}</div>
                            </div>
                            <div className={'form-group' + (!this.state.lastname ? ' has-error' : !this.state.lastnameisValid)}>
                                <input onChange = {this.lastnameChangeHandler} type="text" className="form-control" name="lastname" value={this.state.lastname} placeholder="Last Name"/>
                                <div className="help-block">{this.state.lastnameMessage}</div>
                            </div>
                            <div className="form-group">
                                <textarea style={{height : "100px", cols:"40", rows: "5", }} onChange = {this.changeHandler} type="text" className="form-control input-lg" name="aboutMe" value={this.state.aboutMe} placeholder="About me"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} type="text" className="form-control" name="city" value={this.state.city} placeholder="City"/>
                            </div>
                            <div className="form-group">
                                <select style={{width:"100%"}} onChange={this.changeHandler} value={this.state.state} name="state">
                                    <option style={{color: "#ccc",}} value="" hidden>State</option>
                                    <option value="Alabama">Alabama</option>
                                    <option value="Alaska">Alaska</option>
                                    <option value="Arizona">Arizona</option>
                                    <option value="Arkansas">Arkansas</option>
                                    <option value="California">California</option>
                                    <option value="Colorado">Colorado</option>
                                    <option value="Connecticut">Connecticut</option>
                                    <option value="Delaware">Delaware</option>
                                    <option value="District of Columbia">District of Columbia</option>
                                    <option value="Florida">Florida</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Guam">Guam</option>
                                    <option value="Hawaii">Hawaii</option>
                                    <option value="Idaho">Idaho</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Indiana">Indiana</option>
                                    <option value="Iowa">Iowa</option>
                                    <option value="Kansas">Kansas</option>
                                    <option value="Kentucky">Kentucky</option>
                                    <option value="Louisiana">Louisiana</option>
                                    <option value="Maine">Maine</option>
                                    <option value="Maryland">Maryland</option>
                                    <option value="Massachusetts">Massachusetts</option>
                                    <option value="Michigan">Michigan</option>
                                    <option value="Minnesota">Minnesota</option>
                                    <option value="Mississippi">Mississippi</option>
                                    <option value="Missouri">Missouri</option>
                                    <option value="Montana">Montana</option>
                                    <option value="Nebraska">Nebraska</option>
                                    <option value="Nevada">Nevada</option>
                                    <option value="New Hampshire">New Hampshire</option>
                                    <option value="New Jersey">New Jersey</option>
                                    <option value="New Mexico">New Mexico</option>
                                    <option value="New York">New York</option>
                                    <option value="North Carolina">North Carolina</option>
                                    <option value="North Dakota">North Dakota</option>
                                    <option value="Northern Marianas Islands">Northern Marianas Islands</option>
                                    <option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option>
                                    <option value="Oregon">Oregon</option>
                                    <option value="Pennsylvania">Pennsylvania</option>
                                    <option value="Puerto Rico">Puerto Rico</option>
                                    <option value="Rhode Island">Rhode Island</option>
                                    <option value="South Carolina">South Carolina</option>
                                    <option value="South Dakota">South Dakota</option>
                                    <option value="Tennessee">Tennessee</option>
                                    <option value="Texas">Texas</option>
                                    <option value="Utah">Utah</option>
                                    <option value="Vermont">Vermont</option>
                                    <option value="Virginia">Virginia</option>
                                    <option value="Virgin Islands">Virgin Islands</option>
                                    <option value="Washington">Washington</option>
                                    <option value="West Virginia">West Virginia</option>
                                    <option value="Wisconsin">Wisconsin</option>
                                    <option value="Wyoming">Wyoming</option>
                                </select>
                                <br/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} value={this.state.country} type="text" className="form-control" name="country" placeholder="Country"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} value={this.state.company} type="text" className="form-control" name="company" placeholder="Company"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} value={this.state.school} type="text" className="form-control" name="school" placeholder="School"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} value={this.state.hometown} type="text" className="form-control" name="hometown" placeholder="Hometown"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} value={this.state.languages} type="text" className="form-control" name="languages" placeholder="Languages"/>
                            </div>
                            <div className="form-group">
                                <select style={{width:"100%"}} onChange={this.changeHandler} value={this.state.gender} name="gender">
                                    <option style={{color: "#ccc",}} value="" hidden>Gender</option>
                                    <option name="male"> Male</option>
                                    <option name="female">Female</option>
                                    <option name="other">Other</option>
                                </select><br/>
                                <h6 align = "left"><small>This is never shared</small></h6>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} value={this.state.phone} type="text" className="form-control" name="phone" placeholder="Phone Number"/>
                            </div>
                        </div>  
                        <br></br>
                        <div className="col-md-10 text-center"> 
                            <Mutation
                                mutation={profilesavemutation}
                                variables={{ email: sessionStorage.getItem('cookie2'), firstname: this.state.firstname, lastname : this.state.lastname, aboutMe: this.state.aboutMe, city: this.state.city, state: this.state.state, country: this.state.country,
                                    company: this.state.company, school: this.state.school, hometown: this.state.hometown, languages: this.state.languages, gender: this.state.gender, phone: this.state.phone}}
                                onCompleted= {data => {this.displayMessage(data)} }
                            >
                                {mutation => (
                                    <button onClick = {mutation} className="btn-primary btn-lg" > Save Changes </button>
                                )}
                            </Mutation>
                        </div>
                        <br/>
                    </div>
                )
                }
            </div>
        )
    }
}

//export Login Component
export default Profile;