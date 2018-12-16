import { gql } from 'apollo-boost';

const propertysearchquery = gql`
    query PropertySearchResults($city: String, $startDate: String, $endDate: String, $noOfGuests: String){
        propertysearch(city: $city, startDate: $startDate, endDate: $endDate, noOfGuests: $noOfGuests) {
            listedBy,
            startDate,
            endDate,
            sleeps,
            bedrooms,
            bathrooms,
            baseRate,
            country,
            city,
            state,
            zipcode,
            headline,
            description,
            currency,
            minStay,
            amenities,
            streetAddress,
            propertyType,
            uid,
            image1,
            image2,
            image3,
            image4,
            image5,
        }
    }
`;

const ownerpropertylistingsquery = gql`
    query OwnerPropertyListings($listedBy: String){
        ownerpropertylistings(listedBy: $listedBy) {
            listedBy,
            startDate,
            endDate,
            sleeps,
            bedrooms,
            bathrooms,
            baseRate,
            country,
            city,
            state,
            zipcode,
            headline,
            description,
            currency,
            minStay,
            amenities,
            streetAddress,
            propertyType,
            uid,
            image1,
            image2,
            image3,
            image4,
            image5,
            fromDate,
            toDate,
            byTraveller,
            totalGuests,
            bookingPrice,
            bookingid,
        }
    }
`;

const propertydetailsfetchquery = gql`
    query PropertyDetails($propertyID: String){
        propertydetails(propertyID: $propertyID) {
            listedBy,
            startDate,
            endDate,
            sleeps,
            bedrooms,
            bathrooms,
            baseRate,
            country,
            city,
            state,
            zipcode,
            headline,
            description,
            currency,
            minStay,
            amenities,
            streetAddress,
            propertyType,
            uid,
            image1,
            image2,
            image3,
            image4,
            image5,
        }
    }
`;

export { propertysearchquery, ownerpropertylistingsquery, propertydetailsfetchquery };