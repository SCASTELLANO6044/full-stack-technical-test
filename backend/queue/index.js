const { Queue } = require('bullmq');
const connection = require('./connection');

const logQueue = new Queue('log-queue',
    { connection },
    {
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        }
    });

module.exports = logQueue;
