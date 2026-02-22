import logQueue from "@/queue";

/**
 * @openapi
 * /api/queue-status:
 *   get:
 *     summary: Get queue status counts
 *     description: Returns the number of jobs in different states (waiting, active, completed, failed, etc.).
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 waiting:
 *                   type: integer
 *                 active:
 *                   type: integer
 *                 completed:
 *                   type: integer
 *                 failed:
 *                   type: integer
 *                 delayed:
 *                   type: integer
 *                 paused:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 */
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