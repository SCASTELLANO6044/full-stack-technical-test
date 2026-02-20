import { Queue } from "bullmq";
import connection from "./connection";

const logQueue = new Queue('log-processing-queue',
    {
        connection: connection as any,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        }
    });

export default logQueue;