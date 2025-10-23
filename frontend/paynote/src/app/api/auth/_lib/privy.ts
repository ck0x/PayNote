import { PrivyClient, type AuthTokenClaims, type User } from "@privy-io/server-auth";

const PRIVY_APP_ID = process.env.PRIVY_APP_ID ?? process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;

export class PrivyConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrivyConfigurationError";
  }
}

export class PrivyVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrivyVerificationError";
  }
}

let privyClient: PrivyClient | null = null;

function getPrivyClient(): PrivyClient {
  if (!PRIVY_APP_ID) {
    throw new PrivyConfigurationError(
      "PRIVY_APP_ID (or NEXT_PUBLIC_PRIVY_APP_ID) is not configured. Update .env.local with your server-side Privy App ID."
    );
  }

  if (!PRIVY_APP_SECRET) {
    throw new PrivyConfigurationError(
      "PRIVY_APP_SECRET is not configured. You can copy it from the Privy dashboard when creating the app secret."
    );
  }

  if (!privyClient) {
    privyClient = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET, {
      timeout: 8_000,
    });
  }

  return privyClient;
}

export interface VerifiedPrivySession {
  claims: AuthTokenClaims;
  user: User | null;
}

export async function verifyPrivyToken(token: string | null | undefined): Promise<VerifiedPrivySession> {
  if (!token) {
    throw new PrivyVerificationError("Missing Privy auth token in Authorization header.");
  }

  try {
    const client = getPrivyClient();
    const claims = await client.verifyAuthToken(token);
    const user = await client.getUser(claims.userId);

    return {
      claims,
      user,
    };
  } catch (error) {
    if (error instanceof PrivyConfigurationError || error instanceof PrivyVerificationError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown Privy verification error";
    throw new PrivyVerificationError(message);
  }
}
