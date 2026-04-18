const env = process.env;

function required(key: string): string {
  const val = env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return env[key] ?? fallback;
}

export const config = {
  port: parseInt(optional('PORT', '3001'), 10),
  nodeEnv: optional('NODE_ENV', 'development'),
  databaseUrl: optional('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/microplastics'),
  jwt: {
    secret: optional('JWT_SECRET', 'dev-secret-change-in-production'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },
  storage: {
    provider: optional('STORAGE_PROVIDER', 'local') as 'local' | 's3',
    localPath: optional('LOCAL_STORAGE_PATH', './uploads'),
  },
  aws: {
    region: optional('AWS_REGION', 'us-east-1'),
    bucket: optional('AWS_S3_BUCKET', 'microplastics-samples'),
    accessKeyId: env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: env['AWS_SECRET_ACCESS_KEY'],
  },
} as const;
