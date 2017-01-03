var express = require('express');
var router = express.Router();
var path = require('path');
var client = require('./login');
var session = require('../sessions');
router.post('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    var command = req.body.command.split(' ');
    var command_name = command.shift();
    console.log(command,command_name);
  	client.client.send_command(command_name,command, function(err,reply){
      console.log(reply,err);

      if(err)
      {
        res.status(500).json({'status':'Operation failed'});
      }
      else
      {
        res.status(200).json({'output':reply})
      }
      });
    
    /*client.client.send_command('set set myValue',undefined,function(err,reply){
    	console.log(reply,err);
    	if(err)
    	{
    		res.status(500).json({'status':'Operation failed'});
    	}
    	else
    	{
    		res.status(200).json({'output':reply})
    	}
    })*/
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
