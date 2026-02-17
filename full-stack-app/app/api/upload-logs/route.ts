import supabase from "@/db/supabase";

export async function POST(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase.from('logs').insert(body);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(data), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}
