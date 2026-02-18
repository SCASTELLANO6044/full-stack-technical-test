import logQueue from "@/queue";
import { MetricsTime } from "bullmq";

export async function GET() {
    try {
        const metrics = await logQueue.getMetrics('completed', 0, MetricsTime.ONE_WEEK * 2);
        return new Response(JSON.stringify(metrics), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error getting queue status:', error);
        return new Response(JSON.stringify({ error: 'Queue error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}