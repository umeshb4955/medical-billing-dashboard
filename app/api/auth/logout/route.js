import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the authentication cookie
    response.cookies.set('authToken', '', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 0 // Immediately expires the cookie
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
