import supabase from "@/db/supabase";

export async function GET(request: Request) {
    // For example, fetch data from your DB here
    const { data: logs } = await supabase.from('logs').select('*');
    return new Response(JSON.stringify(logs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}