import { NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { message: 'Username and password are required' },
                { status: 400 }
            );
        }

        const user = await GoogleSheetService.authenticateUser(username, password);

        if (user) {
            return NextResponse.json({ success: true, user });
        } else {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
