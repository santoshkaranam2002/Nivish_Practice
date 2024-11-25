import { gql } from "apollo-angular";
const schoolProfileQuery = gql`
query MyQuery($schoolProfileId: [Int]) {
    EnterpriseSchools(id:$schoolProfileId) {  
    City
    Country
    Description
    PO_Box
    Upload_School_Logo
    Enterprise_Group
    Group_Name
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
    UpdatedOn
    Primary_Coordinator_Name
    Primary_Coordinator_Email
    Primary_Coordinator_MobileNo
    Primary_Coordinator_Status
    Primary_Coordinator_NID
    Secondary_Coordinator_Name
    Secondary_Coordinator_Email
    Secondary_Coordinator_MobileNo
    Secondary_Coordinator_Status
    Secondary_Coordinator_NID
    }
  }
`
const eventSchoolQuery = gql`
    query MyQuery($schooleventId: [Int]) {
    healthcampDetails(EnterpriseName:$schooleventId) {
        EndDate
        StartDate
        HealthCampName
        Event_Type
        Scheduled_Status
        HCID
    }
}`

const eventProfileQuery = gql`
query MyQuery($HCID:Int) {
  healthcampDetails(HCID: $HCID) {
    Event_Type
    HealthCampName
    Venue_Location
    HealthCampType
    Location
    Number_of_Participant
    Scheduled_Status
    Enterprise_Name
    HCID
    StartDate
    Discription
  }
}`
const summerQuery=gql`
query MyQuery($summery:Int) {
  hcSummury(HCID: $summery) {
    ClassandSections
    Event
    Exclude
    HCID
    Include
    Total
    UpdatedOn
  }
}`
const participantQuery=gql`
query MyQuery($hcId:Int) {
  ParticipantsDetails(HCID:$hcId) {
    Class_Section
    Event_Status
    HCID
    InfoseekId
    Student_Admission_code
    Student_FirstName
    Student_Roll_number
    UIN
    class_name
    section_name
    Infoseek_Master
  }
}`

  export {schoolProfileQuery,eventSchoolQuery,eventProfileQuery,summerQuery,participantQuery};