import { NextRequest } from "next/server";
import supabase from "@/db/supabase";

/**
 * @openapi
 * /api/stats/{jobId}:
 *   get:
 *     summary: Get statistics for a specific job
 *     description: Returns the processed log statistics for a given job ID.
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to fetch stats for.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 job_id:
 *                   type: string
 *                 file_name:
 *                   type: string
 *                 line_count:
 *                   type: integer
 *                 error_count:
 *                   type: integer
 *                 processed_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Stats not found
 *       500:
 *         description: Internal Server Error
 */
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
