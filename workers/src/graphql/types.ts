export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface SendMessageInput {
  content: string;
  conversationHistory?: Message[];
}

export interface GraphQLContext {
  env: {
    CLAUDE_API_KEY: string;
    ENVIRONMENT?: string;
  };
  ctx: ExecutionContext;
}