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

  	req.session.destroy();
  	client.client.end();
  }
  
	res.sendFile(path.join(__dirname,'../public','login.html'));
});

module.exports = router;
