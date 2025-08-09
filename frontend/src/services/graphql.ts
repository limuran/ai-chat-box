import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { gql } from '@apollo/client';

// GraphQL endpoint
const httpLink = createHttpLink({
  uri: (import.meta as any).env?.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8787/graphql',
  credentials: 'omit', // Cloudflare Workers 不需要 credentials
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

// Apollo Client 实例
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// GraphQL 查询和变更
export const HEALTH_QUERY = gql`
  query Health {
    health
  }
`;

export const AVAILABLE_MODELS_QUERY = gql`
  query AvailableModels {
    availableModels
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      success
      message {
        id
        content
        role
        timestamp
      }
      error
    }
  }
`;

export const CLEAR_CONVERSATION_MUTATION = gql`
  mutation ClearConversation {
    clearConversation
  }
`;