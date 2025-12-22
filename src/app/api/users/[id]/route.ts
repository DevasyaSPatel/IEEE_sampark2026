import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetService } from '@/lib/googleSheets/service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    // Decode ID if it's an email (URLs might encode it)
    const decodedId = decodeURIComponent(id);
    const user = await GoogleSheetService.getUser(decodedId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const targetEmail = decodeURIComponent(id);

    // Handle "connect" action
    if (body.action === 'connect') {
        const { sourceEmail, sourceName, sourcePhone, note } = body;

        // Validation
        if (!sourceEmail && !sourceName) {
            return NextResponse.json({ error: 'Name or Email required' }, { status: 400 });
        }

        // 1. Fetch Source User Details if we have an email (Logged in user)
        let finalSourceName = sourceName;
        let finalSourcePhone = sourcePhone;

        if (sourceEmail) {
            const sourceUser = await GoogleSheetService.getUser(sourceEmail);
            if (sourceUser) {
                finalSourceName = sourceUser.name;
                // Use phone if available in profile, else keep request phone
            }
        }

        // 2. Add Connection: Source -> Target (So Source remembers Target)
        const forwardSuccess = await GoogleSheetService.addConnection({
            sourceEmail,
            targetEmail,
            sourceName: finalSourceName,
            sourcePhone: finalSourcePhone,
            note
        });

        // 3. Mutual Connection: Target -> Source (So Target remembers Source immediately)
        let mutualSuccess = true;

        if (forwardSuccess) return NextResponse.json({ success: true, mutual: mutualSuccess });
        return NextResponse.json({ error: "Failed to connect" }, { status: 500 });
    } else {
        // Handle Profile Update

        const users = await GoogleSheetService.getAllUsers();
        const user = users.find(u => u.email === targetEmail);

        if (user) {
            await GoogleSheetService.updateUserDetails(user.rowIndex, body);
            // Return updated user
            const updatedUser = await GoogleSheetService.getUser(targetEmail);
            return NextResponse.json(updatedUser);
        } else {
            return NextResponse.json({ error: "User not found for update" }, { status: 404 });
        }
    }
}
