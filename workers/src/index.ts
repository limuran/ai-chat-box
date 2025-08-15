import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
import { handleCors } from './utils/cors';
import { mastra } from './mastra';

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

export interface Env {
  CLAUDE_API_KEY: string;
  ENVIRONMENT?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    try {
      // 初始化 Mastra 实例 (确保在 Workers 环境中正确配置)
      console.log('Initializing Mastra in Cloudflare Workers environment');
      
      // 将环境变量和 Mastra 实例注入到上下文中
      return await yoga.fetch(request, {
        env,
        ctx,
        mastra, // 将 Mastra 实例传递给 GraphQL 上下文
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
