import { AuthConfig } from '../types/configs/auth';

export default (): { auth: AuthConfig } => ({
  auth: {
    secret: process.env.JWT_SECRET,
    accessTtl: process.env.ACCESS_TTL,
    refreshTtl: process.env.JWT_TTL,
  },
});
