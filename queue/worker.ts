import { createReadStream } from "fs";
import { createInterface } from "readline";
import { MetricsTime, Worker } from "bullmq";
import connection from "./connection";
import supabase from "../db/supabase";

// Configurable tracked keywords from .env (comma-separated)
const TRACKED_KEYWORDS = (process.env.TRACKED_KEYWORDS || "error,timeout,failed,unauthorized")
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

// Regex to extract IPs from strings
const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

// Log line format: [TIMESTAMP] LEVEL MESSAGE {optional JSON payload}
const LOG_LINE_REGEX = /^\[(.+?)\]\s+(DEBUG|INFO|WARN|ERROR)\s+(.+?)(\s+\{.*\})?\s*$/;

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    payload: Record<string, unknown>;
}

function parseLine(line: string): LogEntry | null {
    const match = line.match(LOG_LINE_REGEX);
    if (!match) return null;

    const [, timestamp, level, message, rawPayload] = match;
    let payload: Record<string, unknown> = {};
    if (rawPayload) {
        try {
            payload = JSON.parse(rawPayload.trim());
        } catch {
            payload = { raw: rawPayload.trim() };
        }
    }
    return { timestamp, level, message, payload };
}

async function processLogFile(filePath: string): Promise<{
    totalLines: number;
    errorCount: number;
    keywordHits: Record<string, number>;
    ipAddresses: string[];
    entries: LogEntry[];
}> {
    const entries: LogEntry[] = [];
    let totalLines = 0;
    let errorCount = 0;
    const keywordHits: Record<string, number> = {};
    const ipSet = new Set<string>();

    // Initialize keyword counters
    for (const kw of TRACKED_KEYWORDS) {
        keywordHits[kw] = 0;
    }

    const fileStream = createReadStream(filePath, { encoding: "utf-8" });
    const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
        if (!line.trim()) continue;
        totalLines++;

        const entry = parseLine(line);
        if (!entry) continue;

        entries.push(entry);

        // Track errors
        if (entry.level === "ERROR") {
            errorCount++;
        }

        // Track keyword hits (search in the full line, case-insensitive)
        const lowerLine = line.toLowerCase();
        for (const kw of TRACKED_KEYWORDS) {
            if (lowerLine.includes(kw)) {
                keywordHits[kw]++;
            }
        }

        // Extract IPs from payload
        const payloadStr = JSON.stringify(entry.payload);
        const ips = payloadStr.match(IP_REGEX);
        if (ips) {
            for (const ip of ips) ipSet.add(ip);
        }
    }

    return {
        totalLines,
        errorCount,
        keywordHits,
        ipAddresses: Array.from(ipSet),
        entries,
    };
}

const worker = new Worker(
    "log-processing-queue",
    async (job) => {
        console.log(`Processing job ${job.id} — file: ${job.data.filePath}`);
        const { fileId, filePath, originalName } = job.data;

        const stats = await processLogFile(filePath);

        const { data, error } = await supabase
            .from("log_stats")
            .insert({
                job_id: job.id,
                file_id: fileId,
                file_name: originalName,
                total_lines: stats.totalLines,
                error_count: stats.errorCount,
                keyword_hits: stats.keywordHits,
                ip_addresses: stats.ipAddresses,
                entries: stats.entries,
            })
            .select();

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        console.log(`Job ${job.id} completed. Stats stored:`, data);
        return data;
    },
    {
        connection: connection as any,
        concurrency: 4,
        metrics: {
            maxDataPoints: MetricsTime.ONE_WEEK * 2,
        },
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job?.id} has completed!`);
});

worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
});

export default worker;
