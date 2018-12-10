import { gql } from 'apollo-boost';

const tripsfetchquery = gql`
    query TravellerTripListings($bookedBy: String){
        travellertripsfetch(bookedBy: $bookedBy) {
            bookedBy,
            bookedFrom,
            bookedTo,
            propertyID,
            NoOfGuests,
            price,
            bookingID,
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

export { tripsfetchquery };