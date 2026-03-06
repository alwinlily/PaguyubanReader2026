import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';
import { generateMockTransactions } from '@/lib/data-processor';

export async function GET() {
    try {
        const data = await getSheetData();
        console.log(`API: Received ${data.length} transactions from getSheetData`);

        // If no data (likely missing credentials), provide mock data for now
        if (data.length === 0) {
            console.log('API: Data length is 0, using mock data as backup');
            return NextResponse.json(generateMockTransactions(100));
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        // Return mock data even on error during development
        return NextResponse.json(generateMockTransactions(100));
    }
}
