import supabase from "@/db/supabase";

export async function GET() {
    try {
        const { data: stats, error } = await supabase
            .from("log_stats")
            .select("*")
            .order("processed_at", { ascending: false });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}