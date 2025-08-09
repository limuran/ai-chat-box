import { createSchema } from 'graphql-yoga';
import { resolvers } from './resolvers';

const typeDefs = /* GraphQL */ `
  type Message {
    id: ID!
    content: String!
    role: MessageRole!
    timestamp: String!
  }

  enum MessageRole {
    USER
    ASSISTANT
  }

  input MessageInput {
    id: ID!
    content: String!
    role: MessageRole!
    timestamp: String!
  }

  input SendMessageInput {
    content: String!
    conversationHistory: [MessageInput!]
  }

  type ChatResponse {
    success: Boolean!
    message: Message
    error: String
  }

  type Query {
    # 获取服务状态
    health: String!
    # 获取可用模型列表
    availableModels: [String!]!
  }

  type Mutation {
    # 发送消息给 Claude AI
    sendMessage(input: SendMessageInput!): ChatResponse!
    # 清理对话历史
    clearConversation: Boolean!
  }

  type Subscription {
    # 实时消息流（未来可能实现）
    messageStream: Message!
  }
`;

export const schema = createSchema({
  typeDefs,
  resolvers,
});