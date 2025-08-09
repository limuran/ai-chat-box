import Anthropic from '@anthropic-ai/sdk';
import { Message } from '../graphql/types';

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
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

      console.log('Sending to Claude:', { messageCount: claudeMessages.length });

      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.7,
        messages: claudeMessages,
      });

      // 提取回复内容
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      
      throw new Error('无法解析 Claude 响应');
    } catch (error) {
      console.error('Claude API error:', error);
      
      if (error instanceof Error) {
        // 处理特定的 API 错误
        if (error.message.includes('rate_limit')) {
          throw new Error('请求太频繁，请稍后再试');
        }
        if (error.message.includes('invalid_api_key')) {
          throw new Error('API 密钥无效');
        }
        if (error.message.includes('insufficient_quota')) {
          throw new Error('API 配额不足');
        }
      }
      
      throw new Error('AI 服务暂时不可用，请稍后再试');
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch {
      return false;
    }
  }
}