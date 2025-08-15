import { mastra, selectAppropriateAgent, AgentType } from '../mastra';
import { claudeService } from './claude';

export interface MastraServiceConfig {
  claudeApiKey: string;
}

export class MastraService {
  private config: MastraServiceConfig;

  constructor(config: MastraServiceConfig) {
    this.config = config;
  }

  /**
   * 使用 Mastra 处理消息，自动选择合适的 Agent
   */
  async processWithMastra(
    message: string, 
    conversationHistory: any[] = [],
    agentType?: AgentType
  ) {
    try {
      // 如果没有指定 agent 类型，自动选择
      const selectedAgent = agentType || selectAppropriateAgent(message);
      
      console.log(`Using agent: ${selectedAgent} for message: ${message.slice(0, 100)}...`);

      // 获取选定的 agent
      const agent = mastra.getAgent(selectedAgent);
      
      if (!agent) {
        throw new Error(`Agent ${selectedAgent} not found`);
      }

      // 构建对话上下文
      const context = this.buildConversationContext(conversationHistory);
      
      // 使用 Mastra agent 处理消息
      const result = await agent.generate([
        ...context,
        {
          role: 'user',
          content: message,
        }
      ]);

      return {
        success: true,
        content: result.text,
        agentUsed: selectedAgent,
        toolsUsed: result.toolCalls || [],
      };

    } catch (error) {
      console.error('Mastra processing error:', error);
      
      // 如果 Mastra 处理失败，回退到原有的 Claude 服务
      console.log('Falling back to Claude service');
      return this.fallbackToClaude(message, conversationHistory);
    }
  }

  /**
   * 专门用于代码审查的方法
   */
  async reviewCode(code: string, language?: string, context?: string) {
    try {
      const agent = mastra.getAgent('codeReviewAgent');
      
      if (!agent) {
        throw new Error('Code review agent not found');
      }

      // 构建代码审查的特定提示
      const prompt = this.buildCodeReviewPrompt(code, language, context);
      
      const result = await agent.generate([
        {
          role: 'user',
          content: prompt,
        }
      ]);

      return {
        success: true,
        content: result.text,
        agentUsed: 'codeReviewAgent',
        toolsUsed: result.toolCalls || [],
      };

    } catch (error) {
      console.error('Code review error:', error);
      throw error;
    }
  }

  /**
   * 构建对话上下文
   */
  private buildConversationContext(history: any[]) {
    return history.map(msg => ({
      role: msg.role === 'USER' ? 'user' : 'assistant',
      content: msg.content,
    }));
  }

  /**
   * 构建代码审查的专用提示
   */
  private buildCodeReviewPrompt(code: string, language?: string, context?: string) {
    let prompt = `请对以下代码进行详细审查：\n\n`;
    
    if (language) {
      prompt += `编程语言: ${language}\n`;
    }
    
    if (context) {
      prompt += `上下文信息: ${context}\n`;
    }
    
    prompt += `\n代码内容:\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\n`;
    prompt += `请提供：\n`;
    prompt += `1. 代码质量评分 (1-10分)\n`;
    prompt += `2. 发现的问题和改进建议\n`;
    prompt += `3. 安全性分析\n`;
    prompt += `4. 性能优化建议\n`;
    prompt += `5. 最佳实践建议`;

    return prompt;
  }

  /**
   * 回退到原有的 Claude 服务
   */
  private async fallbackToClaude(message: string, conversationHistory: any[]) {
    const claudeServiceInstance = new claudeService({
      apiKey: this.config.claudeApiKey,
    });

    const response = await claudeServiceInstance.sendMessage(message, conversationHistory);
    
    return {
      success: true,
      content: response.content[0]?.text || '',
      agentUsed: 'claude-fallback',
      toolsUsed: [],
    };
  }

  /**
   * 获取可用的 agents 列表
   */
  getAvailableAgents(): AgentType[] {
    return ['codeReviewAgent', 'generalCodingAgent'];
  }

  /**
   * 检查 Mastra 服务状态
   */
  async healthCheck() {
    try {
      const agents = this.getAvailableAgents();
      const agentStatus = {};
      
      for (const agentType of agents) {
        const agent = mastra.getAgent(agentType);
        agentStatus[agentType] = !!agent;
      }

      return {
        status: 'healthy',
        agents: agentStatus,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
