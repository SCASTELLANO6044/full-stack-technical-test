var express = require('express');
var router = express.Router();

const supabase = require('../db/supabase');

router.param('stats_id', async function(req, res, next, id){
  try{
    const { data, error } = await supabase
      .from('logs')
      .select()
      .eq('id', id)
    req.log = data
    if (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: 'Database error' });
    }
    next()
  } catch (error) {
    console.error('ERROR:', error);
  }
})

router.route('/:stats_id').all((req, res, next) => {
  next()
}).get((req, res, next) => {
  res.json(req.log)
}).put((req, res, next)=>{
  next(new Error('not implemented'))
}).post((req, res, next) => {
  next(new Error('not implemented'))
}).delete((req, res, next) => {
  next(new Error('not implemented'))
})

router.route('/').all((req, res, next) => {
  next()
}).get((req, res, next) => {
  res.send('Comming soon');
}).put((req, res, next)=>{
  next(new Error('not implemented'))
}).post((req, res, next) => {
  next(new Error('not implemented'))
}).delete((req, res, next) => {
  next(new Error('not implemented'))
})

module.exports = router;