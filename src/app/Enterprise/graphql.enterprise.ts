import { gql } from "apollo-angular";

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
query MyQuery($enterprisegroup: Int) {
  EnterpriserDetails(EnterpriseGroup: $enterprisegroup) {
    Enterprise_Name
    id
  }
}
`
const countryNameQuery= gql`
query MyQuery {
  EnterpriseGroupAllCountry {
    Country
    id
  }
}
`
const classandsection =gql`
query MyQuery($from: String, $enterpriseName: Int!) {
  InfoseekVerification(From: $from, EnterpriseName: $enterpriseName) {
    class_section
    From
    Enterprise_name
  }
}
`

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
}
`
export {enterpisegropnameget, enterpisenameQuery,countryNameQuery,smlNameQuery,classandsection};