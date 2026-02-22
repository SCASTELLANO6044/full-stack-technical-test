import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import logQueue from "@/queue";

/**
 * @openapi
 * /api/upload-logs:
 *   post:
 *     summary: Upload a log file
 *     description: Uploads a log file to the server and adds it to the processing queue.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The log file to upload.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                   description: The ID of the job added to the queue.
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return new Response(
                JSON.stringify({ error: "No file provided. Send a file with key 'file' in form-data." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Generate a unique file ID and save to disk
        const fileId = randomUUID();
        const uploadsDir = path.join(process.cwd(), "data", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const originalName = (file as File).name || "unknown.txt";
        const filePath = path.join(uploadsDir, `${fileId}.txt`);
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // Prioritize smaller files (< 1KB = high priority)
        const priority = buffer.length < 1000 ? 1 : 10;

        const job = await logQueue.add("upload-log", {
            fileId,
            filePath,
            originalName,
        }, {
            priority,
        });

        console.log(`Job added to queue with id: ${job.id}`);

        return new Response(
            JSON.stringify({ jobId: job.id }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("ERROR:", error);
        return new Response(
            JSON.stringify({ error: "Queue error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
