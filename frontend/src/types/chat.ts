export interface Message {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageInput {
  content: string;
  conversationHistory?: MessageInput[];
}

export interface MessageInput {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message?: Message;
  error?: string;
}