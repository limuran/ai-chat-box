import { Mastra } from '@mastra/core/mastra';
import { Memory } from '@mastra/memory';
import { codeReviewAgent, generalCodingAgent } from './agents/code-agents';
import { codeReviewTool, codeOptimizationTool, codeExplanationTool } from './tools/code-tools';

// Cloudflare Workers 环境的简单存储实现
class WorkersMemoryStorage {
  private storage = new Map<string, any>();

  async get(key: string) {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: any) {
    this.storage.set(key, value);
  }

  async delete(key: string) {
    this.storage.delete(key);
  }
}

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
  // 在 Workers 环境中使用简单的内存存储
  // 生产环境建议使用 Cloudflare KV 或 D1 数据库
  memory: new Memory({
    storage: new WorkersMemoryStorage()
  }),
});

// 导出 agent 类型以便在其他地方使用
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
