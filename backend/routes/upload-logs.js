var express = require('express');
var router = express.Router();

const supabase = require('../db/supabase');

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
.put((req, res, next)=>{
  next(new Error('not implemented'))
})
.post(async function(req, res, next) {
  try{
    const { data, error } = await supabase
      .from('logs')
      .insert({timestamp: req.body.timestamp, level: req.body.level, message: req.body.message, payload: req.body.payload })
      .select()
    if (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: 'Database error' });
    }
    res.sendStatus(200)
  }catch(error){
    console.error('ERROR:', error);
    res.status(500).json({ error: 'Database error' });
  }
})
.delete((req, res, next) => {
  next(new Error('not implemented'))
})

module.exports = router;