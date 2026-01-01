
import { NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const user = await GoogleSheetService.getUserWithCredentials(email);

        if (!user) {
            // For security, maybe we shouldn't reveal if user exists? 
            // But for this use case, explicit error might be helpful.
            // Let's stick to generic message or "User not found" if that's acceptable.
            // User requested "only if the status is approved", so if not found -> error.
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        if (user.status?.toLowerCase() !== 'approved') {
            return NextResponse.json(
                { message: 'Account not approved yet. Please wait for admin approval.' },
                { status: 403 }
            );
        }

        // Send email
        const result = await sendWelcomeEmail(user.email, user.name, user.email, user.password);

        if (result && result.success) {
            return NextResponse.json({ success: true, message: 'Credentials sent to your email.' });
        } else {
            console.error('Email sending failed:', result?.error);
            return NextResponse.json(
                { message: 'Failed to send email. Please try again later.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Forgot Password error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
