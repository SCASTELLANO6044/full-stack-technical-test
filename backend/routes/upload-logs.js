var express = require('express');
var router = express.Router();
const pgp = require('pg-promise')();

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
}).post(async function(req, res, next) {
  try{
    const query = pgp.helpers.insert(req.body, ['timestamp', 'level', 'message','payload'], 'logs')
    await db.none(query);
    res.sendStatus(200)
  }catch(error){
    console.error('ERROR:', error);
    res.status(500).json({ error: 'Database error' });
  }
}).delete((req, res, next) => {
  next(new Error('not implemented'))
})

module.exports = router;