import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname

  // Allow localhost
  if (hostname === 'localhost') {
    return NextResponse.next()
  }

  // Allow Vercel preview domain
  if (hostname.endsWith('.vercel.app')) {
    return NextResponse.next()
  }

  // Block public domains (for now)
  if (
    hostname === 'startupsignals.in' ||
    hostname === 'www.startupsignals.in'
  ) {
    return new NextResponse(null, { status: 403 })
  }

  return NextResponse.next()
}
