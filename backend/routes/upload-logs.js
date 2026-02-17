var express = require('express');
var router = express.Router();

const supabase = require('../db/supabase');
const logQueue = require('../queue');

router.route('/').all((req, res, next) => {
  next()
})
  .get(async function (req, res, next) {
    next(new Error('not implemented'))
  })
  .put((req, res, next) => {
    next(new Error('not implemented'))
  })
  .post(async function (req, res, next) {
    try {
      const payloadSize = JSON.stringify(req.body.payload).length;
      const priority = payloadSize < 1000 ? 1 : 10; // Simple heuristic: < 1KB = High Priority

      const job = await logQueue.add('upload-log', {
        timestamp: req.body.timestamp,
        level: req.body.level,
        message: req.body.message,
        payload: req.body.payload
      }, {
        priority, // Lower number = Higher priority
      });
      console.log(`Job added to queue with id: ${job.id}`);
      res.sendStatus(200);
    } catch (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: 'Queue error' });
    }
  })
  .delete((req, res, next) => {
    next(new Error('not implemented'))
  })

module.exports = router;