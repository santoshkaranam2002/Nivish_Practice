
import { APOLLO_NAMED_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { SuperadminService } from './superadmin.service';
export function createApolloClient(httpLink: HttpLink, uri: string): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: (httpLink: HttpLink,superadminService:SuperadminService) => ({
        campAdminClient: createApolloClient(httpLink, superadminService.url + 'SuperAdmin/EnterpriseType/'),
        superAdminevents: createApolloClient(httpLink, superadminService.url + 'SchoolAdmin/SchoolAdmin/'),
        hcpadminclient: createApolloClient(httpLink, superadminService.url + 'Hcp/HCP/'),
        // doctorseventclient: createApolloClient(httpLink, BaseUrl + 'SuperAdmin/EnterpriseType/'),
        // schoolAdminClient: createApolloClient(httpLink, BaseUrl + 'SchoolAdmin/SchoolAdmin/'),
      }),
      deps: [HttpLink,SuperadminService],
    },
  ],
})
export class GraphQLModule {}
