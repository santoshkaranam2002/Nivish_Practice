import { gql } from "apollo-angular";

const Mandals = gql`
    query ($constituency: String!) {
        uniqueMandals(Constituency: $constituency)
    }
`

const PollingStationsNameadNumber = gql`
    query ($constituency: String, $mandal:String) {
        uniquePollingstationCombinations(Constituency: $constituency, Mandal: $mandal)
    }
`

const SectionNameandNumber = gql`
    query ($pollingstationnameandnumber: String) {
        uniqueSectionname(PollingstationNameAndNumber: $pollingstationnameandnumber)
    }
`

const CountData = gql`
    query MyQuery($constituency: String, $mandal: String, $pollingstationnameandnumber: String, 
        $sectionnameandnumber: String, $gender: String, $name: String, $lastname: String, 
        $home: String, $caste: String, $contactmode: String, $contactnumber: String, 
        $dissident: String, $habitations: String, $interestToJoinparty: String, 
        $nonlocaladdress: String, $partyincination: String, $physicallychallenged: String, $profession: String,
        $fromage: String, $toage: String) {
        contactCount(
            Constituency: $constituency,
            Mandal: $mandal,
            PollingStationCombination: $pollingstationnameandnumber,
            SectionNoandName: $sectionnameandnumber,
            Gender: $gender,
            Name: $name,
            LastName: $lastname,
            Home: $home,
            Caste: $caste,
            ContactNumber: $contactnumber,
            Profession: $profession,
            PartyIncination: $partyincination,
            ContactMode: $contactmode,
            NonLocalAddress: $nonlocaladdress,
            Dissident: $dissident,
            InterestToJoinParty: $interestToJoinparty,
            PhysicallyChallenged: $physicallychallenged,
            Habitations: $habitations,
            fromAge: $fromage,
            toAge: $toage
        ) {
            ivinidcount
            ivinidList
        }
    }
`

const CastData = gql`
    query MyQuery ($constituency: String) {
        uniqueCaste(Constituency: $constituency)
    }
`
export { Mandals, PollingStationsNameadNumber, SectionNameandNumber, CountData, CastData };