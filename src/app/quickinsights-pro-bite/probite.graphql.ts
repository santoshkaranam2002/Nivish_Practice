import { gql } from "apollo-angular";


const state = gql`
    query MyQuery {
        uniqueStateutnames
    }

`

const electiontype = gql`
    query MyQuery($statename: String!) {
        uniqueElectionname(StateUTName: $statename)
    }

`

const year = gql`
    query MyQuery($statename: String!,$election:String!) {
        uniqueElectionyear(
          ElectionName:$election
          StateUTName: $statename)
    }

`

const constituency = gql`
query MyQuery($year:String!, $statename: String!, $election:String!) {
  uniqueAcnameno(
      ElectionYear: $year
      StateUTName: $statename
      ElectionName : $election
      )
  }

`

const haryanadata = gql`
  query MyQuery($state:String!, $election:String!, $year:String!, $constituency:String, $gender:String,
    $toage:Int, $fromage:Int, $party:String, $candidature:String
  ) {
      haryanaData(
        ACNameNo: $constituency
        Gender: $gender
        ElectionName: $election
        ElectionYear: $year
        StateUTName: $state
        to_age: $toage
        Party: $party
        from_age: $fromage
        ACCategory: $candidature
      ) {
        Message
        Status
        Result {
          ACCategory
          ACName
          Age
          ElectionName
          ACNO
          ACPCByPoll
          CandidateName
          ElectionDate
          ElectionYear
          General_Votes
          PCName
          Party
          PostalVotes
          Gender
          StateUTName
          Symbol
          Total
          TotalElectors
          WinOrder
          VotesPolledPer
          Candidate_Category
          ServiceVotes
        }
        HasError
      }
    }

`

const totaldata = gql`
  query MyQuery ($election : String!, $electionyear : String!, $statename : String!, $constituency: String){
    totalPolledAndElectors(ElectionName: $election,
     ElectionYear: $electionyear, 
     StateUTName: $statename,
     ACNameNo : $constituency
    ) {
      ElectionYear
      StateUTName
      SumTotalElectors
      SumTotalPolled
      ACCount
      PercentagePolled
      ACCategoryResult {
        caste
        count
      }
    }
  }

`

const barchart = gql`
  query MyQuery ($election: String!, $state: String!, $year : String!, $constituency: String){
    stateWiseWonSeats(ElectionName: $election, StateUTName: $state, ElectionYear: $year, ACNameNo:$constituency) {
      state
    wins {
      party
      wins
      }
    }
  }

`

const piechart = gql`
  query MyQuery  ($election : String!, $electionyear : String!, $statename : String!, $constituency: String){
    partySharingResult(
      ACNameNo: $constituency
      ElectionName: $election
      ElectionYear: $electionyear
      StateUTName: $statename
    ) {
      partyName
      percentage
      partyVotes
    }
  }

`

const gender = gql`
  query MyQuery($statename : String!) {
    uniqueGender(StateUTName: $statename)
  }

`

const party = gql`
  query MyQuery($statename : String!) {
    uniqueParty(StateUTName: $statename)
  }
`

const category = gql`
  query MyQuery ($statename : String!){
    uniqueCandidateCategory(StateUTName: $statename)
  }
`

const treechartdata = gql`
query MyQuery($statename : String!) {
  StateTreeDetails(StateUTName: $statename) {
    ElectionName
    ElectionYear
    ACName 
  }
}
`



const particpationdetails = gql`
query MyQuery ($election : String!, $electionyear : String!, $statename : String!, $constituency: String!) {
  electionResult(ElectionName: $election, ElectionYear: $electionyear, StateUTName: $statename, ACNameNo: $constituency) {
    name
    party
    status
    gender
    totalVotes
    voteDifference
    VotesPolledPer
    Age
    ACCategory
    Symbol
  }
}
`

const bubblechart = gql`
query MyQuery($statename : String!, $electiontype : String!) {
  seatWon(ElectionName: $electiontype, StateUTName: $statename) {
    year
    partyWins {
      party
      wins
    }
  }
}
`

const latestElectionResult = gql`
   query MyQuery {
    latestElectionResult {
    ElectionName
    ElectionYear
    StateUTName
  }
}
`

export {state,electiontype,year,constituency,haryanadata,totaldata,barchart,piechart,gender,party,category,treechartdata,particpationdetails,bubblechart,latestElectionResult}
