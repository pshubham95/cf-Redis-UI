var express = require('express');
var router = express.Router();
var path = require('path');
var client = require('./login');
var session = require('../sessions');

router.delete('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    client.client.del(req.get('key'),function (err,reply) {
      if(err)
      {
        res.status(500).json({'status':'opertation failed'});
      }
      else {
        res.status(200).json({'status':'key deleted'});
      }
    });
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
