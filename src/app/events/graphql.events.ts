import { gql } from "apollo-angular";

const enterpisegroupnameget = gql`
query MyQuery {
  EnterpriseGroup {
    Group_Name
    SuperAdmin_ID
    id
  }

}
`
const enterpisenameget = gql`
  query GetEnterpriseDetails($enterpriseGroupId: Int) {
    EnterpriserDetails(EnterpriseGroup: $enterpriseGroupId) {
      City
      Country
      Description
      Enterprise_Group
      Enterprise_Name
      Public_Display_Email
      School_Display_Name
      State
      Status
      Street_Address
      SuperAdmin_ID
      Upload_School_Logo
      Web_Address
      id
    }
  }
`;

const classsectionget = gql`
query MyQuery($Enterprise_name: Int ,$From:String) {
  InfoseekVerification(EnterpriseName: $Enterprise_name,From:$From) {
      class_section
    }
  } 
`
const numberofstudentsget = gql`
query MyQuery($classSections: [String],$enterpriseName: Int,) {
  InfoseekClassSectionCount(classSections: $classSections,enterpriseName: $enterpriseName, ) {
      class_section_count
    }
  }
  
`
const alleventsget = gql`
query MyQuery($hcid: Int,$Enterprise:[Int],$sechudle:[String]) {
  healthcampDetails(HCID: $hcid,EnterpriseName:$Enterprise,ScheduledStatus:$sechudle) {
    Discription
    EndDate
    Enterprise_Name
    Event_Type
    Event_Type_Others
    HealthCampName
    HCID
    HealthCampType
    Location
    Number_of_Participant
    Scheduled_Status
    StartDate
    Venue_Location
    EnterpriseName
  }
}
`

const events = gql`
query MyQuery($infoseekid: Int!) {
  readContact(InfoseekId: $infoseekid) {
    Scheduled_Status
    Reason_Other
    Reason
    Location
    InfoseekId
    HealthCampName
    HCID
    StartDate
    Event
    EndDate
    Discription
    Created_By
    CreatedOn
    Comments
  }
}
`
export {enterpisegroupnameget,enterpisenameget,classsectionget,numberofstudentsget,alleventsget,events};