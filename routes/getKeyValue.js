var express = require('express');
var router = express.Router();
var path = require('path');
var client = require('./login');
var session = require('../sessions');

/* GET home page. */
router.get('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    console.log(req.get('key'))
    client.client.get(req.get('key'),function (err,reply) {
      res.status(200).json(reply);
    });
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
