import { gql } from "apollo-angular";

const studentinfo = gql`
  query MyQuery($infoseekid: Int!) {
    infoseekDetails(InfoseekId: $infoseekid) {
      Student_First_Name
      Student_Middle_Name_1
      Student_Middle_Name_2
      Student_Last_Name
      Student_Class
      Student_Section
      UIN
      Student_Roll_Number
      Student_Admission_Code
      Date_of_Birth
      Gender
      Infoseek_Status
      upload_photo
    }
  }
`

const events = gql`
  query MyQuery($infoseekid: Int) {
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

const studentschool = gql`
  query MyQuery($infoseekid: Int!) {
    infoseekDetails(InfoseekId: $infoseekid) {
      InfoseekVerificationdata {
        UpdatedOn
        Group_Name
        Enterprise_Name
        Web_Address
        Street_Address
        ZIP_Code
        
      }
      Student_Class
      Student_Section
      Student_Roll_Number
      Student_Admission_Code
    }
  }
`

const Demographics = gql`
  query MyQuery($infoseekid: Int!) {
    infoseekDetails(InfoseekId: $infoseekid) {
      Fathers_First_Name
      Fathers_Middle_Name
      Fathers_MiddleName2
      Fathers_Last_Name
      Fathers_Mobile_Phone
      Mothers_First_Name
      Mothers_Mobile_Phone
      Parent_Email
      RH_Factor
      Blood_Group
      Address_Building
      Adress_Street
      Apartment_Villa_No
      Area
      City
      Country
      State
      Zip
      Mothers_Ethnic_Origin
      Fathers_Ethnic_Origin
      Doctor_Contact_Number
      Primary_Contact
      Primary_Contact_Belongs_To
      Primary_Contact_Full_Name
      Family_Doctor_Name
    }
  }
`
const studentInfoWithId = gql`
  query MyQuery($id: Int!) {
    InfoseekMasterById(id: $id) {
      id
      City
      Adress_Street
      Student_First_Name
      Student_Middle_Name_1
      Student_Middle_Name_2
      Student_Last_Name
      Student_Class
      Student_Section
      UIN
      Student_Roll_Number
      Student_Admission_Code
      Updated_By
      Date_of_Birth
      Gender
    }
  }
`;
const schoolInfoWithId = gql`
  query MyQuery($id: Int) {
    InfoseekMasterById(id: $id) {
      id
      EnterpriseDataDetails {
        Group_Name
        Enterprise_Name
        UpdatedOn
        Street_Address
        Web_Address
      }
      Student_Class
      Student_Section
      Student_Roll_Number
      Student_Admission_Code
    }
  }
`;
const demographicsInfoWithId = gql`
  query MyQuery($id: Int!) {
    InfoseekMasterById(id: $id) {
   id
    Fathers_First_Name
    Fathers_Middle_Name
    Fathers_Last_Name
    Fathers_Mobile_Phone
    Mothers_First_Name
    Mothers_Middle_Name
    Mothers_Last_Name
    Mothers_Mobile_Phone
    Parent_Email
    Blood_Group
    RH_Factor
    Other_Address_Part
    Address_Building
    Adress_Street
    City
    Country
    State
    Zip
    Mothers_Ethnic_Origin
    Fathers_Ethnic_Origin
    Emergency_Contact_First_Name
    Emergency_Contact_Middle_Name
    Emergency_Contact_Last_Name
    Emergency_Contact_Phone_1
    Emergency_Contact_Phone_2
    Emergency_Contact_Relationship
    Emergency_Doctor_Name
    Emergency_Doctor_Phone_1
    }
  }
`;
const smlNameQuery= gql`
query MyQuery ($sml:Int){
  InfoseekMasterData(id: $sml) {
    Address_Building
    Adress_Street
    Blood_Group
    City
    Comments
    Country
    CreatedOn
    Date_of_Birth
    Emergency_Contact_First_Name
    Emergency_Contact_Last_Name
    Emergency_Contact_Middle_Name
    Emergency_Contact_Phone_1
    Emergency_Contact_Phone_2
    Emergency_Contact_Relationship
    Emergency_Doctor_Name
    Emergency_Doctor_Phone_1
    Enterprise_Group
    Enterprise_Name
    Fathers_Ethnic_Origin
    Fathers_First_Name
    Fathers_Last_Name
    Fathers_Middle_Name
    Fathers_Mobile_Phone
    Gender
    Home_Phone
    Infoseek_Status
    Mothers_Ethnic_Origin
    Mothers_First_Name
    Mothers_Last_Name
    Mothers_Middle_Name
    Mothers_Mobile_Phone
    Other_Address_Part
    Parent_Email
    RH_Factor
    State
    Student_Admission_Code
    Student_Admission_Date
    Student_Class
    Student_Ethnic_Origin
    Student_First_Name
    Student_Last_Name
    Student_Middle_Name_1
    Student_Middle_Name_2
    id
    Zip
    UpdatedOn
    System_User_id
    Student_Section
    Student_Roll_Number
  }
}`
const enterpisegropnameget = gql`
query MyQuery {
   EnterpriseGroup(Country:null) {
    Count
    Group_Name
    id
  }
}
`
const enterpisenameQuery = gql`
query MyQuery($enterprisegroup: [Int],$status:[String]) {
  EnterpriseSchools(EnterpriseGroup: $enterprisegroup,Status:$status) {
    id
    Enterprise_Name
    Primary_Coordinator_Date
    Primary_Coordinator_Email
    Primary_Coordinator_MobileNo
    Primary_Coordinator_NID
    Primary_Coordinator_Name
    Primary_Coordinator_Status
    Secondary_Coordinator_Date
    Secondary_Coordinator_Email
    Secondary_Coordinator_MobileNo
    Secondary_Coordinator_NID
    Secondary_Coordinator_Name
    Secondary_Coordinator_Status
    Status
    UpdatedOn
  }
}
`

;
export { studentInfoWithId, schoolInfoWithId, demographicsInfoWithId,smlNameQuery ,enterpisegropnameget,enterpisenameQuery,studentinfo, events, studentschool, Demographics};