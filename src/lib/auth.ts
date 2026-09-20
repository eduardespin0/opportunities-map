import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'oppmaps_admin_token';

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'opportunity_maps_super_secret_jwt_key_2026_secure!';
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  username: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Creates a signed JWT token valid for 7 days
 */
export async function createSessionToken(username: string): Promise<string> {
  const key = getJwtSecretKey();
  return await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

/**
 * Verifies a JWT token and returns payload if valid
 */
export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const key = getJwtSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as AdminSessionPayload;
  } catch (error) {
    return null;
  }
}
