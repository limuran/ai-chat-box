import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
import { handleCors } from './utils/cors';

const yoga = createYoga({
  schema,
  cors: {
    origin: (origin) => {
      // 允许的域名列表
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://ai-chat-box.pages.dev',
        'https://your-domain.com'
      ];
      
      if (!origin) return true; // 允许无 origin 的请求（如 Postman）
      return allowedOrigins.includes(origin);
    },
    credentials: true,
  },
  graphiql: {
    // 仅在开发环境启用 GraphiQL
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
        JSON.stringify({ error: 'Internal server error' }),
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