import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/**
 * Marks a route as reachable without authentication. The global JwtAuthGuard
 * checks for this metadata and lets the request through.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
