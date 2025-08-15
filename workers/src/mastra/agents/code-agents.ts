import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core';
import { Memory } from '@mastra/memory';
import { codeReviewTool, codeOptimizationTool, codeExplanationTool } from '../tools/code-tools';

// 创建 Anthropic 客户端，API 密钥从环境变量获取
const createAnthropicClient = () => {
  // 在 Cloudflare Workers 中，环境变量通过 env 对象传递
  // 这里我们使用一个工厂函数，在运行时获取 API 密钥
  return anthropic('claude-3-5-sonnet-20241022', {
    apiKey: globalThis.ANTHROPIC_API_KEY || globalThis.CLAUDE_API_KEY,
  });
};

export const codeReviewAgent = new Agent({
  name: 'Code Review Agent',
  instructions: `
你是一位资深的代码审查专家，擅长多种编程语言的代码分析和优化。你的主要职责包括：

## 核心能力
1. **代码质量评估**: 分析代码结构、可读性、可维护性
2. **安全漏洞检测**: 识别潜在的安全问题和漏洞
3. **性能优化建议**: 提供性能改进方案
4. **最佳实践指导**: 基于行业标准提供建议
5. **代码解释说明**: 详细解释代码逻辑和功能

## 审查流程
当用户提供代码时，请按以下步骤进行审查：

1. **初步分析**: 识别代码语言、功能、结构
2. **质量评估**: 检查代码风格、命名规范、注释质量
3. **逻辑审查**: 分析算法效率、业务逻辑正确性
4. **安全检查**: 寻找安全漏洞、输入验证问题
5. **性能分析**: 识别性能瓶颈和优化机会
6. **改进建议**: 提供具体的修改建议和最佳实践

## 响应格式
请始终提供结构化的审查报告，包括：
- 🔍 **总体评分**: 1-10分的代码质量评分
- ⚠️ **问题清单**: 发现的具体问题
- 💡 **改进建议**: 详细的优化建议
- 🔒 **安全建议**: 安全相关的改进点
- ⚡ **性能优化**: 性能提升建议
- 📝 **最佳实践**: 相关的编程最佳实践

保持专业、友善的语调，提供建设性的反馈。
`,
  model: createAnthropicClient(),
  tools: { 
    codeReviewTool, 
    codeOptimizationTool, 
    codeExplanationTool 
  },
  memory: new Memory({
    // 在 Cloudflare Workers 环境中，我们使用内存存储
    storage: {
      async get(key: string) {
        // 简单的内存实现，实际项目中可以用 KV 存储
        return null;
      },
      async set(key: string, value: any) {
        // 简单的内存实现
        return;
      },
      async delete(key: string) {
        return;
      }
    }
  }),
});

export const generalCodingAgent = new Agent({
  name: 'General Coding Assistant',
  instructions: `
你是一位全能的编程助手，能够帮助用户解决各种编程问题：

## 核心功能
1. **代码编写**: 根据需求编写高质量代码
2. **问题调试**: 帮助定位和解决代码问题
3. **技术咨询**: 回答编程相关的技术问题
4. **架构设计**: 提供系统架构和设计建议
5. **学习指导**: 帮助学习新技术和最佳实践

## 响应原则
- 提供清晰、易懂的解释
- 给出可执行的代码示例
- 考虑代码的可维护性和扩展性
- 遵循相关语言的最佳实践
- 注重代码安全性和性能

当用户有编程需求时，请：
1. 理解用户的具体需求
2. 提供清晰的解决方案
3. 给出完整的代码示例
4. 解释关键部分的实现思路
5. 提醒注意事项和最佳实践
`,
  model: createAnthropicClient(),
  tools: { 
    codeExplanationTool 
  },
});
