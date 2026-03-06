import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Transaction } from './types';
import { processTransactions } from './data-processor';

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
];

export async function getSheetData(): Promise<Transaction[]> {
    const stripQuotes = (str?: string) => str?.replace(/^["']|["']$/g, '');
    const sheetId = stripQuotes(process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
    const clientEmail = stripQuotes(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    const privateKey = stripQuotes(process.env.GOOGLE_PRIVATE_KEY)?.replace(/\\n/g, '\n');

    console.log('GOOGLE_SHEETS_SPREADSHEET_ID:', sheetId);
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', clientEmail);
    console.log('GOOGLE_PRIVATE_KEY length:', privateKey?.length);

    if (!sheetId || !clientEmail || !privateKey) {
        console.warn('Google Sheets environment variables are missing. Using mock data.');
        if (!sheetId) console.warn('Missing: GOOGLE_SHEETS_SPREADSHEET_ID');
        if (!clientEmail) console.warn('Missing: GOOGLE_SERVICE_ACCOUNT_EMAIL');
        if (!privateKey) console.warn('Missing: GOOGLE_PRIVATE_KEY');
        return [];
    }

    try {
        const auth = new JWT({
            email: clientEmail,
            key: privateKey,
            scopes: SCOPES,
        });

        const doc = new GoogleSpreadsheet(sheetId, auth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0]; // Assuming first sheet
        console.log('Fetching rows from sheet:', sheet.title);
        const rows = await sheet.getRows();
        console.log(`Successfully fetched ${rows.length} rows`);

        if (rows.length > 0) {
            console.log('First row raw data keys:', rows[0].toObject());
        }

        const rawData = rows.map(row => ({
            date: row.get('tanggal'),
            name: row.get('nama_penerima'),
            amount: row.get('nominal'),
            transaction_type: row.get('arah') === 'CR' ? 'IN' : 'OUT',
            category: row.get('keterangan'),
            note: row.get('keterangan'),
        }));

        const transactions = processTransactions(rawData);
        if (transactions.length > 0) {
            console.log('Successfully fetched real data. First transaction:', {
                date: transactions[0].date,
                name: transactions[0].memberName
            });
        }
        return transactions;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
}
