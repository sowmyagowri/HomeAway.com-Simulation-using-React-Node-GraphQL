import React, {Component} from 'react';
import 'typeface-roboto'
import './PropertySearchResults.css';
import {Navbar} from "react-bootstrap";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo'
import { propertysearchquery } from '../queries/propertyqueries';

var longitude, lattitude, locationTitle;

class PropertySearchResults extends Component {
    
    constructor(props){
        super(props);
        console.log("Parameters are: ");
        console.log(this.props.history);
        this.state = {
            search : false,
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.searchPlace = this.searchPlace.bind(this);
        this.renderSearchResult = this.renderSearchResult.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout = () => {
        sessionStorage.clear();
        console.log("All cookies removed!")
        window.location = "/"
    }
    
    componentWillMount(){
        this.setState ({ 
            location : this.props.location.state?this.props.location.state.location:"",
            fromdate : this.props.location.state?this.props.location.state.fromDate:"",
            todate : this.props.location.state?this.props.location.state.toDate:"",
            noOfGuests: this.props.location.state?this.props.location.state.noOfGuests:"",
        })
    }

    renderSearchResult (searchData) {
        return Object.keys(searchData).map((i) => {
            return <div className="brdr bgc-white box-shad1 btm-mrg-20 property-listing" key={searchData[i].ID}>
            <div className="media">
                <img alt="Thumbnail View of Property" style={{height: "230px", width: "240px"}}src={`http://localhost:3001/uploads/${searchData[i].image1}`} />
                <div className="clearfix visible-sm"> </div>
                    <div className="media-body fnt-smaller">
                        <input id = "heading" style={{paddingLeft: "10px"}} value = {searchData[i].headline} type="text" readOnly="readOnly" />
                        <br></br><br></br>
                        <ul className="list-inline" style={{paddingLeft: "10px"}}>
                            <li className = "list-inline-item"><i className="fas fa-home"></i></li>
                            <li className = "list-inline-item">{searchData[i].propertyType}</li>
                            <li className = "list-inline-item"><i className="fas fa-bed"></i></li>
                            <li className = "list-inline-item"> {searchData[i].bedrooms} BR</li>
                            <li className = "list-inline-item"><i className="fas fa-bath"></i></li>
                            <li className = "list-inline-item"> {searchData[i].bathrooms} BA</li>
                            <li className = "list-inline-item"><i className="fas fa-user"></i></li>
                            <li className = "list-inline-item"> Sleeps  {searchData[i].sleeps}</li>
                        </ul>
                        <br></br><br></br><br></br>
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <div className="input-group-text" style={{border: "none"}}><i className="fa fa-bolt" style={{fontSize: "24px"}}></i></div>
                            </span>
                            <input type="text" className="form-control" style ={{background: "#ededed"}} id = "heading1" defaultValue = {searchData[i].currency + ' ' + searchData[i].baseRate} readOnly="true" />
                        </div>
                        <div className="input-group">
                            <h5 style ={{background: "#ededed", width: "503px"}}> <small>View details for total price</small> </h5>
                            <span className="input-group-append" style={{height: "22px",}}>
                                <div className="input-group-text" style={{border: "none"}}>
                                    <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                    <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                    <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                    <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                    <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                    (1)
                                </div>
                                
                            </span>
                        </div>
                        <Link className="view" to={`/property/${searchData[i]._id}/${this.state.location}/${this.state.fromdate}/${this.state.todate}/${this.state.noOfGuests}`} target="_blank">Dummy Link</Link>
                    </div>
                </div>
            </div>
    });
    }

    //searchLocation, fromdate, todate, no.ofGuests change handler to update state variable with the text entered by the user
    changeHandler(e) {
        console.log(e.target.value);
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleValidation(){
        let formIsValid = true;
    
        //Location
        if(!this.state.location){
            formIsValid = false;
            alert("Search Location is a Required field");
            console.log("Search Location cannot be empty");
        }
    
        
        var CurrentDate = new Date();
        CurrentDate.setHours(0,0,0,0);
        //From Date
        if(!this.state.fromdate){
          formIsValid = false;
          alert("From Date is a Required field");
          console.log("From Date cannot be empty");
        } else {
          var GivenfromDate = new Date(this.state.fromdate.replace(/-/g));
          if(GivenfromDate < CurrentDate){
            alert('From date should be greater than the current date.');
            formIsValid = false;
          }
        }
    
        //To Date
        if(!this.state.todate){
            formIsValid = false;
            alert("To Date is a Required field");
            console.log("To Date cannot be empty");
         } else {
          var GiventoDate = new Date(this.state.todate.replace(/-/g));
    
          if(GiventoDate < CurrentDate){
            alert('To date should be greater than the current date.');
            formIsValid = false;
          } else {
            if (GiventoDate <= GivenfromDate){
              alert('To date should be greater than from date.');
              formIsValid = false;
            }
          }
        }
    
         //Numberof guests
        if(!this.state.noOfGuests){
          formIsValid = false;
          alert("Number of guests is a Required field");
          console.log("No. of Guests cannot be empty");
        }
       return formIsValid;
    }

    //search location handler to send a request to the node backend
    searchPlace(event) {
        console.log("Inside search property");
        //prevent page from refresh
        event.preventDefault();
        if(this.handleValidation()){
            this.setState ({
                search: true,
            })
        }
    }

    render(){
        if(this.state.location.toLowerCase() === "san diego"){
            lattitude = 32.736349;
            longitude = -117.177871;
            locationTitle = this.state.location
        }
        if(this.state.location.toLowerCase() === "sunnyvale"){
            lattitude = 37.3688;
            longitude = -122.0363;
            locationTitle = this.state.location
            }
        if(this.state.location.toLowerCase() === "los angeles") {
            lattitude = 34.024212;
            longitude = -118.496475;
            locationTitle = this.state.location
        }
        if(this.state.location.toLowerCase() === "new york") {
            lattitude = 40.730610;
            longitude = -73.935242;
            locationTitle = this.state.location
        }
        if(this.state.location.toLowerCase() === "san franscisco") {
            lattitude = 37.773972;
            longitude = -122.431297;
            locationTitle = this.state.location
        }

        let isTravelerLoggedIn = false;
        if(sessionStorage.getItem('cookie1')){
            isTravelerLoggedIn = true
        }
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
                </Navbar.Header>
                <div className="box">
                    <div>
                        <img style={{marginTop: "13px"}} alt="US Flag" src={require('./us_flag.png')}/>
                    </div>
                    <button id="blue" className="btn" style = {{fontColor : "black", backgroundColor:"white", background:"white", borderColor:"white"}} type="button"><a >Trip Boards</a></button>
                    {!isTravelerLoggedIn 
                    ?
                    (
                    <div className="btn btn-group" id="white">
                        <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a >Login</a></button>
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
                        <a href="/inbox" title = "HomeAway" className = "logo"><img style = {{marginRight: "20px", }} alt="Mailbox" src={require('./mailbox.png')}/></a>
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
                        <div className="col-md-4 col-md-offset-3" style = {{marginLeft: "-50px"}}>
                            <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-prepend">
                                    <div className="input-group-text form-control" ><i className="fa fa-map-marker"></i></div>
                                </span>
                                <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"  defaultValue = {this.state.location} name="location" id="location" placeholder="Where do you want to go?" onChange = {this.changeHandler}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-offset-3">
                            <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                            <input placeholder="Arrive" defaultValue = {this.state.fromdate} onChange = {this.changeHandler} name="fromdate" type = "date" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value={this.state.fromdate}/>
                            </div>
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                            <div className="form-group card" style = {{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}> 
                            <input placeholder="Depart" defaultValue = {this.state.todate} onChange = {this.changeHandler} name="todate" type = "date" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value={this.state.todate}/>
                            </div>
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px", width: "18%"}}>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-prepend">
                                        <div className="input-group-text form-control" ><i className="fa fa-user-friends"></i></div>
                                    </span>
                                    <input type="number" min = "1" onChange = {this.changeHandler} name="noOfGuests" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value= {this.state.noOfGuests}/>
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                        <div className="form-group">
                            <button className="btn btn-primary" onClick = {this.searchPlace} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true" hidden="true">
                                Search
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </Navbar>
            <Query 
                query={propertysearchquery}
                variables={{ 
                    city : this.state.location,
                    startDate : this.state.fromdate,
                    endDate : this.state.todate,
                    noOfGuests: this.state.noOfGuests
                }}
            >
                { ({ loading, error, data }) => {
                    if (loading) return (
                        <div className = "container-full">
                            <div className="container-pad" style={{textAlign: "center"}}>
                                <h1> Fetching Search Data... </h1>
                            </div>
                        </div>
                        )
                    if (error) return <div> Error </div>;
                    console.log(data.propertysearch)
                    return (
                            <div className = "container-full">
                            {(data.propertysearch.length > 0)                                   
                            ?
                            (
                                <div className="container-pad">
                                    <div className="form-row">
                                        <div className="form-group col-sm-8" id = "property-listings" style ={{maxWidth : "800px"}}>
                                            <div className ="Content">
                                                { this.renderSearchResult(data.propertysearch) }
                                            </div>
                                        </div>
                                        <div className = "form-group col-sm-5" style = {{marginLeft: "20px", width : "800px"}}>
                                            <div className = "card-body border">
                                                <Map
                                                    id="myMap"
                                                    options={{
                                                    center: { lat: lattitude, lng:  longitude },
                                                    zoom: 8
                                                    }}
                                                    onMapLoad={map => {
                                                        new window.google.maps.Marker({
                                                            position: { lat: lattitude, lng:  longitude},
                                                            map: map,
                                                            title: locationTitle
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (   
                                <div className="container-pad" style={{textAlign: "center"}}>
                                    <h1> There are no listings matching your criteria </h1>
                                </div>
                            )
                            }
                        </div>
                    );
                }}
            </Query>
        </div>
        )
    }
}

class Map extends Component {
    constructor(props) {
      super(props);
      this.onScriptLoad = this.onScriptLoad.bind(this)
    }
  
    onScriptLoad() {
      const map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        this.props.options);
      this.props.onMapLoad(map)
    }
  
    componentDidMount() {
      if (!window.google) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = `https://maps.google.com/maps/api/js?key=AIzaSyCpk67Ig02fwUNe7in4kt0H23kahGTbLm8`;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
        // Below is important. 
        //We cannot access google.maps until it's finished loading
        s.addEventListener('load', e => {
          this.onScriptLoad()
        })
      } else {
        this.onScriptLoad()
      }
    }
  
    render() {
      return (
        <div style = {{width : "600px", height :"700px"}} id={this.props.id} />
      );
    }
  }

export default PropertySearchResults;
