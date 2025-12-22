import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';

export async function POST(request: NextRequest) {
    try {
        const updatedCount = await GoogleSheetService.backfillSlugs();
        return NextResponse.json({ success: true, updated: updatedCount });
    } catch (error) {
        console.error("Backfill error:", error);
        return NextResponse.json({ error: "Failed to backfill slugs" }, { status: 500 });
    }
}
