import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        try {
            const results = await GoogleSheetService.searchUsers("");
            const shuffled = results.sort(() => 0.5 - Math.random()).slice(0, 20);
            return NextResponse.json({ results: shuffled });
        } catch (e) {
            return NextResponse.json({ results: [] });
        }
    }

    try {
        const results = await GoogleSheetService.searchUsers(query);
        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
