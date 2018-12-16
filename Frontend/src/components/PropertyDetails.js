import React, {Component} from 'react';
import './PropertyDetails.css';
import 'typeface-roboto'
import moment from 'moment';
import {Navbar} from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Helmet from 'react-helmet';
import Tabs from 'react-web-tabs/lib/Tabs';
import Tab from 'react-web-tabs/lib/Tab';
import TabPanel from 'react-web-tabs/lib/TabPanel';
import TabList from 'react-web-tabs/lib/TabList';
import SweetAlert from 'react-bootstrap-sweetalert';

import ApolloClient from 'apollo-boost';
import { Mutation } from 'react-apollo'
import { propertydetailsfetchquery } from '../queries/propertyqueries';
import { bookpropertymutation } from '../mutations/bookpropertymutation';

// apollo client setup
const client = new ApolloClient({
  uri: 'http://localhost:3001/homeaway/graphql'
});

class PropertyDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
          isTravelerLoggedIn: false,
          propertyid: this.props.match.params.id,
          location : this.props.match.params.location,
          fromdate : this.props.match.params.fromdate,
          todate : this.props.match.params.todate,
          noOfGuests:this.props.match.params.noOfGuests,
          guests :"",
          nightlyrate : "",
          bookingFromDate :"",
          bookingToDate :"",
          isLoading : true,
          requestedDays : 0,
          price : 0,
          propertyDetails: [{}],
          adate : false,
          ddate : false,
          pguests : false,
          alert: null,
          booked : false,
          message: "",
        };
        this.logout = this.logout.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.noOfGuestsChangeHandler = this.noOfGuestsChangeHandler.bind(this);
        this.submitBooking = this.submitBooking.bind(this);
    }
    
    componentWillMount () {
        console.log("In Property Details");

        client.query({ query: propertydetailsfetchquery,
            variables: { propertyID: this.state.propertyid }
            })
            .then ( ({data}) => {
                console.log(data);
                this.setState({propertyDetails : data.propertydetails});                    
            })
    }
    
    fromDateChangeHandler = (e) => { 
        e.preventDefault();
        this.setState({bookingFromDate : e.target.value,
            adate: true
        })
    }

    toDateChangeHandler = (e) => {
        e.preventDefault();
        this.setState({bookingToDate : e.target.value,
             ddate: true
        })
    }

    noOfGuestsChangeHandler = (e) => {
        this.setState ({
            guests : e.target.value,
            pguests : true
        })
    }

    handleValidation(error){
        
        error.graphQLErrors.map( errorMessage => {
            console.log(errorMessage.message)
            this.setState({
                message:  errorMessage.message
            })
        })

    }

    logout = () => {
        sessionStorage.clear();
        console.log("All cookies removed!")
        window.location = "/"
    }

    shouldComponentUpdate(nextState) {
        if (nextState.bookingFromDate !== this.state.bookingFromDate) {
            return true; }
        if (nextState.bookingToDate !== this.state.bookingToDate) {
            return true; }
        else {
            return false }
    }

    shouldComponentUpdate(prevState){
        if (prevState.bookingFromDate !== this.state.bookingFromDate){
            return true;
        }
        if (prevState.bookingToDate !== this.state.bookingToDate){
            return true;
        } else {
            return false
        }
    }

    submitBooking = () => {
        const getAlert = () => (
            <SweetAlert 
            success 
            title = "Congratulations!!"
            onConfirm={() => window.close()}> 
            You successfully booked this property!!!
            </SweetAlert>
        );
    
        if (this.state.adate && this.state.ddate && this.state.pguests && this.state.isTravelerLoggedIn) {
            this.setState({
                alert: getAlert(),
            })
        }
    }

    render(){

        if(sessionStorage.getItem('cookie1') === 'travellercookie' ){
            this.state.isTravelerLoggedIn = true
        }

        const {propertyDetails} = this.state;

        var start = moment(this.state.bookingFromDate, "YYYY-MM-DD");
        var end = moment(this.state.bookingToDate, "YYYY-MM-DD");
        //Difference in number of days
        var difference = (moment.duration(end.diff(start)).asDays());
        var price = difference * propertyDetails.baseRate;

        this.state.price = price;

        return(
          <div>
            <Helmet>
              <style>{'body { background-color: white; }'}</style>
            </Helmet>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                    <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                    </Navbar.Brand>
                    <div className="col-sm-12 col-sm-offset-12" style={{left: "595px", fontSize: "15px"}}>
                        {this.state.message &&
                            <div className={`alert alert-danger`}>{this.state.message}</div>
                        }
                    </div>
                </Navbar.Header>
                <div className="box">
                    <div>
                        <img style={{marginTop: "13px"}} alt="US Flag" src={require('./us_flag.png')}/>
                    </div>
                    <button id="blue" className="btn" style = {{fontColor : "black", backgroundColor:"white", background:"white", borderColor:"white"}} type="button"><a>Trip Boards</a></button>
                    {!this.state.isTravelerLoggedIn 
                    ?
                    (
                    <div className="btn btn-group" id="white">
                        <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a>Login</a></button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/traveller/login">Traveller Login</a>
                            <a className="dropdown-item" href="/owner/login">Owner Login</a>
                        </div>
                    </div>
                    )
                    :
                    (
                    <div>
                        <div className="btn btn-group" id="white" style = {{marginRight: "160px", width: "50px", }}>
                            <button className="dropdown-toggle" style = {{color: "#0067db", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {sessionStorage.getItem('cookie3')} </button>
                            <div className="dropdown-menu">
                            <a className="dropdown-item" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a>
                            <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                            <a className="dropdown-item"  onClick= {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        <img style = {{marginRight: "20px", }} alt="US Flag" src={require('./mailbox.png')}/>
                    </div>
                    )
                    }
                    <button className="btn" style = {{color: "#fff", fontSize: "15px", margin: "0 15px", padding: "12px 40px",fontFamily: "Lato,Arial,Helvetica Neue,sans-serif", height: "40px", backgroundColor:"#fff", width: "200px", borderRadius: "40px", borderColor: "#d3d8de"}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                        <a href="/owner/login">List your Property</a>
                    </button>
                    <img src={require('./logo.png')} alt="Homeaway Logo"/>
                </div>
            <div className="container" style = {{marginTop :"1%"}}>
              <div className="row">
                  <div className="col-md-4 col-md-offset-3">
                      <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <div className="input-group-text form-control" ><i className="fa fa-map-marker"></i></div>
                            </span>
                            <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" name="search" id="search" defaultValue = {this.state.location} readOnly/>
                        </div>
                      </div>
                  </div>
                  <div className="col-md-offset-3">
                      <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                        <input placeholder="Arrive" type = "date" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value={this.state.fromdate} readOnly />
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group card" style = {{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}> 
                        <input placeholder="Depart" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" type = "date" readOnly value={this.state.todate} />
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <div className="input-group-text form-control" ><i className="fa fa-user-friends"></i></div>
                            </span>
                            <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value= {this.state.noOfGuests} readOnly/>
                        </div>
                      </div> 
                  </div>
                  </div>
            </div>
            </Navbar>
            <div className = "container-full">
                <div className="container-pad">
                    <div className="form-row ">
                        <div className="form-group col-sm-8 FixedHeightContainer border" id = "property-listings" style ={{maxWidth : "1000px"}}>
                            <div style = {{background: "#D6EBF2"}}  className ="Content">
                                <Carousel showThumbs={false}>
                                    <div>
                                        <img alt="Image 1" className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image1}`} />
                                    </div>
                                
                                    <div>
                                        <img alt="Image 2" className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image2}`} />
                                    </div>
                                    <div>
                                        <img alt="Image 3" className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image3}`} />
                                    </div>
                                    <div>
                                        <img alt="Image 4" className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image4}`} />
                                    </div>
                                <   div>
                                        <img alt="Image 5" className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image5}`} />
                                    </div>
                                </Carousel>
                            <div>
                            <Tabs defaultTab="one"
                            onChange={(tabID) => { console.log(tabID)}}>
                                <TabList>
                                <div className="topnav">
                                    <div className = "row">
                                    <div className = "col-md-2">
                                        <Tab tabFor="one" style = {{marginTop : "20px", borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Overview</a></Tab>
                                    </div>
                                    <div className = "col-md-2">
                                        <Tab tabFor="two" style = {{marginTop : "20px", borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Amenities</a></Tab>
                                    </div>
                                    </div>
                                </div>
                                </TabList>
                                <TabPanel tabId="one">
                                    <div className = "container" style = {{marginTop : "20px"}}>
                                        <h4 className="media-heading"><img style={{height: "35px"}} alt="Small Map" src={require('./maps-icon.png')}/>{propertyDetails.headline}</h4>
                                        <div className = "row" style = {{marginTop :"20px"}}>
                                        <h2><img alt="Pindrop Sign" style={{height: "35px"}} src={require('./pindrop.png')}/>{propertyDetails.city}, {propertyDetails.state}, {propertyDetails.country}</h2>
                                        </div>
                                        <div className = "row" style = {{marginTop :"20px"}}>
                                        <ul className="list-inline">
                                            <li className = "list-inline-item">{propertyDetails.propertyType}</li>
                                            <li className = "list-inline-item dot"></li>
                                            <li className = "list-inline-item"> {propertyDetails.bedrooms} BR</li>
                                            <li className = "list-inline-item dot"></li>
                                            <li className = "list-inline-item"> {propertyDetails.bathrooms} BA</li>
                                            <li className = "list-inline-item dot"></li>
                                            <li className = "list-inline-item"> Sleeps  {propertyDetails.sleeps}</li>
                                        </ul>
                                        </div>
                                        <div className = "row" style = {{marginTop :"10px"}}>
                                        <p className = "para-font">{propertyDetails.description}</p>
                                        </div> 
                                    </div>
                                </TabPanel>
                                <TabPanel tabId = "two">
                                <div className = "container" style = {{marginTop : "20px"}}>
                                        <hr/> 
                                        <div className = "row" style = {{marginTop :"20px"}}>
                                        <p className = "para-font">{propertyDetails.amenities}</p>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                            </div>
                            </div>
                        </div>
                        <div className = "form-group col-md-3 border" style = {{height: "510px"}} >
                            <div className = "card-body " style = {{background: "#b4ecb4", width : "385px"}}>
                                <div className="row">
                                    <div className="col-xs-1"><h4 className="media-heading">$ {propertyDetails.baseRate}</h4></div>
                                    <div className="col-sm-2" style = {{marginTop : "6px"}}><h6 className="media-heading">avg/night</h6>
                                </div>
                            </div>
                            <div className = "container" style = {{marginTop : "30px"}}>
                                <div className="row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group" style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>Arrive</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-offset-6">
                                        <div className="form-group card" style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                        <input onChange={this.fromDateChangeHandler} style = {{height: "40px", width: "150px"}} value={this.state.bookingFromDate} type="date" name="fromdate"/>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>Depart</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-6">
                                        <div className="form-group card" style = {{ fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                     <input onChange={this.toDateChangeHandler} style = {{height: "40px", width : "150px"}} value={this.state.bookingToDate} type="date" name="todate"/>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>No of Guests</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-8">
                                        <div className="form-group card" style = {{height: "40px", marginLeft : "-9px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <input type="number" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"
                                            value={this.state.guests} onChange = {this.noOfGuestsChangeHandler} min="1"/>
                                            <span className="glyphicon glyphicon-search form-control-feedback"></span>
                                         </div>
                                    </div>
                                </div>
                                    {(this.state.adate  && this.state.ddate && this.state.pguests ?
                                            <div className = "row">
                                                <div className="col-md-offset-3">
                                                    <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                                        <h5>Price for {difference} nights is ${this.state.price}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                    :
                                    null
                                    )}
                                    <div className="form-group" style ={{marginLeft : "50px", marginTop : "40px"}}>
                                        <Mutation
                                            mutation={bookpropertymutation}
                                            variables={{ propertyid: this.state.propertyid,
                                                bookedBy: sessionStorage.getItem('cookie2'),
                                                bookedFrom : this.state.bookingFromDate,
                                                bookedTo : this.state.bookingToDate,
                                                NoOfGuests : this.state.guests,
                                                pricePaid : price
                                            }}
                                            onError={ error => this.handleValidation(error) }
                                            onCompleted= { data => {this.submitBooking(data) }}
                                        >
                                            {mutation => (
                                                <button className="btn btn-primary" onClick = {mutation} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "200px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                                    Book Now
                                                </button>
                                            )}
                                        </Mutation>
                                        {this.state.alert}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

    )
    }
}

export default PropertyDetails;
