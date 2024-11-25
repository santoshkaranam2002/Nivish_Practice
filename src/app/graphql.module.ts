// import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
// import { HttpLink } from 'apollo-angular/http';
// import { NgModule } from '@angular/core';
// import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

// // const url = 'http://45.79.121.132:8000/UserIvin-API/graphql/'; // <-- Production IP
// const url = 'https://staging-api.ivinstrategies.com/UserIvin-API/graphql/'; // <-- Stagging IP

// export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
//   return {
//     link: httpLink.create({ uri:url }),
//     cache: new InMemoryCache(),
//   };
// }

// @NgModule({
//   exports: [ApolloModule],
//   providers: [
//     {
//       provide: APOLLO_OPTIONS,
//       useFactory: createApollo,
//       deps: [HttpLink],
//     },
//   ],
// })
// export class GraphQLModule {}


import { APOLLO_NAMED_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

const BaseUrl = 'https://staging-api.ivinstrategies.com/';


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
      useFactory: (httpLink: HttpLink) => ({
        userivin: createApolloClient(httpLink, BaseUrl + 'UserIvin-API/graphql/'),
        probite: createApolloClient(httpLink, BaseUrl + 'probite/ProBiteFilter/'),
        statusdata : createApolloClient(httpLink, BaseUrl + 'probite/StatusData/'),
        treedata : createApolloClient(httpLink, BaseUrl + 'probite/StatusData1/')
      }),
      deps: [HttpLink],
    },
  ],
})

export class GraphQLModule {}