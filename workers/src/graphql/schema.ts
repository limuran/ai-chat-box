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
    agentType: AgentType
  }

  enum AgentType {
    CODE_REVIEW_AGENT
    GENERAL_CODING_AGENT
    AUTO_SELECT
  }

  enum ProcessingMethod {
    MASTRA
    CLAUDE_DIRECT
  }

  type ChatResponse {
    success: Boolean!
    message: Message
    error: String
    agentUsed: String
    toolsUsed: [String!]
    processingMethod: ProcessingMethod
  }

  type ApiKeyValidation {
    valid: Boolean!
    error: String
  }

  # 代码审查相关类型
  input CodeReviewInput {
    code: String!
    language: String
    context: String
  }

  type CodeReviewResponse {
    success: Boolean!
    content: String!
    agentUsed: String!
    error: String
    processingMethod: ProcessingMethod
  }

  # Mastra 健康检查
  type MastraHealthCheck {
    status: String!
    agents: [AgentStatus!]!
    timestamp: String!
    error: String
  }

  type AgentStatus {
    name: String!
    available: Boolean!
  }

  type Query {
    # 获取服务状态
    health: String!
    # 获取可用模型列表
    availableModels: [String!]!
    # 验证API密钥状态
    validateApiKey: ApiKeyValidation!
    # Mastra 健康检查
    mastraHealth: MastraHealthCheck!
    # 获取可用的 agents
    availableAgents: [String!]!
  }

  type Mutation {
    # 发送消息给 Claude AI (现在支持 Mastra)
    sendMessage(input: SendMessageInput!): ChatResponse!
    # 专门的代码审查功能
    reviewCode(input: CodeReviewInput!): CodeReviewResponse!
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
