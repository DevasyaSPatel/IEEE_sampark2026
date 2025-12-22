import { NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';

export async function GET() {
    try {
        const users = await GoogleSheetService.getAllUsersWithConnectionCounts();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Directory API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
    }
}
