export interface Message {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message?: Message;
  error?: string;
  agentUsed?: string;
  toolsUsed?: string[];
}

export interface SendMessageInput {
  content: string;
  conversationHistory?: Message[];
  agentType?: 'CODE_REVIEW_AGENT' | 'GENERAL_CODING_AGENT' | 'AUTO_SELECT';
}

export interface CodeReviewInput {
  code: string;
  language?: string;
  context?: string;
}

export interface CodeReviewResponse {
  success: boolean;
  content: string;
  agentUsed: string;
  error?: string;
}

export interface MastraHealthCheck {
  status: string;
  agents: AgentStatus[];
  timestamp: string;
  error?: string;
}

export interface AgentStatus {
  name: string;
  available: boolean;
}

export interface GraphQLContext {
  env: {
    CLAUDE_API_KEY: string;
    ENVIRONMENT?: string;
  };
  ctx: ExecutionContext;
}
