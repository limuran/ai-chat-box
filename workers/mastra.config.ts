import { Config } from '@mastra/core';

export default {
  name: 'ai-chat-mastra',
  engine: 'cloudflare',
  agents: './src/mastra/agents',
  tools: './src/mastra/tools',
  integrations: [],
  workflows: [],
  memory: {
    provider: 'in-memory', // 对于 Cloudflare Workers，使用内存存储
  },
  llms: [
    {
      provider: 'ANTHROPIC',
      name: 'claude-3-5-sonnet-20241022',
    },
  ],
  environment: {
    development: {
      url: 'http://localhost:8787',
    },
    production: {
      url: process.env.CLOUDFLARE_WORKERS_URL || 'https://your-workers-domain.workers.dev',
    },
  },
} satisfies Config;
