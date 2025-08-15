import { Mastra } from '@mastra/core';
import { createAgents } from './agents/code-agents';
import { codeReviewTool, codeOptimizationTool, codeExplanationTool } from './tools/code-tools';

// 创建 Mastra 实例的工厂函数
export const createMastra = (apiKey: string) => {
  console.log('🏗️ [MASTRA] Creating Mastra instance with API key:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    throw new Error('API key is required to create Mastra instance');
  }

  const { codeReviewAgent, generalCodingAgent } = createAgents(apiKey);
  
  const mastraInstance = new Mastra({
    agents: { 
      codeReviewAgent, 
      generalCodingAgent 
    },
    tools: {
      codeReviewTool,
      codeOptimizationTool,
      codeExplanationTool,
    },
  });

  console.log('✅ [MASTRA] Mastra instance created successfully');
  
  return mastraInstance;
};

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
    console.log('🎯 [AGENT-SELECT] Selected codeReviewAgent for code-related query');
    return 'codeReviewAgent';
  }

  // 默认使用通用编程助手
  console.log('🎯 [AGENT-SELECT] Selected generalCodingAgent for general query');
  return 'generalCodingAgent';
}

// Cloudflare Workers 特定的 Mastra 处理函数
export async function handleMastraRequest(
  mastra: Mastra,
  agentName: AgentType,
  message: string,
  conversationHistory: any[] = []
) {
  try {
    console.log(`🚀 [MASTRA-REQUEST] Processing with agent: ${agentName}`);
    console.log(`📝 [MASTRA-REQUEST] Message: "${message.slice(0, 100)}..."`);

    // 获取指定的 agent
    const agent = mastra.getAgent(agentName);
    
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    console.log(`✅ [MASTRA-REQUEST] Agent ${agentName} found`);

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

    console.log(`💬 [MASTRA-REQUEST] Sending ${messages.length} messages to agent`);

    // 使用 agent 生成响应
    const result = await agent.generate(messages);

    console.log(`🎉 [MASTRA-REQUEST] Successfully generated response`);

    return {
      success: true,
      content: result.text,
      agentUsed: agentName,
      toolsUsed: result.toolCalls?.map(call => call.tool.id) || [],
    };

  } catch (error) {
    console.error('❌ [MASTRA-REQUEST] Error:', error);
    throw error;
  }
}

// 专门用于代码审查的处理函数
export async function handleCodeReview(
  mastra: Mastra,
  code: string, 
  language?: string, 
  context?: string
) {
  try {
    console.log('🔍 [CODE-REVIEW] Starting code review process');
    
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

    console.log('📋 [CODE-REVIEW] Generated review prompt');

    const result = await agent.generate([
      {
        role: 'user',
        content: prompt,
      }
    ]);

    console.log('✅ [CODE-REVIEW] Review completed successfully');

    return {
      success: true,
      content: result.text,
      agentUsed: 'codeReviewAgent',
      toolsUsed: result.toolCalls?.map(call => call.tool.id) || [],
    };

  } catch (error) {
    console.error('❌ [CODE-REVIEW] Error:', error);
    throw error;
  }
}

// 健康检查函数
export async function checkMastraHealth(mastra: Mastra) {
  try {
    console.log('🏥 [HEALTH-CHECK] Running Mastra health check');
    
    const agents = ['codeReviewAgent', 'generalCodingAgent'] as AgentType[];
    const agentStatus: Record<string, boolean> = {};
    
    for (const agentType of agents) {
      const agent = mastra.getAgent(agentType);
      agentStatus[agentType] = !!agent;
      console.log(`🔍 [HEALTH-CHECK] ${agentType}: ${agent ? 'Available' : 'Not found'}`);
    }

    console.log('✅ [HEALTH-CHECK] Health check completed');

    return {
      status: 'healthy',
      agents: agentStatus,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ [HEALTH-CHECK] Error:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 为了向后兼容，导出一个默认实例（但没有 API key 会失败）
// export const mastra = createMastra('');
