
// Single Source of Truth for Google Sheets Configuration

// Note: Column mappings reflect the current sheet structure (Shifted Left after Team Name removal).
// Helper to convert letter to index (A=0, B=1, etc.)
const col = (letter: string) => {
    let column = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column - 1;
};

export const SHEET_CONFIG = {
    SPREADSHEET_ID: process.env.GOOGLE_SHEET_ID,
    SHEETS: {
        FORM_RESPONSES: 'Form Responses 1',
        CONNECTIONS: 'Connections'
    },
    // Define column letters (USER FACING - Easy to change)
    COLUMNS: {
        TIMESTAMP: 'A',
        NAME: 'B',
        EMAIL: 'C',
        PHONE: 'D',
        UNIVERSITY: 'E',
        DEPARTMENT: 'F',
        YEAR: 'G',
        EVENT_MORNING: 'H', // Was 'Theme'
        EVENT_AFTERNOON: 'I', // Was 'ParticipationType'
        TRANSACTION_ID: 'J', // Shifted from K
        IEEE_MEMBERSHIP: 'K', // Shifted from L
        LINKEDIN: 'M',
        STATUS: 'O', // Shifted from M
        PASSWORD: 'P', // Shifted from N
        GITHUB: 'Q', // Replaces ANYTHING_ELSE
        INSTAGRAM: 'R', // Shifted from R
        SLUG: 'S' // Shifted from Q
    },
    // Corresponding Indices (Calculated automatically or explicitly mapped if needed for logic)
    get INDEX() {
        return {
            TIMESTAMP: col(this.COLUMNS.TIMESTAMP),
            NAME: col(this.COLUMNS.NAME),
            EMAIL: col(this.COLUMNS.EMAIL),
            PHONE: col(this.COLUMNS.PHONE),
            UNIVERSITY: col(this.COLUMNS.UNIVERSITY),
            DEPARTMENT: col(this.COLUMNS.DEPARTMENT),
            YEAR: col(this.COLUMNS.YEAR),
            EVENT_MORNING: col(this.COLUMNS.EVENT_MORNING),
            EVENT_AFTERNOON: col(this.COLUMNS.EVENT_AFTERNOON),
            TRANSACTION_ID: col(this.COLUMNS.TRANSACTION_ID),
            IEEE_MEMBERSHIP: col(this.COLUMNS.IEEE_MEMBERSHIP),
            STATUS: col(this.COLUMNS.STATUS),
            PASSWORD: col(this.COLUMNS.PASSWORD),
            GITHUB: col(this.COLUMNS.GITHUB),
            LINKEDIN: col(this.COLUMNS.LINKEDIN),
            SLUG: col(this.COLUMNS.SLUG),
            INSTAGRAM: col(this.COLUMNS.INSTAGRAM)
        };
    }
};
