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

const TableData = gql`
    query MyQuery($constituency: String, $mandal:String, $pollingstationnameandnumber: String, 
            $sectionnameandnumber: String, $gender: String, $name: String, $lastname: String, 
            $lastnamelikesearch: String, $home: String, $voterid: String, $caste: String, 
            $contactmode: String, $contactnumber: String, $dissident: String, $habitations: String, 
            $interestToJoinparty: String, $nonlocaladdress: String, $partyincination: String, 
            $physicallychallenged: String, $profession: String, $fromage: String, $toage: String) {
        readContact(Constituency: $constituency, Mandal: $mandal, PollingStationCombination: $pollingstationnameandnumber,
            SectionNoandName: $sectionnameandnumber,
            Gender: $gender,
            Name: $name,
            LastName: $lastname,
            LastNamelyk: $lastnamelikesearch,
            Home: $home,
            VoterId: $voterid,
            Caste: $caste,
            ContactMode: $contactmode,
            ContactNumber: $contactnumber,
            Dissident: $dissident,
            Habitations: $habitations,
            InterestToJoinParty: $interestToJoinparty,
            NonLocalAddress: $nonlocaladdress,
            PartyIncination: $partyincination,
            PhysicallyChallenged: $physicallychallenged,
            Profession: $profession
            fromAge: $fromage
            toAge: $toage
        ) {
            VoterId
            FirstName
            Constituency
            Name
            Guardian
            Home
            Age
            LastName
            ivinid
            Gender
            State
            District
            PollingStationNumber
            PollingStationName
            PollingStationLocation
            SectionNoandName
            VoterSerialNumber
            RelationType
            Mandal
            AssemblyConstituencyNoandName
            MainTownORVillage
            PinCode
            PoliceStation
            RevenueDivision
            Caste
            ContactMode
            ContactNumber
            Dissident
            Habitations
            InterestToJoinParty
            Profession
            PartyInclination
            NonLocalAddress
            PhysicallyChallenged
            Schemes
        }
    }
`

const CastData = gql`
    query MyQuery ($constituency: String) {
        uniqueCaste(Constituency: $constituency)
    }
`

export { Mandals, PollingStationsNameadNumber, SectionNameandNumber, TableData, CastData };