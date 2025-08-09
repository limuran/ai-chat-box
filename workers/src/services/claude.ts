import Anthropic from '@anthropic-ai/sdk';
import { Message } from '../graphql/types';

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Claude API key is required');
    }
    
    this.client = new Anthropic({
      apiKey,
    });
  }

  async sendMessage(messages: Message[]): Promise<string> {
    try {
      // 转换消息格式为 Claude API 需要的格式
      const claudeMessages = messages.map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }));

      console.log('Sending to Claude:', { 
        messageCount: claudeMessages.length,
        firstMessage: claudeMessages[0]?.content?.substring(0, 50) + '...'
      });

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022', // 使用最新的正确模型名称
        max_tokens: 1000,
        temperature: 0.7,
        messages: claudeMessages,
      });

      console.log('Claude response received:', {
        id: response.id,
        model: response.model,
        usage: response.usage
      });

      // 提取回复内容
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      
      throw new Error('无法解析 Claude 响应：不支持的内容类型');
    } catch (error) {
      console.error('Claude API error details:', {
        error: error.message,
        stack: error.stack,
        type: error.constructor.name
      });
      
      if (error instanceof Anthropic.APIError) {
        console.error('Anthropic API Error:', {
          status: error.status,
          message: error.message,
          type: error.type
        });
        
        // 处理特定的 API 错误
        switch (error.status) {
          case 401:
            throw new Error('API 密钥无效或已过期');
          case 404:
            throw new Error('请求的模型不存在或不可用');
          case 429:
            throw new Error('请求太频繁，请稍后再试');
          case 400:
            throw new Error('请求格式错误');
          case 500:
            throw new Error('Claude 服务器内部错误');
          default:
            throw new Error(`Claude API 错误 (${error.status}): ${error.message}`);
        }
      }
      
      if (error instanceof Error) {
        if (error.message.includes('rate_limit')) {
          throw new Error('请求太频繁，请稍后再试');
        }
        if (error.message.includes('invalid_api_key')) {
          throw new Error('API 密钥无效');
        }
        if (error.message.includes('insufficient_quota')) {
          throw new Error('API 配额不足');
        }
        if (error.message.includes('network')) {
          throw new Error('网络连接问题，请稍后再试');
        }
        if (error.message.includes('not_found_error')) {
          throw new Error('请求的 Claude 模型不存在，请联系管理员更新配置');
        }
      }
      
      throw new Error(`AI 服务错误: ${error.message}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      console.log('Validating API key...');
      await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022', // 使用正确的模型名称
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
      console.log('API key validation successful');
      return true;
    } catch (error) {
      console.error('API key validation failed:', error.message);
      return false;
    }
  }
}