var express = require('express');
var router = express.Router();
var path = require('path');
var client = require('./login');
var session = require('../sessions');
var dump = require('node-redis-dump');

router.get('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    var redis_dump = new dump({client:client.client});
    redis_dump.export({
      type: req.query.export_type,
      callback: function(err,data){
        if(err)
        {
          res.status(500).json({'status':'operation failed'});
        }
        else
        {
          switch(req.query.export_type)
          {
            case 'redis': /*res.setHeader('Content-disposition', 'attachment; filename=db.'+(new Date().getTime())+'.redis');
                          res.setHeader('Content-type', 'text/plain');
                          res.charset = 'UTF-8';
                          res.write(data);
                          res.end();*/
                          res.setHeader('Content-disposition', 'attachment; filename=db.'+new Date().getTime()+'.redis');
                          res.setHeader('Content-type', 'text/plain');
                          res.charset = 'UTF-8';
                          res.write(data);
                          res.end();
                          break;
            case 'json':  res.setHeader('Content-disposition', 'attachment; filename=db.'+new Date().getTime()+'.json');
                          res.setHeader('Content-type', 'application/json');
                          res.charset = 'UTF-8';
                          res.write(JSON.stringify(data));
                          res.end();
                          break;
          }
        }
        console.log(err,data);
        
      }
    });
    /*client.client.keys('*', function (err, keys) {
      if (err)
      {
        res.status(500).json({'status':'failed to perform operation'})
      }
      else
      {
        var j = 0,remaining = keys.length,data = [];
        for(var i = 0; i < keys.length; i++)
        {
          client.client.get(keys[i],function(err,reply){
            var key_value = {};
            key_value[keys[j]] = reply;
            data.push(key_value);
            j++;
            remaining--;
            if(remaining === 0)
            {
              res.setHeader('Content-disposition', 'attachment; filename=data.json');
              res.setHeader('Content-type', 'application/json');
              res.charset = 'UTF-8';
              res.write(JSON.stringify(data));
              res.end();
            }
            console.log(remaining);

          });
        }
      }
    });*/
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
