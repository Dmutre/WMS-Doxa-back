import { AuthConfig } from '../types/configs/auth';

export default (): { auth: AuthConfig } => ({
  auth: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
  },
});
