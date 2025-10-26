function assertEnv(variableName: string) {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${variableName}. Check your .env.local file.`
    );
  }
  return value;
}

export const DATABASE_URL = assertEnv("DATABASE_URL");
export const NEON_SHADOW_DATABASE_URL =
  process.env.NEON_SHADOW_DATABASE_URL ?? "";

export const env = {
  DATABASE_URL,
  NEON_SHADOW_DATABASE_URL,
};

