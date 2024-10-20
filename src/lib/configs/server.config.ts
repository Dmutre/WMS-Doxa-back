import { ServerConfig } from '../types/configs/server';

export default (): { server: ServerConfig } => ({
  server: {
    port: parseInt(process.env.PORT, 10) ?? 3000,
    host: process.env.PORT ?? '0.0.0.0',
  },
});
