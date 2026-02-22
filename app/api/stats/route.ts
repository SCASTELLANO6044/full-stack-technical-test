import supabase from "@/db/supabase";

/**
 * @openapi
 * /api/stats:
 *   get:
 *     summary: Get all log statistics
 *     description: Returns a list of all processed log statistics from the database.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   job_id:
 *                     type: string
 *                   file_name:
 *                     type: string
 *                   line_count:
 *                     type: integer
 *                   error_count:
 *                     type: integer
 *                   processed_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal Server Error
 */
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