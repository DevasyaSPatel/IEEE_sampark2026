
import { google } from 'googleapis';
import { randomUUID } from 'crypto';
import { SHEET_CONFIG } from '../config/googleSheets';

// Environment variables for Google Sheets
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SHEET_ID = SHEET_CONFIG.SPREADSHEET_ID;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    },
    scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Helper to generate secure random credentials
 */
export function generateCredentials(rowId: number) {
    const username = `SMPK${1000 + rowId}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { username, password };
}

export function generateSlug() {
    return randomUUID().replace(/-/g, '').substring(0, 12);
}

export const GoogleSheetService = {
    /**
     * Authenticate a user by checking email and password against the sheet.
     */
    async authenticateUser(username: string, pass: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        try {
            const range = `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${SHEET_CONFIG.COLUMNS.TIMESTAMP}:${SHEET_CONFIG.COLUMNS.SLUG}`;
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: range,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) return null;

            const user = rows.find((row: string[]) => {
                const emailMatch = row[SHEET_CONFIG.INDEX.EMAIL]?.trim() === username.trim();
                if (!emailMatch) return false;

                const passStart = row[SHEET_CONFIG.INDEX.PASSWORD]?.trim();
                if (passStart && passStart === pass.trim()) return true;

                return false;
            });

            if (user) {
                return {
                    name: user[SHEET_CONFIG.INDEX.NAME],
                    email: user[SHEET_CONFIG.INDEX.EMAIL],
                    phone: user[SHEET_CONFIG.INDEX.PHONE],
                    slug: user[SHEET_CONFIG.INDEX.SLUG],
                };
            }
            return null;
        } catch (error) {
            console.error("Error accessing Google Sheets:", error);
            return null;
        }
    },

    /**
     * Append a new user registration to the sheet.
     */
    async appendUserRegistration(userData: any) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        // Get next row number for ID generation
        const rangeData = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:A`,
        });
        const nextRow = (rangeData.data.values?.length || 0) + 1;

        const { username, password } = generateCredentials(nextRow);
        const slug = generateSlug();

        // Prepare row data mapped to columns
        // We constructed the array to match index order 0..N
        // But since we have gaps or strict column letters, we have to correspond exact indices.
        // Easiest is to build an array up to the last column we need.

        // Current max column is SLUG (R = 17)
        const rowValues = new Array(18).fill('');

        rowValues[SHEET_CONFIG.INDEX.TIMESTAMP] = new Date().toLocaleString();
        rowValues[SHEET_CONFIG.INDEX.NAME] = userData.name;
        rowValues[SHEET_CONFIG.INDEX.EMAIL] = userData.email;
        rowValues[SHEET_CONFIG.INDEX.PHONE] = userData.phone || '';
        rowValues[SHEET_CONFIG.INDEX.UNIVERSITY] = userData.university || '';
        rowValues[SHEET_CONFIG.INDEX.DEPARTMENT] = userData.department || '';
        rowValues[SHEET_CONFIG.INDEX.YEAR] = userData.year || '';
        rowValues[SHEET_CONFIG.INDEX.SELECTED_EVENT] = userData.theme || ''; // Mapping Theme -> Morning
        rowValues[SHEET_CONFIG.INDEX.POSTER_THEME] = userData.participationType || ''; // Mapping Participation -> Afternoon
        rowValues[SHEET_CONFIG.INDEX.TRANSACTION_ID] = userData.transactionId || '';
        rowValues[SHEET_CONFIG.INDEX.IEEE_MEMBERSHIP] = userData.ieeeMembershipNumber || '';
        rowValues[SHEET_CONFIG.INDEX.STATUS] = 'Pending';
        rowValues[SHEET_CONFIG.INDEX.PASSWORD] = password;
        rowValues[SHEET_CONFIG.INDEX.GITHUB] = userData.github || '';
        rowValues[SHEET_CONFIG.INDEX.LINKEDIN] = ''; // Init empty
        rowValues[SHEET_CONFIG.INDEX.SLUG] = slug;
        rowValues[SHEET_CONFIG.INDEX.INSTAGRAM] = ''; // Init empty

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:${SHEET_CONFIG.COLUMNS.SLUG}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowValues],
            },
        });

        return { username, password };
    },

    /**
     * Get all users from the sheet.
     */
    async getAllUsers() {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:${SHEET_CONFIG.COLUMNS.SLUG}`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        return rows.slice(1).map((row, index) => ({
            rowIndex: index + 2,
            timestamp: row[SHEET_CONFIG.INDEX.TIMESTAMP],
            name: row[SHEET_CONFIG.INDEX.NAME],
            email: row[SHEET_CONFIG.INDEX.EMAIL],
            phone: row[SHEET_CONFIG.INDEX.PHONE],
            university: row[SHEET_CONFIG.INDEX.UNIVERSITY],
            department: row[SHEET_CONFIG.INDEX.DEPARTMENT],
            year: row[SHEET_CONFIG.INDEX.YEAR],
            selectedEvent: row[SHEET_CONFIG.INDEX.SELECTED_EVENT],
            posterTheme: row[SHEET_CONFIG.INDEX.POSTER_THEME],
            transactionId: row[SHEET_CONFIG.INDEX.TRANSACTION_ID],
            ieeeMembershipNumber: row[SHEET_CONFIG.INDEX.IEEE_MEMBERSHIP],
            status: row[SHEET_CONFIG.INDEX.STATUS] || 'Pending',
            github: row[SHEET_CONFIG.INDEX.GITHUB],
            linkedin: row[SHEET_CONFIG.INDEX.LINKEDIN],
            slug: row[SHEET_CONFIG.INDEX.SLUG],
            instagram: row[SHEET_CONFIG.INDEX.INSTAGRAM],
        }));
    },

    async updateUserStatus(rowIndex: number, newStatus: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${SHEET_CONFIG.COLUMNS.STATUS}${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[newStatus]] }
        });
    },

    async updateUserDetails(rowIndex: number, data: any) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        // We need to adhere to the config columns. Updating row-by-row might be safest or constructing the full array to update.
        // Original logic updated chunks: B:I, N:O, etc.
        // With current config, we can constructing the sparse array if we want, but updating ranges is efficient.
        // Let's rely on the fact that we know the columns from CONFIG.

        // Update Name..Participation (B..I)
        const range1Start = SHEET_CONFIG.COLUMNS.NAME;
        const range1End = SHEET_CONFIG.COLUMNS.POSTER_THEME;
        const startIdx = SHEET_CONFIG.INDEX.NAME;
        const endIdx = SHEET_CONFIG.INDEX.POSTER_THEME;

        // Construct array from data
        const rowValues1 = [
            data.name,
            data.email,
            data.phone,
            data.university,
            data.department,
            data.year,
            data.theme, // Morning
            data.participationType // Afternoon
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${range1Start}${rowIndex}:${range1End}${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [rowValues1] }
        });

        // Update Github..LinkedIn (P..M) - Wait, P and M are not contiguous logically (M=12, P=15)
        // With new mapping: M=LinkedIn, N=Status, O=Password, P=Github
        // Q=Instagram, R=Slug

        // Let's update in chunks or sparsely.
        // Update Github (P)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${SHEET_CONFIG.COLUMNS.GITHUB}${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[data.github || '']] }
        });

        // Update LinkedIn (M)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${SHEET_CONFIG.COLUMNS.LINKEDIN}${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[data.linkedin || '']] }
        });

        // Update Instagram (Q)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${SHEET_CONFIG.COLUMNS.INSTAGRAM}${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[data.instagram || '']] }
        });
    },

    async getUserConnections(email: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.CONNECTIONS}!A:G`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        // Need name map. This is heavy but necessary without DB JOIN.
        // Optimize: Maybe cache this? For now, fetch all users.
        const users = await this.getAllUsers();
        const emailToNameMap = new Map();
        users.forEach((u: any) => emailToNameMap.set(u.email.toLowerCase(), u.name));

        const normalizedEmail = email.trim().toLowerCase();

        return rows
            .filter((row: string[]) =>
                row[0]?.trim().toLowerCase() === normalizedEmail || row[1]?.trim().toLowerCase() === normalizedEmail
            )
            .map((row: string[]) => {
                const source = row[0]?.trim().toLowerCase();
                const target = row[1]?.trim().toLowerCase();
                const isTarget = target === normalizedEmail;

                const otherEmail = isTarget ? source : target;
                const otherNameRaw = isTarget ? row[3] : null; // Name stored if incoming
                const otherNameResolved = emailToNameMap.get(otherEmail) || otherNameRaw || 'Anonymous';

                return {
                    sourceEmail: row[0],
                    targetEmail: row[1],
                    timestamp: row[2],
                    sourceName: row[3],
                    sourcePhone: row[4],
                    note: row[5],
                    status: row[6] || 'Pending',
                    direction: isTarget ? 'incoming' : 'outgoing',
                    name: otherNameResolved
                };
            }).reverse();
    },

    async searchUsers(query: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");
        const allUsers = await this.getAllUsers(); // Can optimized to not parse everything
        const lowerQuery = query.toLowerCase();

        return allUsers
            .filter((user: any) =>
                (user.name?.toLowerCase() || '').includes(lowerQuery) ||
                (user.email?.toLowerCase() || '').includes(lowerQuery)
            )
            .map((user: any) => ({
                name: user.name,
                selectedEvent: user.selectedEvent,
                slug: user.slug
            }))
            .slice(0, 10);
    },

    async updateConnectionStatus(sourceEmail: string, targetEmail: string, newStatus: 'Accepted' | 'Rejected') {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.CONNECTIONS}!A:G`,
        });
        const rows = response.data.values;
        if (!rows) return false;

        const rowIndex = rows.findIndex((row: string[]) =>
            row[0]?.trim() === sourceEmail.trim() && row[1]?.trim() === targetEmail.trim()
        );

        if (rowIndex !== -1) {
            const sheetRow = rowIndex + 1;
            await sheets.spreadsheets.values.update({
                spreadsheetId: SHEET_ID,
                range: `${SHEET_CONFIG.SHEETS.CONNECTIONS}!G${sheetRow}`, // Status is G (6)
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [[newStatus]] }
            });
            return true;
        }
        return false;
    },

    /**
     * Get a single user by email.
     */
    async getUser(email: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:${SHEET_CONFIG.COLUMNS.SLUG}`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        const userRow = rows.find((row: string[]) => row[SHEET_CONFIG.INDEX.EMAIL]?.trim() === email.trim());

        if (userRow) {
            const connections = await this.getConnectionsCount(email);
            return {
                id: userRow[SHEET_CONFIG.INDEX.EMAIL],
                name: userRow[SHEET_CONFIG.INDEX.NAME],
                email: userRow[SHEET_CONFIG.INDEX.EMAIL],
                phone: userRow[SHEET_CONFIG.INDEX.PHONE],
                role: 'user',
                selectedEvent: userRow[SHEET_CONFIG.INDEX.SELECTED_EVENT],
                posterTheme: userRow[SHEET_CONFIG.INDEX.POSTER_THEME],
                transactionId: userRow[SHEET_CONFIG.INDEX.TRANSACTION_ID],
                ieeeMembershipNumber: userRow[SHEET_CONFIG.INDEX.IEEE_MEMBERSHIP],
                linkedin: userRow[SHEET_CONFIG.INDEX.LINKEDIN],
                slug: userRow[SHEET_CONFIG.INDEX.SLUG],
                instagram: userRow[SHEET_CONFIG.INDEX.INSTAGRAM],
                github: userRow[SHEET_CONFIG.INDEX.GITHUB],
                connections: connections,
            };
        }
        return null;
    },

    /**
     * Connections Logic
     */
    async addConnection(data: {
        sourceEmail?: string,
        targetEmail: string,
        sourceName?: string,
        sourcePhone?: string,
        note?: string
    }) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        try {
            await sheets.spreadsheets.values.append({
                spreadsheetId: SHEET_ID,
                range: SHEET_CONFIG.SHEETS.CONNECTIONS,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[
                        data.sourceEmail || '',
                        data.targetEmail,
                        new Date().toISOString(),
                        data.sourceName || '',
                        data.sourcePhone || '',
                        data.note || '',
                        'Pending'
                    ]],
                },
            });
            return true;
        } catch (error) {
            console.error("Error adding connection:", error);
            return false;
        }
    },

    async getConnectionsCount(email: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: `${SHEET_CONFIG.SHEETS.CONNECTIONS}!A:G`,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) return 0;

            const myEmail = email.trim().toLowerCase();
            const uniquePartners = new Set<string>();

            rows.forEach((row: string[]) => {
                const source = row[0]?.trim().toLowerCase();
                const target = row[1]?.trim().toLowerCase();
                const status = row[6]?.trim();

                if (source !== myEmail && target !== myEmail) return;
                if (status !== 'Accepted') return;

                const partner = source === myEmail ? target : source;
                if (partner) uniquePartners.add(partner);
            });

            return uniquePartners.size;
        } catch (error) {
            console.error("Error counting connections:", error);
            return 0;
        }
    },

    /**
     * Optimized fetch for Directory (Users + Connection Counts)
     */
    async getAllUsersWithConnectionCounts() {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        // 1. Fetch Users
        const usersRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:${SHEET_CONFIG.COLUMNS.SLUG}`,
        });
        const userRows = usersRes.data.values || [];

        // 2. Fetch Connections
        const connRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.CONNECTIONS}!A:G`,
        });
        const connRows = connRes.data.values || [];

        // 3. Map Connections
        const connectionsMap = new Map<string, Set<string>>();
        connRows.forEach(row => {
            const source = row[0]?.trim().toLowerCase();
            const target = row[1]?.trim().toLowerCase();
            const status = row[6]?.trim().toLowerCase(); // G is index 6

            if (status === 'accepted') {
                if (!connectionsMap.has(source)) connectionsMap.set(source, new Set());
                if (!connectionsMap.has(target)) connectionsMap.set(target, new Set());
                connectionsMap.get(source)?.add(target);
                connectionsMap.get(target)?.add(source);
            }
        });

        // 4. Transform Users
        return userRows.slice(1).map((row, index) => {
            const email = row[SHEET_CONFIG.INDEX.EMAIL]?.trim().toLowerCase();
            const count = connectionsMap.get(email)?.size || 0;

            return {
                id: row[SHEET_CONFIG.INDEX.EMAIL],
                rowIndex: index + 2,
                name: row[SHEET_CONFIG.INDEX.NAME],
                email: row[SHEET_CONFIG.INDEX.EMAIL],
                selectedEvent: row[SHEET_CONFIG.INDEX.SELECTED_EVENT], // Theme is Morning Event
                connections: count,
                posterTheme: row[SHEET_CONFIG.INDEX.POSTER_THEME],
                slug: row[SHEET_CONFIG.INDEX.SLUG]
            };
        });
    },

    async backfillSlugs() {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:${SHEET_CONFIG.COLUMNS.SLUG}`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return 0;

        let updatedCount = 0;
        const slugIndex = SHEET_CONFIG.INDEX.SLUG;
        const slugColLetter = SHEET_CONFIG.COLUMNS.SLUG;

        // Iterate rows (skip header)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const hasSlug = row[slugIndex] && row[slugIndex].trim().length > 0;

            if (!hasSlug) {
                const newSlug = generateSlug();
                const rowIndex = i + 1; // Google Sheets 1-indexed (and rows[0] is header, so i=1 is Row 2)

                // Oops, 'values.get' usually returns Header at 0? Yes.
                // So i=1 is Row 2. rowIndex = i + 1. Correct.

                await sheets.spreadsheets.values.update({
                    spreadsheetId: SHEET_ID,
                    range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${slugColLetter}${rowIndex}`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values: [[newSlug]] }
                });
                updatedCount++;
            }
        }
        return updatedCount;
    },

    async getUserBySlug(slug: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!A:${SHEET_CONFIG.COLUMNS.SLUG}`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        const userRow = rows.find((row: string[]) => row[SHEET_CONFIG.INDEX.SLUG]?.trim() === slug.trim());

        if (userRow) {
            // Fetch connection count via email
            const email = userRow[SHEET_CONFIG.INDEX.EMAIL];
            const connectionsCount = await this.getConnectionsCount(email);

            return {
                id: email, // Email still internal ID
                name: userRow[SHEET_CONFIG.INDEX.NAME],
                // email: email, // Hide email for public?
                role: 'user',
                selectedEvent: userRow[SHEET_CONFIG.INDEX.SELECTED_EVENT],
                linkedin: userRow[SHEET_CONFIG.INDEX.LINKEDIN],
                slug: userRow[SHEET_CONFIG.INDEX.SLUG],
                instagram: userRow[SHEET_CONFIG.INDEX.INSTAGRAM],
                github: userRow[SHEET_CONFIG.INDEX.GITHUB],
                posterTheme: userRow[SHEET_CONFIG.INDEX.POSTER_THEME],
                connections: connectionsCount,
            };
        }
        return null;
    },

    async getConnectionStatus(sourceEmail: string, targetEmail: string) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_CONFIG.SHEETS.CONNECTIONS}!A:G`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return 'None';

        const connection = rows.find((row: string[]) => {
            const s = row[0]?.trim().toLowerCase();
            const t = row[1]?.trim().toLowerCase();
            const se = sourceEmail.trim().toLowerCase();
            const te = targetEmail.trim().toLowerCase();
            return (s === se && t === te) || (s === te && t === se);
        });

        if (connection) {
            return connection[6] || 'Pending';
        }
        return 'None';
    },

    async getPassword(rowIndex: number) {
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: `${SHEET_CONFIG.SHEETS.FORM_RESPONSES}!${SHEET_CONFIG.COLUMNS.PASSWORD}${rowIndex}`,
            });

            return response.data.values?.[0]?.[0] || null;
        } catch (error) {
            return null;
        }
    }
};
