import { NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('user');

    if (!email) {
        return NextResponse.json({ error: 'User Email required' }, { status: 400 });
    }

    try {
        const connections = await GoogleSheetService.getUserConnections(email);
        return NextResponse.json(connections);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
    }
}
