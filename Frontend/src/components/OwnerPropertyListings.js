import React, {Component} from 'react';
import 'typeface-roboto'
import './OwnerPropertyListings.css';
import {Redirect} from 'react-router';
import {Navbar} from "react-bootstrap";
import moment from 'moment';
import { Query } from 'react-apollo'
import { ownerpropertylistingsquery } from '../queries/propertyqueries';

class OwnerPropertyListings extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            isLoading : true,
            allListings:[{}],
            detailsFetched:false,
        };
        
        this.renderListings = this.renderListings.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout = () => {
        sessionStorage.clear();
        console.log("All cookies removed!")
        window.location = "/"
    }
    
    renderListings (allListings) {
        return Object.keys(allListings).map((i) => {
            return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing" key={allListings[i].ID}>
            <div className="media">
                <a className="pull-left"  target="_parent">
                <img alt="Thumbnail View of Property" className="img-responsive" src={`http://localhost:3001/uploads/${allListings[i].image1}`} /></a>
                <div className="media-body">  
                    <h4 className="myh4" style={{paddingLeft: "10px"}}>{allListings[i].headline}</h4>
                    
                    <h6 className="myh6" style={{paddingLeft: "10px", justifyContent: "true"}}>{allListings[i].description}</h6>

                    <ul className="list-inline" style={{paddingLeft: "10px"}}>
                        <li className = "list-inline-item"><img alt="Pindrop Sign" style={{height: "35px"}} src={require('./pindrop.png')}/></li>
                        <li className = "list-inline-item">{allListings[i].streetAddress}</li>
                        <li className = "list-inline-item">{allListings[i].city}</li>
                        <li className = "list-inline-item">{allListings[i].state}</li>
                        <li className = "list-inline-item">{allListings[i].country}</li>
                    </ul>

                    <ul className="list-inline" style={{paddingLeft: "10px"}}>
                        <li className = "list-inline-item"><i className="fas fa-home"></i></li>
                        <li className = "list-inline-item">{allListings[i].propertyType}</li>
                        <li className = "list-inline-item"><i className="fas fa-bed"></i></li>
                        <li className = "list-inline-item"> {allListings[i].bedrooms} BR</li>
                        <li className = "list-inline-item"><i className="fas fa-bath"></i></li>
                        <li className = "list-inline-item"> {allListings[i].bathrooms} BA</li>
                        <li className = "list-inline-item"> <i className="fas fa-user"></i></li>
                        <li className = "list-inline-item"> Sleeps {allListings[i].sleeps}</li>
                        <li className = "list-inline-item"><i className="fa fa-calendar"></i></li>
                        <li className = "list-inline-item"> Min Stay {allListings[i].minStay}</li>
                    </ul>

                    <span>
                        <strong style ={{fontSize: "20px", paddingLeft: "10px"}}><span>{allListings[i].currency + ' ' + allListings[i].baseRate + ' /night'}</span></strong>
                    </span>
                    <br></br>
                    <br></br>
                    <span>
                        <strong style ={{fontSize: "16px", color: "#ff07ea", paddingLeft: "10px"}}><span> Listed From {moment(allListings[i].startDate).utc().format('DD MMMM YYYY')} To {moment(allListings[i].endDate).utc().format('DD MMMM YYYY')}</span></strong>
                    </span>

                    <br></br><br></br><br></br>
                    {allListings[i].byTraveller.length > 0
                        ?
                        (   
                            <div>
                                <table className="table table-striped" id="bookings">
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Booked By</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>No. Of Guests</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    { this.renderbookingTable(allListings[i]) }
                                </table>
                            </div>
                        )
                        :
                        (
                            <div className = "container-full">
                                <h2> No Booking History! </h2>
                            </div>
                        )
                    }
                </div>      
            </div>
            </div>
        });
    }

    renderbookingTable (listingData) {
        return Object.keys(listingData.byTraveller).map( (j) => {
            return <tbody data-ng-repeat="bookingData in listingData[i]">
                        <tr>
                            <td>{listingData.bookingid[j]}</td>
                            <td>{listingData.byTraveller[j]}</td>
                            <td>{moment(listingData.fromDate[j]).utc().format('DD MMMM YYYY')}</td>
                            <td>{moment(listingData.toDate[j]).utc().format('DD MMMM YYYY')}</td>
                            <td>{listingData.totalGuests[j]}</td>
                            <td>$ {listingData.bookingPrice[j]}</td>
                        </tr>
                    </tbody>
        });
    }

    render(){
        
        let redirectVar = null;
        if(sessionStorage.getItem('cookie1') !== 'ownercookie'){
            redirectVar = <Redirect to= "/"/>
        }

        return(
            <div>
                {redirectVar}
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a  title = "HomeAway" className = "logo"><img alt="Homeaway Logo" src={require('./homeaway_logo.png')}/></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <div>
                        <div id="white" className="btn btn-group">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px",backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {sessionStorage.getItem('cookie3')} </button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a>
                                <a className="dropdown-item" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a>
                                <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item" onClick = {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        <img style={{marginLeft: "50px"}} src={require('./logo.png')} alt="Homeaway Logo"/>
                    </div>
                </Navbar>
                <div style={{backgroundColor: "white", borderLeftColor:"white",borderRightColor:"white",borderBottomColor: "#d6d7da", borderTopColor: "#d6d7da", borderStyle: "solid"}}>
                    <div id="conttab" className="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" className="one"><a id="linktab" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a></li>
                            <li id="ulinktab" className="two"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                            <li id="ulinktab" className="three"><a id="linktab" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a></li>
                            <hr id="hrtab1" />
                        </ul>
                    </div>
                </div>
                <Query
                    query={ownerpropertylistingsquery}
                    variables= { {listedBy: sessionStorage.getItem('cookie2') }}
                >
                { ({ loading, error, data }) => {
                    if (loading) return (
                        <div className = "container-full">
                            <div className="container-pad" style={{textAlign: "center"}}>
                                <h1> Fetching Listed Properties... </h1>
                            </div>
                        </div>
                        )
                    if (error) return <div> Error </div>;
                    console.log(data.ownerpropertylistings)
                    return (
                        <div className = "container-full">
                        { (data.ownerpropertylistings.length > 0)
                        ?
                        (
                            <div className="container-pad">
                                <div className="form-row myformrow">
                                    <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                                        { this.renderListings(data.ownerpropertylistings) }
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className="container-pad" style={{textAlign: "center"}}>
                                <h1> You have not listed any Property! </h1>
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
export default OwnerPropertyListings;