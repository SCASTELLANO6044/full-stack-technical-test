var express = require('express');
var router = express.Router();

const supabase = require('../db/supabase');
const logQueue = require('../queue');

router.route('/').all((req, res, next) => {
  next()
})
  .get(async function (req, res, next) {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select()
      console.log(error)
      res.json(data);
    } catch (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: 'Database error' });
    }
  })
  .put((req, res, next) => {
    next(new Error('not implemented'))
  })
  .post(async function (req, res, next) {
    try {
      const job = await logQueue.add('upload-log', {
        timestamp: req.body.timestamp,
        level: req.body.level,
        message: req.body.message,
        payload: req.body.payload
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