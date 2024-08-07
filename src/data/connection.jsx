import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://boss-bat-34.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': 'O5jXjwVvpPUt8huDWJPEEC0fXgKWCMj4r8FVRiap0saNU9uhRj6u1av1nT45c61B',
  }
});
