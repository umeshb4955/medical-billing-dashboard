import { NextResponse } from 'next/server';

// Hardcoded credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const SECRET_KEY = 'your-secret-key-change-in-production';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple token (in production, use JWT with expiration)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      const response = NextResponse.json(
        { 
          success: true, 
          token,
          message: 'Login successful'
        },
        { status: 200 }
      );

      // Set token as HTTP-only cookie for middleware access
      response.cookies.set('authToken', token, {
        httpOnly: false, // Allow JavaScript access for localStorage
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
