import { NextRequest } from "next/server";
import supabase from "@/db/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;

    const { data: stat, error } = await supabase
        .from("log_stats")
        .select("*")
        .eq("job_id", jobId);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!stat || stat.length === 0) {
        return new Response(JSON.stringify({ error: "Stats not found for this job" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(stat[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
