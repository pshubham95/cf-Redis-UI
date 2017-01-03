var express = require('express');
var router = express.Router();
var path = require('path');
var client = require('./login');
var session = require('../sessions');

/* GET home page. */
router.post('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    client.client.set(req.body.key,req.body.value,function (err,reply) {
      if(err)
        res.status(500).json({'status':'Operation failed'});
      else {
        res.status(200).json({'status':'operation success'});
      }

    })
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
