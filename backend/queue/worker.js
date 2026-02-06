const { Worker } = require('bullmq');
const connection = require('./connection');
const supabase = require('../db/supabase');

const worker = new Worker('log-queue', async job => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    const { timestamp, level, message, payload } = job.data;

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

        console.log(`Job ${job.id} completed. Data inserted:`, data);
        return data;

    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });

worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = worker;
