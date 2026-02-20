import { MetricsTime, Worker } from 'bullmq';
import connection from './connection';
import supabase from '../db/supabase';

const worker = new Worker('log-processing-queue', async job => {
    console.log(`Processing job ${job?.id} with data:`, job?.data);
    const { timestamp, level, message, payload } = job?.data;

    try {
        const { data, error } = await supabase
            .from('logs')
            .insert({
                timestamp,
                level,
                message,
                payload
            })
            .select();

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        console.log(`Job ${job?.id} completed. Data inserted:`, data);
        return data;

    } catch (error) {
        console.error(`Job ${job?.id} failed:`, error);
        throw error;
    }
}, {
    connection: connection as any,
    concurrency: 4,
    metrics: {
        maxDataPoints: MetricsTime.ONE_WEEK * 2,
    },
});

worker.on('completed', job => {
    console.log(`Job ${job?.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
});

export default worker;
