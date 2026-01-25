var express = require('express');
var router = express.Router();

const db = require('../db')

router.route('/').all((req, res, next) => {
  next()
}).get(async function (req, res, next) {
  try {
    const logs = await db.any('SELECT * FROM logs');
    res.json(logs);
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ error: 'Database error' });
  }
}).put((req, res, next)=>{
  next(new Error('not implemented'))
}).post((req, res, next) => {
  console.log(req.body)
  res.json(req.body)
  next(new Error('not implemented'))
}).delete((req, res, next) => {
  next(new Error('not implemented'))
})

module.exports = router;