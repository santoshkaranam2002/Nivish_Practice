import { gql } from "apollo-angular";

const providerget = gql`
query MyQuery {
    ProviderData {
      Name
      ProviderID
    }
  }
`
export{providerget}