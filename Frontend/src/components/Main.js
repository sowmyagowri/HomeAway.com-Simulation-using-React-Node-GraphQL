import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import PropertySearchResults from './PropertySearchResults';
import PropertyDetails from './PropertyDetails';
import TravellerLogin from './TravellerLogin';
import TravellerTripListings from './TravellerTripListings';
import OwnerLogin from './OwnerLogin';
import OwnerPropertyPost from './OwnerPropertyPost';
import OwnerPropertyListings from './OwnerPropertyListings';
import TravellerSignup1 from './TravellerSignup1';
import TravellerSignup2 from './TravellerSignup2';
import OwnerSignup1 from './OwnerSignup1';
import OwnerSignup2 from './OwnerSignup2';
import Profile from './Profile';

class Main extends Component {
    render(){
        return(
            <div className="container-fluid">
                <div>
                    <Router>
                        <div>  
                            <Route exact path='/' component={Home} />
                            <Route path='/property/searchresult' render={(props)=> (
                                <PropertySearchResults {...props} propDummy={50} />
                            )} />
                            <Route path='/property/:id/:location/:fromdate/:todate/:noOfGuests' component={PropertyDetails} />
                            <Route path='/traveller/login' component={TravellerLogin} />
                            <Route path='/traveller/signup1' component={TravellerSignup1} />
                            <Route path='/traveller/signup2' component={TravellerSignup2} />
                            <Route path='/traveller/mytrips' component={TravellerTripListings} />
                            <Route path='/Profile' component={Profile} />
                            <Route path='/owner/login' component={OwnerLogin} />
                            <Route path='/owner/signup1' component={OwnerSignup1} />
                            <Route path='/owner/signup2' component={OwnerSignup2} />
                            <Route path='/owner/propertypost' component={OwnerPropertyPost} />
                            <Route path='/owner/mylistings' component={OwnerPropertyListings} />
                        </div>
                    </Router>
                </div>
            </div>
        )
    }
}

export default Main;