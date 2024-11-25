import { gql } from 'apollo-angular'

const  GetPostsByUsername = gql`
    query MyQuery($constituency: String, $mandal: String, $pollingstationcombination: String, $sectionnoandame: String, $gender: String, $name: String, $lastname:String, $lastnamelyk:String, $home:String, $voterid:String, $caste:String, $contactNumber:String,
    $profession:String, $partyInclination:String, $contactMode:String, $nonLocalAddress:String, $dissident:String, $interestToJoinParty:String, $physicallyChallenged:String, $habitations:String,) {

        readContact(Constituency: $constituency, Mandal: $mandal, PollingStationCombination: $pollingstationcombination,
            SectionNoandName: $sectionnoandame, Gender: $gender, Name: $name, LastName: $lastname, LastNamelyk: $lastnamelyk, 
            Home: $home, VoterId: $voterid  Caste: $caste, ContactNumber:$contactNumber, Profession:$profession,
            PartyIncination:$partyInclination,ContactMode:$contactMode, NonLocalAddress:$nonLocalAddress, Dissident:$dissident, 
            InterestToJoinParty:$interestToJoinParty, PhysicallyChallenged:$physicallyChallenged, Habitations:$habitations,) {

            VoterId
            Name
            Guardian
            Home
            Age
            ivinid
            Gender
            VoterSerialNumber
            RelationType
            Caste
            ContactNumber
            Profession
            PartyInclination
            ContactMode
            NonLocalAddress
            Dissident
            InterestToJoinParty
            PhysicallyChallenged
            Habitations
            Schemes
        }
    }
`

const Getunique = gql`
    query MyQuery($constituency: String) {
        uniqueMandals(Constituency: $constituency)
  }
`

const Getuniquepollingstations = gql `
    query MyQuery($constituency: String,$mandal: String) {
        uniquePollingstationCombinations(Constituency: $constituency, Mandal: $mandal)  
    }
`


const Getuniquesectionname = gql `
    query MyQuery($pollingstationnameandnumber: String) {
        uniqueSectionname(PollingstationNameAndNumber: $pollingstationnameandnumber)  
    }
`

const CastData = gql`
    query MyQuery ($constituency: String) {
        uniqueCaste(Constituency: $constituency)
    }
`

export {  GetPostsByUsername,Getunique,Getuniquepollingstations,Getuniquesectionname,CastData };

