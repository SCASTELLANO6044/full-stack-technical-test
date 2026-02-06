const { Queue } = require('bullmq');
const connection = require('./connection');

const logQueue = new Queue('log-queue', { connection });

module.exports = logQueue;
