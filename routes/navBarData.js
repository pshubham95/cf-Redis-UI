var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('../sessions');
var navbarData = require('../navbarData');
router.get('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    res.status(200).json(navbarData.navbarData);
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
