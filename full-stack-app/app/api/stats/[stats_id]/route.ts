import { NextRequest } from 'next/server';
import supabase from '@/db/supabase';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ stats_id: string }> },
) {
    const stats_id = (await params).stats_id;
    const { data: log, error } = await supabase
        .from('logs')
        .select('*')
        .eq('id', stats_id);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!log || log.length === 0) {
        return new Response(JSON.stringify({ error: 'Log not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(log[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}