import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
import { handleCors } from './utils/cors';

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
      // 将环境变量注入到上下文中
      return await yoga.fetch(request, {
        env,
        ctx,
      });
    } catch (error) {
      console.error('Workers error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: error.message }),
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