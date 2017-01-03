var express = require('express');
var router = express.Router();
var path = require('path');
var client = require('./login');
var session = require('../sessions');
var fs = require('fs');
var RedisDump = require('node-redis-dump');

router.post('/', function(req, res, next) {
  session.sess = req.session;
  var dump;
  if(session.sess.service_instance_name)
  {
    var db_dump = new RedisDump({client: client.client});
    dump = req.files.sampleFile;
    if(dump.name.split('.').pop() != 'redis')
    {
      res.status('500').json({'error':'Only .redis files allowed'});
    }
    else
    {
      dump.mv('dump.redis',function(err){
        if(err)
        {
          res.status(500).json({'status':'Failed to import'});
        }
        else
        {
          fs.readFile('dump.redis',{encoding: 'utf-8'},function(err,data){
            if(err)
            {
              res.status(500).json({'status':'Failed to import'});
              return;
            }
            else
            {
              db_dump.import({
                type: 'redis',
                db: 0,
                data: data,
                clear: true,
                callback: function(err, report) {
                  'use strict';
                  fs.unlink('dump.redis');
                  if (err) {
                    console.log(err);
                    res.status(500).json({'status':'Failed to import'});
                    return;
                  }
                  else
                  {

                    res.sendFile(path.join(__dirname,'../public','dashboard.html')); 

                  }
                  console.log('Report:', report);
                }
            });
            }
          })

        }

      });
    } 
  }
  else
  {
    res.status(401).json({'status':'Not authorized'});
  }

});

module.exports = router;
