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

class GraphQLService {
  private endpoint: string;

  constructor(endpoint: string = '/graphql') {
    this.endpoint = endpoint;
  }

  private async request<T>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message || 'GraphQL Error');
    }

    return result.data;
  }

  async sendMessage(input: SendMessageInput): Promise<ChatResponse> {
    const query = `
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
          agentUsed
          toolsUsed
        }
      }
    `;

    const result = await this.request<{ sendMessage: ChatResponse }>(query, { input });
    return result.sendMessage;
  }

  async reviewCode(input: CodeReviewInput): Promise<CodeReviewResponse> {
    const query = `
      mutation ReviewCode($input: CodeReviewInput!) {
        reviewCode(input: $input) {
          success
          content
          agentUsed
          error
        }
      }
    `;

    const result = await this.request<{ reviewCode: CodeReviewResponse }>(query, { input });
    return result.reviewCode;
  }

  async getHealth(): Promise<string> {
    const query = `
      query GetHealth {
        health
      }
    `;

    const result = await this.request<{ health: string }>(query);
    return result.health;
  }

  async getMastraHealth(): Promise<MastraHealthCheck> {
    const query = `
      query GetMastraHealth {
        mastraHealth {
          status
          agents {
            name
            available
          }
          timestamp
          error
        }
      }
    `;

    const result = await this.request<{ mastraHealth: MastraHealthCheck }>(query);
    return result.mastraHealth;
  }

  async getAvailableAgents(): Promise<string[]> {
    const query = `
      query GetAvailableAgents {
        availableAgents
      }
    `;

    const result = await this.request<{ availableAgents: string[] }>(query);
    return result.availableAgents;
  }

  async clearConversation(): Promise<boolean> {
    const query = `
      mutation ClearConversation {
        clearConversation
      }
    `;

    const result = await this.request<{ clearConversation: boolean }>(query);
    return result.clearConversation;
  }
}

export const graphqlService = new GraphQLService();
