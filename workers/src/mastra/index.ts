import { Mastra } from '@mastra/core';
import { codeReviewAgent, generalCodingAgent } from './agents/code-agents';
import { codeReviewTool, codeOptimizationTool, codeExplanationTool } from './tools/code-tools';

// 创建 Mastra 实例，专门为 Cloudflare Workers 优化
export const mastra = new Mastra({
  agents: { 
    codeReviewAgent, 
    generalCodingAgent 
  },
  tools: {
    codeReviewTool,
    codeOptimizationTool,
    codeExplanationTool,
  },
  // Note: Deployer is not needed in runtime, only during build/deploy process
});

// 导出 agent 类型
export type AgentType = 'codeReviewAgent' | 'generalCodingAgent';

// 工具函数：根据消息内容自动选择合适的 agent
export function selectAppropriateAgent(message: string): AgentType {
  const codeReviewKeywords = [
    '代码审查', '代码review', 'code review', '审查代码', '检查代码',
    '代码质量', '代码问题', '代码优化', '性能优化', '安全检查',
    '重构', 'refactor', '最佳实践', 'best practice'
  ];

  const messageLower = message.toLowerCase();
  
  // 检查是否包含代码审查相关关键词
  const hasCodeReviewKeywords = codeReviewKeywords.some(keyword => 
    messageLower.includes(keyword.toLowerCase())
  );

  // 检查是否包含代码块（简单判断）
  const hasCodeBlock = message.includes('```') || message.includes('function') || 
                      message.includes('class ') || message.includes('def ') ||
                      message.includes('const ') || message.includes('let ') ||
                      message.includes('var ');

  // 如果有代码审查关键词或者包含代码块，使用代码审查 agent
  if (hasCodeReviewKeywords || hasCodeBlock) {
    return 'codeReviewAgent';
  }

  // 默认使用通用编程助手
  return 'generalCodingAgent';
}

// Cloudflare Workers 特定的 Mastra 处理函数
export async function handleMastraRequest(
  agentName: AgentType,
  message: string,
  conversationHistory: any[] = []
) {
  try {
    // 获取指定的 agent
    const agent = mastra.getAgent(agentName);
    
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    // 构建对话上下文
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role === 'USER' ? 'user' : 'assistant',
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      }
    ];

    // 使用 agent 生成响应
    const result = await agent.generate(messages);

    return {
      success: true,
      content: result.text,
      agentUsed: agentName,
      toolsUsed: result.toolCalls?.map(call => call.tool.id) || [],
    };

  } catch (error) {
    console.error('Mastra request error:', error);
    throw error;
  }
}

// 专门用于代码审查的处理函数
export async function handleCodeReview(
  code: string, 
  language?: string, 
  context?: string
) {
  try {
    const agent = mastra.getAgent('codeReviewAgent');
    
    if (!agent) {
      throw new Error('Code review agent not found');
    }

    // 构建代码审查的特定提示
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
      toolsUsed: result.toolCalls?.map(call => call.tool.id) || [],
    };

  } catch (error) {
    console.error('Code review error:', error);
    throw error;
  }
}

// 健康检查函数
export async function checkMastraHealth() {
  try {
    const agents = ['codeReviewAgent', 'generalCodingAgent'] as AgentType[];
    const agentStatus: Record<string, boolean> = {};
    
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
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}
