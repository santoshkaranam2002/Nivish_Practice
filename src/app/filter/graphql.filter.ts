import { gql } from "apollo-angular";

const HabitationsData = gql`
    query MyQuery {
        uniqueHabitations
    }
`

const PartyNamesData = gql`
    query MyQuery {
        uniquePartynames
    }
`

export { HabitationsData, PartyNamesData };