var express = require('express');
var router = express.Router();
var redis = require('redis');
var session = require('../sessions');
var cfenv = require('cfenv');
var config = require('../config');
var appEnv = cfenv.getAppEnv();
var services = appEnv.getServices();
var navbarData = require('../navbarData');

var client;

router.post('/', function(req, res, next) {

    if(Object.keys(services).length == 0)
    {

      client = redis.createClient(6379,'localhost');
      client.on('connect', function() {
        console.log('connected');
        session.sess = req.session;
        session.sess.service_instance_name = req.body.serv_instance_name;
        navbarData.navbarData[0]['label'] = 'Local DB';
        res.status(200).json({'status':'operation successful'});
      });
      module.exports.client = client;
    }
    else
    {
      
      var password = services[config.service_instance_name]['credentials']['password'];
      if(req.body.serv_instance_name == config.service_instance_name && req.body.password == password)
      {
        console.log('here');
        client = redis.createClient(services[config.service_instance_name]['credentials']['port'],services[config.service_instance_name]['credentials']['host']);
        client.auth(password, function (err)
        {
            if (err)
            {
                console.log(err);
                res.status(500);
            }

            else
            {
                console.log('connected');
                session.sess = req.session;
                session.sess.service_instance_name = req.body.serv_instance_name;
                navbarData.navbarData[0]['label'] = req.body.serv_instance_name;

                res.status(200).json({'status':'operation successful'});

            }
        });
        module.exports.client = client;
    }
    else
    {
        res.status(401).json({'status':'failed to log in'});
    }
  }
});

module.exports = router;
