
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleSheetService } from '@/lib/googleSheets/service';

// Use the same auth as the service
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Extract File ID from Drive URL
 * Supports:
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view...
 */
function getFileIdFromUrl(url: string | null): string | null {
    if (!url) return null;
    let fileId: string | null = null;

    if (url.includes('/file/d/')) {
        const parts = url.split('/file/d/');
        if (parts.length > 1) {
            fileId = parts[1].split('/')[0];
        }
    } else if (url.includes('id=')) {
        const params = new URLSearchParams(url.split('?')[1]);
        fileId = params.get('id');
    }

    return fileId;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let fileId: string | null = null;

    try {
        console.log(`[Certificate] Processing download for user: ${userId}`);
        const user = await GoogleSheetService.getUser(userId);

        if (!user || !user.certificate) {
            console.error(`[Certificate] No certificate found for user ${userId}`);
            return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
        }

        fileId = getFileIdFromUrl(user.certificate);
        console.log(`[Certificate] Extracted File ID: ${fileId} from URL: ${user.certificate}`);

        if (!fileId) {
            return NextResponse.json({ error: 'Invalid certificate link format' }, { status: 400 });
        }

        // 1. Fetch Metadata
        const fileMetadata = await drive.files.get({
            fileId: fileId,
            fields: 'name, mimeType, size'
        });

        const meta = fileMetadata.data;
        let fileName = meta.name || 'certificate.pdf';
        const mimeType = meta.mimeType || 'application/pdf';

        console.log(`[Certificate] File Found: ${fileName} (${mimeType})`);

        // 2. Determine Download Method (Export vs Media)
        let response;
        let contentType = mimeType;

        if (mimeType.startsWith('application/vnd.google-apps.')) {
            // It's a Google Doc/Sheet/Slide - MUST EXPORT
            console.log(`[Certificate] Converting Google Doc to PDF...`);
            contentType = 'application/pdf';
            if (!fileName.toLowerCase().endsWith('.pdf')) {
                fileName += '.pdf';
            }
            response = await drive.files.export(
                { fileId: fileId, mimeType: 'application/pdf' },
                { responseType: 'stream' }
            );
        } else {
            // It's a binary file (uploaded PDF/Zip etc)
            console.log(`[Certificate] Downloading binary file...`);
            response = await drive.files.get(
                { fileId: fileId, alt: 'media' },
                { responseType: 'stream' }
            );
        }

        // 3. Stream Response
        // @ts-ignore
        const nodeStream = response.data;

        const webStream = new ReadableStream({
            start(controller) {
                nodeStream.on('data', (chunk: any) => controller.enqueue(chunk));
                nodeStream.on('end', () => controller.close());
                nodeStream.on('error', (err: any) => controller.error(err));
            }
        });

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
        // Note: Content-Length is often unknown for streams/exports

        return new NextResponse(webStream, { headers });

    } catch (error: any) {
        console.error('[Certificate] Download Failed:', error);

        // Handle "API Not Enabled" specifically
        if (error.message && error.message.includes('has not been used in project')) {
            return NextResponse.json({
                error: 'Google Drive API Disabled',
                details: 'The Google Drive API is not enabled for this project. Please enable it in the Google Cloud Console.'
            }, { status: 500 });
        }

        // Return JSON error for the UI to handle (or browser to show)
        // If 403, usually permission
        if (error.code === 403 || (error.response && error.response.status === 403)) {
            return NextResponse.json({
                error: 'Access Denied',
                details: 'Server cannot access this file. Please ensure the file is shared with the Service Account email or "Anyone with the link".'
            }, { status: 403 });
        }

        return NextResponse.json({
            error: 'Download Failed',
            details: error.message
        }, { status: 500 });
    }
}
