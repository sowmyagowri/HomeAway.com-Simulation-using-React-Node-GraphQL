import { gql } from 'apollo-boost';

const travellerloginmutation = gql`
    mutation Travellerlogin($email: String, $password: String){
        travellerlogin(email: $email, password: $password) {
            cookie1
            cookie2
            cookie3
            status
            message
        }
    }
`;

const ownerloginmutation = gql`
    mutation Ownerlogin($email: String, $password: String){
        ownerlogin(email: $email, password: $password) {
            cookie1
            cookie2
            cookie3
            status
            message
        }
    }
`;

const travellersignupmutation = gql`
    mutation TravellerSignup2($firstname: String, $lastname : String, $email: String, $password: String){
        travellersignup(firstname: $firstname, lastname: $lastname, email: $email, password: $password) {
            cookie1
            cookie2
            cookie3
            status
            message
        }
    }
`;

const ownersignupmutation = gql`
    mutation OwnerSignup2($firstname: String, $lastname : String, $email: String, $password: String){
        ownersignup(firstname: $firstname, lastname: $lastname, email: $email, password: $password) {
            cookie1
            cookie2
            cookie3
            status
            message
        }
    }
`;

const profilesavemutation = gql`
    mutation Profile($email: String, $firstname: String, $lastname : String, $aboutMe: String, $city: String, $state: String, $country: String,
        $company: String, $school: String, $hometown: String, $languages: String, $gender: String, $phone: String ){
        profilesave(email: $email, firstname: $firstname, lastname : $lastname, aboutMe: $aboutMe, city: $city, state: $state, country: $country,
            company: $company, school: $school, hometown: $hometown, languages: $languages, gender: $gender, phone: $phone) {
            status
            message
        }
    }
`;            
            
export {travellerloginmutation, ownerloginmutation, travellersignupmutation, ownersignupmutation, profilesavemutation };