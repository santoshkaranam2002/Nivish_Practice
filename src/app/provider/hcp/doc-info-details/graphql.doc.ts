import { gql } from "apollo-angular";

const doctorprofileget=gql`
query MyQuery ($hcpid: Int){
  HcpMasterList(HCPID: $hcpid) {
    FullName
    Gender
    Date_of_Birth
    Type
    Category
    NIV
    Status
    ExperienceData {
      Total_Experience_Months
      Total_Experience_Years
    }
  }
}
`
const docdemographic =gql`
query MyQuery ($hcpid: Int){
  HcpMasterList(HCPID: $hcpid) {
    Registered_MobileNumber
    Registered_Email
    Nationality
    Emirates_Id
    Passport
    ExperienceData {
      Sub_Contracted_Form
      Total_Experience_Months
      Total_Experience_Years
    }
    licenseData {
      Validate_till
      Upload_certificate
      Specialization
      ProviderID
      Life_long_till
      License_Number
      License_Authority_others
      License_Authority
      Issued_Date
      HCPID
    }
    EducationData {
      Country
      CreatedOn
      Filed_of_study
      Name_of_institute
      Type_of_degree
      UpdatedOn
      Upload_certificate
      from_Date
      to_Date
    }
  }
}
`
const doctorevents = gql`
query MyQuery ($hcpid:Int){
 EventtimeslotsData(hcpId: $hcpid) {
    HCID
    HCPID
    eventHealthcampData {
      Description
      EndDate
      Event_Type
      HealthCampName
      Location
      StartDate
      Scheduled_Status
    }
  }
}
`
const doctoreventviewtime = gql`
query MyQuery ($hcid:Int) {
  TimeSlotsData(HCID: $hcid) {
    HCID
    assignments {
      Date
      End_Time
      HCID
      Start_Time
    }
  }
}

`

export{ doctorprofileget,docdemographic,doctorevents,doctoreventviewtime}