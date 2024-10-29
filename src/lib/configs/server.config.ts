import { ServerConfig } from '../types/configs/server';

export default (): { server: ServerConfig } => ({
  server: {
    port: parseInt(process.env.PORT, 10) ?? 3000,
    host: process.env.HOST ?? '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN ?? '*',
      methods: process.env.CORS_METHODS ?? 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  },
});
