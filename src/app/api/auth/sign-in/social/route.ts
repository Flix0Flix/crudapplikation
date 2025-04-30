import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { provider } = await request.json();
  try {
    const result = await auth.handler.socialSignIn({ provider });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}