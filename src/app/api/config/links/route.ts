import { NextResponse } from 'next/server';
import { EXTERNAL_LINKS } from '@/lib/googleSheets/config';

export async function GET() {
    return NextResponse.json(EXTERNAL_LINKS);
}
