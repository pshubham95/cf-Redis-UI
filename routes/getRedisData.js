var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('../sessions');
var client = require('./login');

router.get('/', function(req, res, next) {
  session.sess = req.session;
  if(session.sess.service_instance_name)
  {
    client.client.keys('*', function (err, keys) {
      if (err)
      {
        res.status(500).json({'status':'failed to perform operation'})
      }
      else
      {
        var data = [];
        for(var i = 0; i < keys.length ; i++)
        {
          data.push({'keys':keys[i]});
        }
        res.status(200).json(data);
        /*var remaining = keys.length;
        var data = [];
        var remaining = keys.length,j = 0;
        for(var i = 0; i < keys.length; i++)
        {
          client.client.get(keys[i],function (err,reply) {
            data.push({'key':keys[j],'value':reply});
            --remaining;
            j++;
            console.log(remaining);
            //console.log(reply);
            if(remaining === 0)
              res.status(200).json(data);

          });
        }*/
      }
    });
  }
  else {
    res.status(401).json({'status':'Not authorized'});
  }
});

module.exports = router;
