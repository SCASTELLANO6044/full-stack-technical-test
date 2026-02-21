import logQueue from "@/queue";

export async function GET() {
    try {
        const counts = await logQueue.getJobCounts(
            "waiting",
            "active",
            "completed",
            "failed",
            "delayed",
            "paused"
        );

        return new Response(JSON.stringify(counts), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error getting queue status:", error);
        return new Response(JSON.stringify({ error: "Queue error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}