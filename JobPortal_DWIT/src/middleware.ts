import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/admin/:path*", "/company/:path*"],
};
