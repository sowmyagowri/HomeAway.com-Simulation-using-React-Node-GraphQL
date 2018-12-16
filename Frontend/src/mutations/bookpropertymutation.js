import { gql } from 'apollo-boost';

const bookpropertymutation = gql`
    mutation BookProperty($propertyid: String, $bookedBy: String, $bookedFrom : String, $bookedTo: String, $NoOfGuests: String, $pricePaid: Int){
        bookproperty(propertyid: $propertyid, bookedBy: $bookedBy, bookedFrom : $bookedFrom, bookedTo: $bookedTo, NoOfGuests: $NoOfGuests, pricePaid: $pricePaid) {
            status
            message
        }
    }
`;            
            
export { bookpropertymutation }