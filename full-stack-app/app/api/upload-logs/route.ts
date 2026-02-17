import logQueue from "@/queue";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const payloadSize = JSON.stringify(body?.payload as any).length;
        const priority = payloadSize < 1000 ? 1 : 10; // Simple heuristic: < 1KB = High Priority

        const job = await logQueue.add('upload-log', {
            timestamp: body?.timestamp as any,
            level: body?.level as any,
            message: body?.message as any,
            payload: body?.payload as any
        }, {
            priority, // Lower number = Higher priority
        });
        console.log(`Job added to queue with id: ${job.id}`);
        return new Response(JSON.stringify({ job }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('ERROR:', error);
        return new Response(JSON.stringify({ error: 'Queue error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
