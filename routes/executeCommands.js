var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('../sessions');

var appDir = path.dirname(require.main.filename);
/* GET home page. */
router.get('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
    res.sendFile(path.join(__dirname,'../public','execute_command.html'));
  else {
  	res.sendFile(path.join(__dirname,'../public','login.html'));
  }
});

module.exports = router;
