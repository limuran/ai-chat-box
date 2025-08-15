import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
import { handleCors } from './utils/cors';
import { createMastra } from './mastra';

// 禁用 Mastra 遥测警告（在 Cloudflare Workers 环境中不需要）
globalThis.___MASTRA_TELEMETRY___ = true;

export interface Env {
  CLAUDE_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  ENVIRONMENT?: string;
}

const yoga = createYoga({
  schema,
  cors: {
    origin: '*', // 简化CORS配置，允许所有来源
    credentials: true,
  },
  graphiql: {
    // 启用 GraphiQL
    enabled: true,
  },
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    try {
      // 获取 API 密钥
      const apiKey = env.ANTHROPIC_API_KEY || env.CLAUDE_API_KEY;
      
      if (!apiKey) {
        console.error('Missing API key: Please set ANTHROPIC_API_KEY or CLAUDE_API_KEY');
        return new Response(
          JSON.stringify({ 
            error: 'Configuration error', 
            message: 'API key not configured. Please set ANTHROPIC_API_KEY or CLAUDE_API_KEY in your Cloudflare Workers environment.',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // 使用 API 密钥创建 Mastra 实例
      const mastra = createMastra(apiKey);
      console.log('Mastra initialized successfully with API key');
      
      // 将环境变量和 Mastra 实例注入到上下文中
      return await yoga.fetch(request, {
        env,
        ctx,
        mastra, // 将正确配置的 Mastra 实例传递给 GraphQL 上下文
      });
    } catch (error) {
      console.error('Workers error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error', 
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

// 导出类型供其他模块使用
export type { Env };
