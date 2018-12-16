import { gql } from 'apollo-boost';

const profilefetchquery = gql`
    query Profile($email: String){
        profilefetch(email: $email) {
            firstname
            lastname
            created
            aboutMe
            city
            state
            country
            company
            school
            hometown
            gender
            phone
        }
    }
`;

export { profilefetchquery };