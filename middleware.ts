import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware, applySecurityHeaders } from './src/middleware/security';

export async function middleware(request: NextRequest) {
  // Apply security middleware
  const securityResponse = await securityMiddleware(request);
  if (securityResponse) {
    return securityResponse;
  }
  
  // Continue to the next middleware or route
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  return applySecurityHeaders(response);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|robots.txt|sitemap.xml).*)',
  ],
};