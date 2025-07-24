import { withAuth } from "next-auth/middleware";

export default withAuth(
  // Success function - runs after successful authentication
  function middleware() {
    // Token exists, user is authenticated
    return;
  },
  {
    callbacks: {
      // Verify token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|login|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};