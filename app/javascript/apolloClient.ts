import { ApolloClient, InMemoryCache, makeVar, HttpLink } from "@apollo/client";

// Define a reactive variable for the current company
export const currentCompanyVar = makeVar<any>(null);

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:3000/graphql" }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          currentCompany: {
            read() {
              return currentCompanyVar();
            },
          },
        },
      },
    },
  }),
});

export default client;
